
import {
	createTestQuizConfig,
	createTestQuizState,
} from "../../../testing/testUtils";
import type { QuizState, QuizConfig, PlaythroughCondition, ProgressCondition, UnlockCondition } from "../../../types";
import { canUnlockQuiz, checkUnlockCondition, getUnlockProgress, isQuizUnlocked } from "../unlocking";

describe("Quiz Unlocking Utilities", () => {
	// Beispielhafte QuizStates für die Tests
	const quizStates: Record<string, QuizState> = {
		"quizA": createTestQuizState({
			id: "quizA",
			completedQuestions: 5,
			// biome-ignore lint/suspicious/noExplicitAny: Egal
			questions: Array(5).fill({} as any), // Angenommen, 5 Fragen für ein abgeschlossenes Quiz
		}),
		"quizB": createTestQuizState({
			id: "quizB",
			completedQuestions: 3,
			// biome-ignore lint/suspicious/noExplicitAny: Egal
			questions: Array(5).fill({} as any), // 3 von 5 Fragen abgeschlossen
		}),
		"quizC": createTestQuizState({
			id: "quizC",
			completedQuestions: 0,
			// biome-ignore lint/suspicious/noExplicitAny: Egal
			questions: Array(5).fill({} as any), // 0 von 5 Fragen abgeschlossen
		}),
	};


	const unlockedConfig: QuizConfig = {
		id: 'unlocked',
		initiallyLocked: false,
	} as QuizConfig;

	const lockedWithPlaythroughCondition: QuizConfig = {
		id: 'lockedPlaythrough',
		title: "",
		questions: [],
		initiallyLocked: true,
		unlockCondition: {
			type: "playthrough",
			requiredQuizId: 'quizA',
		} as PlaythroughCondition,
	};

	const lockedWithProgressCondition: QuizConfig = {
		id: 'lockedProgress',
		title: "",
		questions: [],
		initiallyLocked: true,
		unlockCondition: {
			type: "progress",
			requiredQuizId: 'quizA',
			requiredQuestionsSolved: 4,
		} as ProgressCondition,
	};


	describe("checkUnlockCondition", () => {
		describe("with type: 'playthrough'", () => {
			it("returns isMet: true and progress: 100 if the required quiz is completed", () => {
				const condition: UnlockCondition = {
					type: "playthrough",
					requiredQuizId: "quizA",
					description: "Complete Quiz A",
				};
				const result = checkUnlockCondition(condition, quizStates);
				expect(result.isMet).toBe(true);
				expect(result.progress).toBe(100);
			});

			it("returns isMet: false and progress: 0 if the required quiz is in progress", () => {
				const condition: UnlockCondition = {
					type: "playthrough",
					requiredQuizId: "quizB",
					description: "Complete Quiz B",
				};
				const result = checkUnlockCondition(condition, quizStates);
				expect(result.isMet).toBe(false);
				expect(result.progress).toBe(0);
			});

			it("returns isMet: false and progress: 0 if the required quiz is not started", () => {
				const condition: UnlockCondition = {
					type: "playthrough",
					requiredQuizId: "quizC",
					description: "Complete Quiz C",
				};
				const result = checkUnlockCondition(condition, quizStates);
				expect(result.isMet).toBe(false);
				expect(result.progress).toBe(0);
			});

			it("returns isMet: false and progress: 0 if the required quiz does not exist", () => {
				const condition: UnlockCondition = {
					type: "playthrough",
					requiredQuizId: "non-existent-quiz",
					description: "Non-existent Quiz",
				};
				const result = checkUnlockCondition(condition, quizStates);
				expect(result.isMet).toBe(false);
				expect(result.progress).toBe(0);
			});

		})
		describe("with type: 'progress'", () => {
			it("returns isMet: true and progress: 100 if the required quiz is completed", () => {
				const condition: UnlockCondition = {
					type: "progress",
					requiredQuestionsSolved: 5,
					requiredQuizId: "quizA",
					description: "Complete Quiz A",
				};
				const result = checkUnlockCondition(condition, quizStates);
				expect(result.isMet).toBe(true);
				expect(result.progress).toBe(100);
			});

			it("returns isMet: false and progress: 60 if the requiredResolvedQuestion is not completly met", () => {
				const condition: UnlockCondition = {
					type: "progress",
					requiredQuestionsSolved: 5,
					requiredQuizId: "quizB",
					description: "Complete Quiz B",
				};
				const result = checkUnlockCondition(condition, quizStates);
				expect(result.isMet).toBe(false);
				expect(result.progress).toBe(60);
			});

			it("returns isMet: true and progress: 100 if the requiredResolvedQuestion is met", () => {
				const condition: UnlockCondition = {
					type: "progress",
					requiredQuestionsSolved: 3,
					requiredQuizId: "quizB",
					description: "Complete Quiz B",
				};
				const result = checkUnlockCondition(condition, quizStates);
				expect(result.isMet).toBe(true);
				expect(result.progress).toBe(100);
			});

			it("returns isMet: false and progress: 0 if the required quiz is not started", () => {
				const condition: UnlockCondition = {
					type: "progress",
					requiredQuestionsSolved: 3,
					requiredQuizId: "quizC",
					description: "Complete Quiz C",
				};
				const result = checkUnlockCondition(condition, quizStates);
				expect(result.isMet).toBe(false);
				expect(result.progress).toBe(0);
			});

			it("returns isMet: false and progress: 0 if the required quiz does not exist", () => {
				const condition: UnlockCondition = {
					type: "blup",
					requiredQuestionsSolved: 3,
					requiredQuizId: "non-existent-quiz",
					description: "Non-existent Quiz",
				} as unknown as UnlockCondition;
				const result = checkUnlockCondition(condition, quizStates);
				expect(result.isMet).toBe(false);
				expect(result.progress).toBe(0);
			});

		})
	});

	describe("canUnlockQuiz", () => {
		it("returns true if the quiz is not initially locked", () => {
			const config: QuizConfig = createTestQuizConfig({
				initiallyLocked: false,
			});
			expect(canUnlockQuiz(config, quizStates)).toBe(true);
		});

		it("returns true if the quiz is locked but has no unlock condition (should ideally not happen with current types)", () => {
			// Dieser Testfall ist wichtig, falls `unlockCondition` doch mal `undefined` sein sollte.
			// Obwohl der Typ jetzt `description: string` erfordert, könnte es durch externe Daten
			// oder ältere Konfigurationen dennoch passieren, dass `unlockCondition` fehlt.
			const config: QuizConfig = createTestQuizConfig({
				initiallyLocked: true,
				unlockCondition: undefined,
			});
			expect(canUnlockQuiz(config, quizStates)).toBe(true);
		});

		it("returns true if the quiz is locked and its unlock condition is met", () => {
			const config: QuizConfig = createTestQuizConfig({
				initiallyLocked: true,
				unlockCondition: {
					type: "playthrough",
					requiredQuizId: "quizA",
					description: "Unlock by A",
				}, // quizA is completed
			});
			expect(canUnlockQuiz(config, quizStates)).toBe(true);
		});

		it("returns false if the quiz is locked and its unlock condition is NOT met (in progress)", () => {
			const config: QuizConfig = createTestQuizConfig({
				initiallyLocked: true,
				unlockCondition: {
					type: "playthrough",
					requiredQuizId: "quizB",
					description: "Unlock by B",
				}, // quizB is in progress
			});
			expect(canUnlockQuiz(config, quizStates)).toBe(false);
		});

		it("returns false if the quiz is locked and its unlock condition is NOT met (not started)", () => {
			const config: QuizConfig = createTestQuizConfig({
				initiallyLocked: true,
				unlockCondition: {
					type: "playthrough",
					requiredQuizId: "quizC",
					description: "Unlock by C",
				}, // quizC is not started
			});
			expect(canUnlockQuiz(config, quizStates)).toBe(false);
		});

		it("returns false if the quiz is locked and the required quiz for unlock does not exist", () => {
			const config: QuizConfig = createTestQuizConfig({
				initiallyLocked: true,
				unlockCondition: {
					type: "playthrough",
					requiredQuizId: "non-existent-quiz",
					description: "Unlock by Non-existent",
				},
			});
			expect(canUnlockQuiz(config, quizStates)).toBe(false);
		});
	});

	describe('isQuizUnlocked', () => {
		it('should return true for unlocked quiz', () => {
			expect(isQuizUnlocked(unlockedConfig, quizStates)).toBe(true);
		});

		it('should return true when no unlock condition exists', () => {
			const config = { ...unlockedConfig, initiallyLocked: true };
			expect(isQuizUnlocked(config, quizStates)).toBe(true);
		});

		it('should return true when playthrough condition is met', () => {
			expect(isQuizUnlocked(lockedWithPlaythroughCondition, quizStates)).toBe(true);
		});

		it('should return false when playthrough condition is not met', () => {
			const config = { ...lockedWithPlaythroughCondition };
			const states = { ...quizStates, quizA: { ...quizStates.quizA, completedQuestions: 0 } as QuizState };
			expect(isQuizUnlocked(config, states)).toBe(false);
		});

		it('should return true when progress condition is met', () => {
			expect(isQuizUnlocked(lockedWithProgressCondition, quizStates)).toBe(true);
		});

		it('should return false when progress condition is not met', () => {
			const config = { ...lockedWithProgressCondition, unlockCondition: { ...lockedWithProgressCondition.unlockCondition, requiredQuestionsSolved: 6 } } as QuizConfig;
			expect(isQuizUnlocked(config, quizStates)).toBe(false);
		});
	});


	describe('getUnlockProgress', () => {
		it('should return full progress for unlocked quiz', () => {
			const result = getUnlockProgress(unlockedConfig, quizStates);
			expect(result.progress).toBe(100);
			expect(result.isMet).toBe(true);
			expect(result.condition).toBeNull();
		});

		it('should return correct progress for playthrough condition', () => {
			const result = getUnlockProgress(lockedWithPlaythroughCondition, quizStates);
			expect(result.progress).toBe(100);
			expect(result.isMet).toBe(true);
			expect(result.condition).toEqual(lockedWithPlaythroughCondition.unlockCondition);
		});

		it('should return correct progress for progress condition', () => {
			const result = getUnlockProgress(lockedWithProgressCondition, quizStates);
			expect(result.progress).toBe(100);
			expect(result.isMet).toBe(true);
			expect(result.condition).toEqual(lockedWithProgressCondition.unlockCondition);
		});

		it('should return correct progress percentage when condition not met', () => {
			const config = {
				...lockedWithProgressCondition,
				unlockCondition: {
					...lockedWithProgressCondition.unlockCondition,
					requiredQuestionsSolved: 10,
				},
			} as QuizConfig;
			const result = getUnlockProgress(config, quizStates);
			expect(result.progress).toBe(50);
			expect(result.isMet).toBe(false);
		});

		it('should handle undefined config', () => {
			const result = getUnlockProgress(undefined, quizStates);
			expect(result.progress).toBe(100);
			expect(result.isMet).toBe(true);
			expect(result.condition).toBeNull();
		});
	});

});
