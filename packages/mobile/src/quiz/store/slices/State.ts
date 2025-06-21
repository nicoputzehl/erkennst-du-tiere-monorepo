import type { StateCreator } from "zustand";
import { HintUtils } from "../../domain/hints";
import { QuizUtils } from "../../domain/quiz";
import { createQuizState } from "../../domain/quiz/factories";
import { isCompleted } from "../../domain/quiz/statistics";
import type { Quiz, QuizState } from "../../types";
import type { ContextualHint } from "../../types/hint";
import type { QuizStore } from "../Store";

interface AnswerResult {
	isCorrect: boolean;
	newState?: QuizState;
	nextQuestionId?: number;
	unlockedQuizzes: Quiz[];
	completedQuiz: boolean;
	triggeredHints?: ContextualHint[];
}

export interface QuizStateSlice {
	quizStates: Record<string, QuizState>; // PERSISTED
	initializeQuizState: (quizId: string) => QuizState | null;
	updateQuizState: (quizId: string, newState: QuizState) => void;
	resetQuizState: (quizId: string) => QuizState | null;
	resetAllQuizStates: () => void;
	answerQuestion: (
		quizId: string,
		questionId: number,
		answer: string,
	) => Promise<AnswerResult>;
	startQuiz: (quizId: string) => Promise<QuizState | null>;
	resetQuiz: (quizId: string) => Promise<QuizState | null>;
	getQuizProgress: (quizId: string) => number;
	getQuizProgressString: (quizId: string) => string | null;
	getNextActiveQuestion: (
		quizId: string,
		currentQuestionId?: number,
	) => number | null;
}

export const createQuizStateSlice: StateCreator<
	QuizStore,
	[],
	[],
	QuizStateSlice
> = (set, get, store) => ({
	quizStates: {},
	initializeQuizState: (quizId: string) => {
		const { quizStates, quizzes, quizConfigs } = get(); // Zugriff auf den gesamten Store
		if (quizStates[quizId]) {
			return quizStates[quizId];
		}
		const quiz = quizzes[quizId];
		const config = quizConfigs[quizId];
		if (!quiz || !config) {
			console.warn(
				`[QuizStateSlice] Quiz ${quizId} not found for initialization`,
			);
			return null;
		}
		const newState = createQuizState(quiz, {
			initialUnlockedQuestions: config.initialUnlockedQuestions || 2,
		});
		set((state) => ({
			quizStates: { ...state.quizStates, [quizId]: newState },
		}));
		return newState;
	},
	updateQuizState: (quizId: string, newState: QuizState) => {
		console.log(
			`[QuizStateSlice] Updating quiz state for ${quizId}: ${newState.completedQuestions}/${newState.questions.length} completed`,
		);
		set((state) => ({
			quizStates: { ...state.quizStates, [quizId]: newState },
		}));
	},
	resetQuizState: (quizId: string) => {
		const { quizzes, quizConfigs } = get();
		const quiz = quizzes[quizId];
		const config = quizConfigs[quizId];
		if (!quiz || !config) return null;
		const newState = createQuizState(quiz, {
			initialUnlockedQuestions: config.initialUnlockedQuestions || 2,
		});
		set((state) => ({
			quizStates: { ...state.quizStates, [quizId]: newState },
		}));
		return newState;
	},
	// This resetAllQuizStates is now handled globally in the main store to coordinate slices.
	// The slice-specific logic for resetting quizStates is incorporated there.
	resetAllQuizStates: () => {
		// This action will be overridden by the global one in the main store,
		// which handles resetting across all relevant slices.
		// This dummy implementation is here to satisfy the interface.
		console.warn(
			"[QuizStateSlice] resetAllQuizStates called from slice; should be handled globally.",
		);
	},
	startQuiz: async (quizId: string): Promise<QuizState | null> => {
		console.log(`[QuizStateSlice] Starting quiz: ${quizId}`);
		const state = get().initializeQuizState(quizId);
		if (state) {
			get().setCurrentQuiz(quizId); // Zugriff auf setCurrentQuiz aus UISlice
		}
		return state;
	},
	resetQuiz: async (quizId: string): Promise<QuizState | null> => {
		console.log(`[QuizStateSlice] Resetting quiz: ${quizId}`);
		return get().resetQuizState(quizId);
	},

	// src/quiz/store/QuizState.slice.ts - FIXED answerQuestion without hint logic

	answerQuestion: async (
		quizId: string,
		questionId: number,
		answer: string,
	): Promise<AnswerResult> => {
		console.log(
			`[QuizStateSlice] Processing answer for quiz ${quizId}, question ${questionId}: "${answer}"`,
		);
		const {
			quizStates,
			updateQuizState,
			showToast,
			checkForUnlocks,
			addPoints,
			quizConfigs
		} = get(); // Removed recordWrongAnswer
		const currentState = quizStates[quizId];
		if (!currentState) {
			console.warn(`[QuizStateSlice] Quiz state not found for ${quizId}`);
			return {
				isCorrect: false,
				unlockedQuizzes: [],
				completedQuiz: false,
			};
		}
		const result = QuizUtils.calculateAnswerResult(
			currentState,
			questionId,
			answer,
		);
		if (!result.isCorrect) {
			console.log(
				`[QuizStateSlice] Incorrect answer for quiz ${quizId}, question ${questionId}`,
			);

			return {
				isCorrect: false,
				unlockedQuizzes: [],
				completedQuiz: false,
				// triggeredHints // Removed this too
			};
		}
		// Update state
		console.log(
			`[QuizStateSlice] Correct answer for quiz ${quizId}, question ${questionId}`,
			result.newState.completedQuestions
		);
		updateQuizState(quizId, result.newState);

		const question = result.newState.questions.find((q) => q.id === questionId);
		if (question) {
			const points = HintUtils.calculatePointsForCorrectAnswer(question);
			const transaction = HintUtils.createPointTransaction(
				"earned",
				points,
				"Frage korrekt beantwortet",
				quizId,
				questionId,
			);
			addPoints(transaction);
			console.log(
				`[QuizStateSlice] Awarded ${points} points for correct answer`,
			);
		}
		const config = quizConfigs[quizId];

		// Check completion
		// TODO nur den aktuellen Quiz State mit geben?
		// TODO checken ob schon die manipulierten States mitgegeben werden müssen
		const isQuizUnlocked = QuizUtils.isQuizUnlocked(config, quizStates);
		const completed = isCompleted(result.newState);

		const nextQuestionId = QuizUtils.getNextActiveQuestionId(result.newState);
		// Show completion toast
		if (completed) {
			showToast(
				`🎉 Quiz "${result.newState.title}" abgeschlossen!`,
				"success",
				4000,
			);
		}
		// Check for unlocks
		const unlockedQuizzes = isQuizUnlocked ? checkForUnlocks() : [];
		console.log(
			"[QuizStateSlice] ℹ️ Unlocked quizzes:", unlockedQuizzes
		)
		return {
			isCorrect: true,
			newState: result.newState,
			nextQuestionId: nextQuestionId || undefined,
			unlockedQuizzes,
			completedQuiz: completed,
		};
	},
	getQuizProgress: (quizId: string) => {
		const { quizStates } = get();
		const state = quizStates[quizId];
		if (!state?.questions?.length) return 0;
		return Math.round(
			(state.completedQuestions / state.questions.length) * 100,
		);
	},
	getQuizProgressString: (quizId: string) => {
		const { quizStates } = get();
		const state = quizStates[quizId];
		if (!state?.questions?.length) return null;
		return `${state.completedQuestions}/${state.questions.length}`;
	},
	getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => {
		const { quizStates } = get();
		const state = quizStates[quizId];
		if (!state) return null;
		return QuizUtils.getNextActiveQuestionId(state, currentQuestionId);
	},
});
