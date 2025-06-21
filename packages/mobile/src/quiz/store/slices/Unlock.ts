import type { StateCreator } from "zustand";
import { QuizUtils } from "../../domain/quiz";
import type { Quiz, UnlockCondition } from "../../types";
import type { QuizStore } from "../Store";

export interface UnlockSlice {
	pendingUnlocks: {
		quizId: string;
		quizTitle: string;
		unlockedAt: number;
		shown: boolean;
	}[];
	checkForUnlocks: () => Quiz[];
	isQuizUnlocked: (quizId: string) => boolean;
	getUnlockProgress: (quizId: string) => {
		condition: UnlockCondition | null;
		progress: number;
		isMet: boolean;
	};
	detectMissedUnlocks: () => void;
	addPendingUnlock: (quizId: string, quizTitle: string) => void;
}

export const createUnlockSlice: StateCreator<QuizStore, [], [], UnlockSlice> = (
	set,
	get,
	store,
) => ({
	pendingUnlocks: [],
	checkForUnlocks: () => {
		const { quizConfigs, quizStates, quizzes, showToast, addPendingUnlock } =
			get(); // Zugriff auf andere Slices
		const unlockedQuizzes: Quiz[] = [];
		for (const config of Object.values(quizConfigs)) {
			if (config.initiallyLocked && config.unlockCondition) {
				const requiredState = quizStates[config.unlockCondition.requiredQuizId];
				const isUnlocked = requiredState && QuizUtils.isQuizUnlocked(config, quizStates);
				console.log(
					"[UnlockSlice] 🐝 checkForUnlocks:",
					config.id,
					isUnlocked,
				)
				if (isUnlocked) {
					const quiz = quizzes[config.id];
					if (quiz) {
						if (!get().pendingUnlocks.some((pu) => pu.quizId === quiz.id)) {
							unlockedQuizzes.push(quiz);
							console.log(
								`[UnlockSlice] Quiz "${quiz.title}" has been unlocked!`,
							);
							addPendingUnlock(quiz.id, quiz.title);
							setTimeout(() => {
								showToast(
									`🎉 "${quiz.title}" freigeschaltet!`,
									"success",
									4000,
								);
							}, 300);
						}
					}
				}
			}
		}
		return unlockedQuizzes;
	},

	detectMissedUnlocks: () => {
		console.log(
			"[UnlockSlice] Checking for missed unlocks from completed quizzes",
		);
		const { quizzes, quizStates, addPendingUnlock } = get();
		let unlocksFound = 0;
		for (const [quizId, quizState] of Object.entries(quizStates)) {
			if (QuizUtils.isCompleted(quizState)) {
				const unlockedQuizzes = Object.values(quizzes).filter((quiz) => {
					const config = get().quizConfigs[quiz.id];
					return (
						config?.initiallyLocked &&
						config.unlockCondition &&
						config.unlockCondition.requiredQuizId === quizId
					);
				});
				for (const unlockedQuiz of unlockedQuizzes) {
					if (
						!get().pendingUnlocks.some((pu) => pu.quizId === unlockedQuiz.id)
					) {
						console.log(
							`[UnlockSlice] Quiz "${unlockedQuiz.title}" should be unlocked by completed quiz ${quizId}`,
						);
						addPendingUnlock(unlockedQuiz.id, unlockedQuiz.title);
						unlocksFound++;
					}
				}
			}
		}
		console.log(
			`[UnlockSlice] Detection complete - found ${unlocksFound} missed unlocks`,
		);
	},
	addPendingUnlock: (quizId: string, quizTitle: string) => {
		set((state) => {
			const existingUnlock = state.pendingUnlocks.find(
				(unlock) => unlock.quizId === quizId,
			);
			if (existingUnlock) {
				return state;
			}
			const newUnlock = {
				quizId,
				quizTitle,
				unlockedAt: Date.now(),
				shown: false,
			};
			return {
				...state,
				pendingUnlocks: [...state.pendingUnlocks, newUnlock],
			};
		});
	},
	isQuizUnlocked: (quizId: string) => {
		const { quizConfigs, quizStates } = get();
		const config = quizConfigs[quizId];
		return QuizUtils.isQuizUnlocked(config, quizStates); // Call the domain function
	},
	getUnlockProgress: (quizId: string) => {
		const { quizConfigs, quizStates } = get();
		const config = quizConfigs[quizId];
		return QuizUtils.getUnlockProgress(config, quizStates); // Pass getQuizProgress
	},
});
