import type { StateCreator } from "zustand";
import {  HintUtils } from "@quiz-app/shared";

import type { QuizStore } from "../Store";
import { UseHintResult, HintTriggerResult, UsedHint, AutoFreeHint, PointTransaction, Hint, QuestionBase } from "@quiz-app/shared";


export interface HintSlice {
	applyHint: (
		quizId: string,
		questionId: number,
		hintId: string,
	) => Promise<UseHintResult>;
	recordWrongAnswer: (
		quizId: string,
		questionId: number,
		userAnswer: string,
	) => HintTriggerResult;
	getUsedHints: (quizId: string, questionId: number) => UsedHint[];
	checkAutoFreeHints: (quizId: string, questionId: number) => AutoFreeHint[];
	markAutoFreeHintAsUsed: (
		quizId: string,
		questionId: number,
		hintId: string,
	) => void;
	markHintAsUsed: (quizId: string, questionId: number, hintId: string) => void;
	addPoints: (transaction: PointTransaction) => void;
	deductPoints: (transaction: PointTransaction) => void;
	getPointsBalance: () => number;
	initializeHintState: (quizId: string, questionId: number) => void;
}

export const createHintSlice: StateCreator<QuizStore, [], [], HintSlice> = (
	set,
	get,
) => ({
	applyHint: async (
		quizId: string,
		questionId: number,
		hintId: string,
	): Promise<UseHintResult> => {
		const quizState = get().quizStates[quizId];
		const globalUserPoints = get().userPoints;

		if (!quizState) {
			return { success: false, error: "Quiz nicht gefunden" };
		}

		const question = quizState.questions.find((q) => q.id === questionId);
		const hint = question?.hints?.find((h) => h.id === hintId);
		const hintState = quizState.hintStates[questionId];

		if (!question || !hint || !hintState || !globalUserPoints) {
			return { success: false, error: "Daten nicht gefunden" };
		}

		// Validierung mit globalen Points
		const validation = HintUtils.canUseHint(hint, hintState, globalUserPoints);
		if (!validation.canUse) {
			return { success: false, error: validation.reason };
		}

		// Content generieren
		const content = HintUtils.generateHintContent(hint, question);
		const usedHint = generateUsedHint(hint, question);

		if (HintUtils.isAutoFreeHint(hint)) {
			// Auto-Free Hint: In beide Listen eintragen
			set((state) => ({
				quizStates: {
					...state.quizStates,
					[quizId]: {
						...state.quizStates[quizId],
						hintStates: {
							...state.quizStates[quizId].hintStates,
							[questionId]: {
								...state.quizStates[quizId].hintStates[questionId],
								usedHints: [
									...state.quizStates[quizId].hintStates[questionId].usedHints,
									usedHint,
								],
								autoFreeHintsUsed: [
									...(state.quizStates[quizId].hintStates[questionId]
										.autoFreeHintsUsed || []),
									hint.id,
								],
							},
						},
					},
				},
			}));

			return {
				success: true,
				hintContent: content,
				pointsDeducted: 0, // Auto-Free Hints kosten nichts
			};
		}


		const transaction = HintUtils.createPointTransaction(
			"spent",
			!HintUtils.isContextualHint(hint) && hint.cost ? hint.cost : 0,
			`Hint verwendet: ${hint.title}`,
			quizId,
			questionId,
			hintId,
		);

		set((state) => ({
			quizStates: {
				...state.quizStates,
				[quizId]: {
					...state.quizStates[quizId],
					hintStates: {
						...state.quizStates[quizId].hintStates,
						[questionId]: {
							...state.quizStates[quizId].hintStates[questionId],
							usedHints: [
								...state.quizStates[quizId].hintStates[questionId].usedHints,
								usedHint,
							],
						},
					},
				},
			},
			// GLOBALE Points Update
			userPoints: {
				...state.userPoints,
				totalPoints: state.userPoints.totalPoints - (!HintUtils.isContextualHint(hint) && hint.cost ? hint.cost : 0),
				spentPoints: state.userPoints.spentPoints + (!HintUtils.isContextualHint(hint) && hint.cost ? hint.cost : 0),
				pointsHistory: [...state.userPoints.pointsHistory, transaction],
			},
		}));

		return {
			success: true,
			hintContent: content,
			pointsDeducted: !HintUtils.isContextualHint(hint) && hint.cost ? hint.cost : 0,
		};
	},

	recordWrongAnswer: (
		quizId: string,
		questionId: number,
		userAnswer: string,
	): HintTriggerResult => {
		const quizState = get().quizStates[quizId];
		const question = quizState?.questions.find((q) => q.id === questionId);
		const hintState = quizState?.hintStates[questionId];

		if (!question || !hintState) {
			return { contextualHints: [], autoFreeHints: [] };
		}

		// Neue kombinierte Hint-Prüfung
		const triggerResult = HintUtils.checkTriggeredHints(
			userAnswer,
			question,
			hintState,
		);

		set((state) => ({
			quizStates: {
				...state.quizStates,
				[quizId]: {
					...state.quizStates[quizId],
					hintStates: {
						...state.quizStates[quizId].hintStates,
						[questionId]: {
							...state.quizStates[quizId].hintStates[questionId],
							wrongAttempts:
								state.quizStates[quizId].hintStates[questionId].wrongAttempts +
								1,
						},
					},
				},
			},
		}));

		return triggerResult;
	},

	checkAutoFreeHints: (quizId: string, questionId: number): AutoFreeHint[] => {
		const quizState = get().quizStates[quizId];
		const question = quizState?.questions.find((q) => q.id === questionId);
		const hintState = quizState?.hintStates[questionId];

		if (!question?.hints || !hintState) return [];

		return question.hints.filter(
			(hint): hint is AutoFreeHint =>
				hint.type === "auto_free" &&
				!hintState.usedHints.some((uh) => uh.id === hint.id) &&
				hintState.wrongAttempts >= hint.triggerAfterAttempts,
		);
	},

	markAutoFreeHintAsUsed: (
		quizId: string,
		questionId: number,
		hintId: string,
	) => {
		const quizState = get().quizStates[quizId];

		if (!quizState) return;

		const question = quizState.questions.find((q) => q.id === questionId);
		const hint = question?.hints?.find((h) => h.id === hintId);

		if (!question || !hint || !HintUtils.isAutoFreeHint(hint)) return;

		const usedHint = generateUsedHint(hint, question);

		set((state) => ({
			quizStates: {
				...state.quizStates,
				[quizId]: {
					...state.quizStates[quizId],
					hintStates: {
						...state.quizStates[quizId].hintStates,
						[questionId]: {
							...state.quizStates[quizId].hintStates[questionId],
							usedHints: [
								...state.quizStates[quizId].hintStates[questionId].usedHints,
								usedHint,
							],
							autoFreeHintsUsed: [
								...(state.quizStates[quizId].hintStates[questionId]
									.autoFreeHintsUsed || []),
								hintId,
							],
						},
					},
				},
			},
		}));
	},

	markHintAsUsed: (quizId: string, questionId: number, hintId: string) => {
		const quizState = get().quizStates[quizId];

		if (!quizState) return;

		const question = quizState.questions.find((q) => q.id === questionId);
		const hint = question?.hints?.find((h) => h.id === hintId);

		if (!question || !hint) return;

		const usedHint = generateUsedHint(hint, question);

		set((state) => ({
			quizStates: {
				...state.quizStates,
				[quizId]: {
					...state.quizStates[quizId],
					hintStates: {
						...state.quizStates[quizId].hintStates,
						[questionId]: {
							...state.quizStates[quizId].hintStates[questionId],
							usedHints: [
								...state.quizStates[quizId].hintStates[questionId].usedHints,
								usedHint,
							],
						},
					},
				},
			},
		}));
	},


	getUsedHints: (quizId: string, questionId: number): UsedHint[] => {
		const quizState = get().quizStates[quizId];
		const hintState = quizState?.hintStates[questionId];
		return hintState?.usedHints || [];
	},

	addPoints: (transaction: PointTransaction) => {
		set((state) => ({
			userPoints: {
				...state.userPoints,
				totalPoints: state.userPoints.totalPoints + transaction.amount,
				earnedPoints: state.userPoints.earnedPoints + transaction.amount,
				pointsHistory: [...state.userPoints.pointsHistory, transaction],
			},
		}));
	},

	deductPoints: (transaction: PointTransaction) => {
		set((state) => ({
			userPoints: {
				...state.userPoints,
				totalPoints: state.userPoints.totalPoints - transaction.amount,
				spentPoints: state.userPoints.spentPoints + transaction.amount,
				pointsHistory: [...state.userPoints.pointsHistory, transaction],
			},
		}));
	},

	getPointsBalance: (): number => {
		return get().userPoints?.totalPoints || 0;
	},

	initializeHintState: (quizId: string, questionId: number) => {
		set((state) => {
			if (!state.quizStates[quizId].hintStates[questionId]) {
				return {
					quizStates: {
						...state.quizStates,
						[quizId]: {
							...state.quizStates[quizId],
							hintStates: {
								...state.quizStates[quizId].hintStates,
								[questionId]: {
									questionId,
									usedHints: [],
									wrongAttempts: 0,
									autoFreeHintsUsed: [],
								},
							},
						},
					},
				};
			}
			return state;
		});
	},
});

const generateUsedHint = (hint: Hint, question: QuestionBase): UsedHint => {
	const content = HintUtils.generateHintContent(hint, question);

	return {
		id: hint.id,
		title: hint.title,
		content: content,
	};
};
