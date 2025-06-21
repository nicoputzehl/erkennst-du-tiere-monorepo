import {
	createTestQuestion,
	createTestQuiz,
} from "../../../testing/testUtils";
import { QuestionStatus, type UnlockCondition } from "../../../types";
import {
	calculateInitialQuestionStatus,
	createQuizConfig,
	createQuizState,
	createPlaythroughUnlockCondition,
	createProgressUnlockCondition
} from "../factories";

describe("Quiz Creation Utilities", () => {
	describe("createQuizConfig", () => {
		it("creates a basic quiz config with default values", () => {
			const quiz = createTestQuiz({ id: "test-quiz", title: "My Quiz" });
			const config = createQuizConfig(quiz);

			expect(config.id).toBe("test-quiz");
			expect(config.title).toBe("My Quiz");
			expect(config.initiallyLocked).toBe(false);
			expect(config.order).toBe(1);
			expect(config.initialUnlockedQuestions).toBe(2);
			expect(config.unlockCondition).toBeUndefined();
			expect(config.questions.length).toBe(1); // Standardfrage von createTestQuiz
		});

		it("overrides default values with provided config", () => {
			const quiz = createTestQuiz({
				id: "override-quiz",
				title: "Override Test",
			});
			const unlockCond: UnlockCondition = {
				type: "playthrough",
				requiredQuizId: "prev-quiz",
				description: "Test Unlock",
			};
			const config = createQuizConfig(quiz, {
				initiallyLocked: true,
				order: 5,
				initialUnlockedQuestions: 3,
				unlockCondition: unlockCond,
			});

			expect(config.id).toBe("override-quiz");
			expect(config.initiallyLocked).toBe(true);
			expect(config.order).toBe(5);
			expect(config.initialUnlockedQuestions).toBe(3);
			expect(config.unlockCondition).toEqual(unlockCond);
		});

		it("merges quiz content with config properties", () => {
			const questions = [
				createTestQuestion({ id: 1 }),
				createTestQuestion({ id: 2 }),
			];
			const quiz = createTestQuiz({
				id: "merged-quiz",
				title: "Merged Test",
				questions: questions,
				titleImage: 100,
			});
			const config = createQuizConfig(quiz, { order: 9 });

			expect(config.id).toBe("merged-quiz");
			expect(config.title).toBe("Merged Test");
			expect(config.questions).toEqual(questions);
			expect(config.titleImage).toBe(100);
			expect(config.order).toBe(9);
		});
	});

	describe("createUnlockCondition", () => {

		describe("createPlaythroughUnlockCondition", () => {
			it("creates an playthrough unlock condition with a default description", () => {
				const condition = createPlaythroughUnlockCondition("required-1");
				expect(condition.requiredQuizId).toBe("required-1");
				expect(condition.description).toBe(
					'Schließe das Quiz "required-1" ab, um dieses Quiz freizuschalten.',
				);
			});
			it("creates an playthrough unlock condition with a custom description", () => {
				const customDesc = "You need to finish the first challenge!";
				const condition = createPlaythroughUnlockCondition("challenge-1", customDesc);
				expect(condition.requiredQuizId).toBe("challenge-1");
				expect(condition.description).toBe(customDesc);
			});

		})
		describe("createProgressUnlockCondition", () => {
			it("creates an progress unlock condition with a default description", () => {
				const condition = createProgressUnlockCondition("required-1", 3);
				expect(condition.requiredQuizId).toBe("required-1");
				expect(condition.description).toBe(
					'Löse 3 Fragen von Quiz "required-1", um dieses Quiz freizuschalten.',
				);
			});
			it("creates an progress unlock condition with a custom description", () => {
				const customDesc = "You need to finish the first challenge!";
				const condition = createProgressUnlockCondition("challenge-1", 3, customDesc);
				expect(condition.requiredQuizId).toBe("challenge-1");
				expect(condition.description).toBe(customDesc);
			});

		})

	});

	describe("calculateInitialQuestionStatus", () => {
		it("sets all questions to INACTIVE if initialUnlockedQuestions is 0", () => {
			const statuses = calculateInitialQuestionStatus(5, 0);
			expect(statuses).toEqual([
				QuestionStatus.INACTIVE,
				QuestionStatus.INACTIVE,
				QuestionStatus.INACTIVE,
				QuestionStatus.INACTIVE,
				QuestionStatus.INACTIVE,
			]);
		});

		it("sets the first N questions to ACTIVE and the rest to INACTIVE", () => {
			const statuses = calculateInitialQuestionStatus(5, 3);
			expect(statuses).toEqual([
				QuestionStatus.ACTIVE,
				QuestionStatus.ACTIVE,
				QuestionStatus.ACTIVE,
				QuestionStatus.INACTIVE,
				QuestionStatus.INACTIVE,
			]);
		});

		it("sets all questions to ACTIVE if initialUnlockedQuestions is greater than or equal to questionCount", () => {
			const statuses = calculateInitialQuestionStatus(3, 5);
			expect(statuses).toEqual([
				QuestionStatus.ACTIVE,
				QuestionStatus.ACTIVE,
				QuestionStatus.ACTIVE,
			]);
		});

		it("handles zero questions correctly", () => {
			const statuses = calculateInitialQuestionStatus(0, 2);
			expect(statuses).toEqual([]);
		});
	});

	describe("createQuizState", () => {
		it("creates a basic quiz state with default initial unlocked questions", () => {
			const quiz = createTestQuiz({
				id: "new-state-quiz",
				title: "New State",
				questions: [
					createTestQuestion({ id: 1 }),
					createTestQuestion({ id: 2 }),
					createTestQuestion({ id: 3 }),
					createTestQuestion({ id: 4 }),
				],
			});
			const quizState = createQuizState(quiz);

			expect(quizState.id).toBe("new-state-quiz");
			expect(quizState.title).toBe("New State");
			expect(quizState.completedQuestions).toBe(0);
			expect(quizState.questions.length).toBe(4);
			expect(quizState.questions[0].status).toBe(QuestionStatus.ACTIVE);
			expect(quizState.questions[1].status).toBe(QuestionStatus.ACTIVE);
			expect(quizState.questions[2].status).toBe(QuestionStatus.INACTIVE);
			expect(quizState.questions[3].status).toBe(QuestionStatus.INACTIVE);
		});

		it("creates a quiz state with a custom number of initial unlocked questions", () => {
			const quiz = createTestQuiz({
				id: "custom-state-quiz",
				title: "Custom State",
				questions: [
					createTestQuestion({ id: 1 }),
					createTestQuestion({ id: 2 }),
					createTestQuestion({ id: 3 }),
				],
			});
			const quizState = createQuizState(quiz, { initialUnlockedQuestions: 1 });

			expect(quizState.completedQuestions).toBe(0);
			expect(quizState.questions[0].status).toBe(QuestionStatus.ACTIVE);
			expect(quizState.questions[1].status).toBe(QuestionStatus.INACTIVE);
			expect(quizState.questions[2].status).toBe(QuestionStatus.INACTIVE);
		});

		it("sets all questions to active if initialUnlockedQuestions is greater than total questions", () => {
			const quiz = createTestQuiz({
				id: "all-active-quiz",
				title: "All Active",
				questions: [
					createTestQuestion({ id: 1 }),
					createTestQuestion({ id: 2 }),
				],
			});
			const quizState = createQuizState(quiz, { initialUnlockedQuestions: 10 });

			expect(quizState.questions[0].status).toBe(QuestionStatus.ACTIVE);
			expect(quizState.questions[1].status).toBe(QuestionStatus.ACTIVE);
			expect(quizState.completedQuestions).toBe(0); // Immer noch 0, da noch nicht beantwortet
		});

		it("handles a quiz with zero questions correctly", () => {
			const quiz = createTestQuiz({
				id: "empty-quiz",
				title: "Empty",
				questions: [],
			});
			const quizState = createQuizState(quiz);

			expect(quizState.questions).toEqual([]);
			expect(quizState.completedQuestions).toBe(0);
		});
	});
});
