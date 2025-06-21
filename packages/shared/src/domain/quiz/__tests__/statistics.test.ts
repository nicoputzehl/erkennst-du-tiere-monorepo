import {
	createTestQuizState,
	quizStateBuilder,
} from "../../../testing/testUtils";
import {
	calculateCompletionPercentage,
	calculateQuizProgress,
	countCompletedQuestions,
	countCompletedQuizzes,
	countTotalQuestions,
	countTotalQuizzes,
	createProgressString,
	isCompleted,
} from "../statistics";

describe("Quiz Statistics and Progress Utilities", () => {
	describe("countTotalQuizzes", () => {
		it("returns 0 for an empty quiz states object", () => {
			const quizStates = {};
			expect(countTotalQuizzes(quizStates)).toBe(0);
		});

		it("returns 1 for an object with a single quiz state", () => {
			const quizStates = {
				"quiz-1": createTestQuizState({ id: "quiz-1" }),
			};
			expect(countTotalQuizzes(quizStates)).toBe(1);
		});

		it("returns the correct count for multiple quiz states", () => {
			const quizStates = {
				"quiz-1": createTestQuizState({ id: "quiz-1" }),
				"quiz-2": createTestQuizState({ id: "quiz-2" }),
				"quiz-3": createTestQuizState({ id: "quiz-3" }),
			};
			expect(countTotalQuizzes(quizStates)).toBe(3);
		});

		it("handles quiz states with different properties correctly", () => {
			const quizStates = {
				"quiz-A": createTestQuizState({ id: "quiz-A", completedQuestions: 0 }),
				"quiz-B": createTestQuizState({
					id: "quiz-B",
					completedQuestions: 5,
					questions: Array(5).fill({}) as any,
				}),
			};
			expect(countTotalQuizzes(quizStates)).toBe(2);
		});
	});

	describe("countCompletedQuizzes", () => {
		it("returns 0 for an empty quiz states object", () => {
			const quizStates = {};
			expect(countCompletedQuizzes(quizStates)).toBe(0);
		});

		it("returns 0 if no quizzes are completed", () => {
			const quizStates = {
				"quiz-1": quizStateBuilder()
					.withQuestions(5)
					.withCompletedQuestions(3)
					.build(),
				"quiz-2": quizStateBuilder()
					.withQuestions(10)
					.withCompletedQuestions(8)
					.build(),
			};
			expect(countCompletedQuizzes(quizStates)).toBe(0);
		});

		it("returns 1 if one quiz is completed", () => {
			const quizStates = {
				"quiz-1": quizStateBuilder()
					.withQuestions(5)
					.withCompletedQuestions(5)
					.build(), // Completed
				"quiz-2": quizStateBuilder()
					.withQuestions(10)
					.withCompletedQuestions(8)
					.build(),
			};
			expect(countCompletedQuizzes(quizStates)).toBe(1);
		});

		it("returns correct count for multiple completed quizzes", () => {
			const quizStates = {
				"quiz-1": quizStateBuilder()
					.withQuestions(5)
					.withCompletedQuestions(5)
					.build(), // Completed
				"quiz-2": quizStateBuilder()
					.withQuestions(10)
					.withCompletedQuestions(8)
					.build(),
				"quiz-3": quizStateBuilder()
					.withQuestions(7)
					.withCompletedQuestions(7)
					.build(), // Completed
				"quiz-4": quizStateBuilder()
					.withQuestions(3)
					.withCompletedQuestions(2)
					.build(),
			};
			expect(countCompletedQuizzes(quizStates)).toBe(2);
		});

		it("handles quizzes with 0 questions correctly (considered completed if completedQuestions is also 0)", () => {
			const quizStates = {
				"quiz-1": quizStateBuilder()
					.withQuestions(0)
					.withCompletedQuestions(0)
					.build(), // Completed (0/0)
				"quiz-2": quizStateBuilder()
					.withQuestions(5)
					.withCompletedQuestions(3)
					.build(),
			};
			expect(countCompletedQuizzes(quizStates)).toBe(1);
		});
	});

	describe("countTotalQuestions", () => {
		it("returns 0 for an empty quiz states object", () => {
			const quizStates = {};
			expect(countTotalQuestions(quizStates)).toBe(0);
		});

		it("returns the total number of questions from a single quiz", () => {
			const quizStates = {
				"quiz-1": quizStateBuilder()
					.withQuestions(5)
					.withCompletedQuestions(3)
					.build(),
			};
			expect(countTotalQuestions(quizStates)).toBe(5);
		});

		it("returns the correct total for multiple quizzes", () => {
			const quizStates = {
				"quiz-1": quizStateBuilder()
					.withQuestions(5)
					.withCompletedQuestions(3)
					.build(),
				"quiz-2": quizStateBuilder()
					.withQuestions(10)
					.withCompletedQuestions(8)
					.build(),
				"quiz-3": quizStateBuilder()
					.withQuestions(7)
					.withCompletedQuestions(7)
					.build(),
			};
			expect(countTotalQuestions(quizStates)).toBe(5 + 10 + 7); // 22
		});

		it("handles quizzes with 0 questions", () => {
			const quizStates = {
				"quiz-1": quizStateBuilder()
					.withQuestions(5)
					.withCompletedQuestions(3)
					.build(),
				"quiz-2": quizStateBuilder()
					.withQuestions(0)
					.withCompletedQuestions(0)
					.build(), // Empty Quiz
			};
			expect(countTotalQuestions(quizStates)).toBe(5);
		});
	});

	describe("countCompletedQuestions", () => {
		it("returns 0 for an empty quiz states object", () => {
			const quizStates = {};
			expect(countCompletedQuestions(quizStates)).toBe(0);
		});

		it("returns the completed questions from a single quiz", () => {
			const quizStates = {
				"quiz-1": quizStateBuilder()
					.withQuestions(5)
					.withCompletedQuestions(3)
					.build(),
			};
			expect(countCompletedQuestions(quizStates)).toBe(3);
		});

		it("returns the correct total for multiple quizzes", () => {
			const quizStates = {
				"quiz-1": quizStateBuilder()
					.withQuestions(5)
					.withCompletedQuestions(3)
					.build(),
				"quiz-2": quizStateBuilder()
					.withQuestions(10)
					.withCompletedQuestions(8)
					.build(),
				"quiz-3": quizStateBuilder()
					.withQuestions(7)
					.withCompletedQuestions(0)
					.build(),
			};
			expect(countCompletedQuestions(quizStates)).toBe(3 + 8 + 0); // 11
		});

		it("handles quizzes with 0 completed questions", () => {
			const quizStates = {
				"quiz-1": quizStateBuilder()
					.withQuestions(5)
					.withCompletedQuestions(0)
					.build(),
				"quiz-2": quizStateBuilder()
					.withQuestions(10)
					.withCompletedQuestions(0)
					.build(),
			};
			expect(countCompletedQuestions(quizStates)).toBe(0);
		});
	});

	describe("calculateCompletionPercentage", () => {
		it("returns 0 when totalQuestions is 0", () => {
			expect(calculateCompletionPercentage(0, 0)).toBe(0);
			expect(calculateCompletionPercentage(0, 5)).toBe(0); // Completed questions should not matter if total is 0
		});

		it("returns 0 when no questions are completed", () => {
			expect(calculateCompletionPercentage(10, 0)).toBe(0);
		});

		it("returns 100 when all questions are completed", () => {
			expect(calculateCompletionPercentage(10, 10)).toBe(100);
			expect(calculateCompletionPercentage(1, 1)).toBe(100);
		});

		it("returns correct percentage for partial completion", () => {
			expect(calculateCompletionPercentage(10, 5)).toBe(50); // 50%
			expect(calculateCompletionPercentage(4, 1)).toBe(25); // 25%
		});

		it("rounds the percentage to the nearest whole number", () => {
			expect(calculateCompletionPercentage(3, 1)).toBe(33); // 33.33... -> 33
			expect(calculateCompletionPercentage(3, 2)).toBe(67); // 66.66... -> 67
			expect(calculateCompletionPercentage(6, 1)).toBe(17); // 16.66... -> 17
		});
	});

	describe("isCompleted", () => {
		it("returns true if all questions are completed", () => {
			const completedQuiz = quizStateBuilder()
				.withQuestions(5)
				.withCompletedQuestions(5)
				.build();
			expect(isCompleted(completedQuiz)).toBe(true);
		});

		it("returns false if some questions are completed but not all", () => {
			const inProgressQuiz = quizStateBuilder()
				.withQuestions(5)
				.withCompletedQuestions(3)
				.build();
			expect(isCompleted(inProgressQuiz)).toBe(false);
		});

		it("returns false if no questions are completed", () => {
			const notStartedQuiz = quizStateBuilder()
				.withQuestions(5)
				.withCompletedQuestions(0)
				.build();
			expect(isCompleted(notStartedQuiz)).toBe(false);
		});

		it("returns true for an empty quiz if completedQuestions is also 0", () => {
			const emptyQuiz = quizStateBuilder()
				.withQuestions(0)
				.withCompletedQuestions(0)
				.build();
			expect(isCompleted(emptyQuiz)).toBe(true);
		});

		it("returns false for an empty quiz if completedQuestions is somehow not 0 (edge case)", () => {
			const edgeCaseEmptyQuiz = quizStateBuilder()
				.withQuestions(0)
				.withCompletedQuestions(1) // Should ideally not happen
				.build();
			expect(isCompleted(edgeCaseEmptyQuiz)).toBe(false);
		});
	});

	describe("calculateQuizProgress", () => {
		it("returns 0 if the quiz has no questions", () => {
			const emptyQuiz = quizStateBuilder()
				.withQuestions(0)
				.withCompletedQuestions(0)
				.build();
			expect(calculateQuizProgress(emptyQuiz)).toBe(0);
		});

		it("returns 0 if no questions are completed", () => {
			const notStartedQuiz = quizStateBuilder()
				.withQuestions(10)
				.withCompletedQuestions(0)
				.build();
			expect(calculateQuizProgress(notStartedQuiz)).toBe(0);
		});

		it("returns 100 if all questions are completed", () => {
			const completedQuiz = quizStateBuilder()
				.withQuestions(7)
				.withCompletedQuestions(7)
				.build();
			expect(calculateQuizProgress(completedQuiz)).toBe(100);
		});

		it("returns the correct rounded percentage for partial completion", () => {
			// 50%
			let quiz = quizStateBuilder()
				.withQuestions(10)
				.withCompletedQuestions(5)
				.build();
			expect(calculateQuizProgress(quiz)).toBe(50);

			// 33.33...% -> 33%
			quiz = quizStateBuilder()
				.withQuestions(3)
				.withCompletedQuestions(1)
				.build();
			expect(calculateQuizProgress(quiz)).toBe(33);

			// 66.66...% -> 67%
			quiz = quizStateBuilder()
				.withQuestions(3)
				.withCompletedQuestions(2)
				.build();
			expect(calculateQuizProgress(quiz)).toBe(67);

			// 16.66...% -> 17%
			quiz = quizStateBuilder()
				.withQuestions(6)
				.withCompletedQuestions(1)
				.build();
			expect(calculateQuizProgress(quiz)).toBe(17);
		});
	});

	describe("createProgressString", () => {
		it("returns null if the quiz has no questions", () => {
			const emptyQuiz = quizStateBuilder()
				.withQuestions(0)
				.withCompletedQuestions(0)
				.build();
			expect(createProgressString(emptyQuiz)).toBeNull();
		});

		it("returns the correct progress string for a partial quiz", () => {
			const inProgressQuiz = quizStateBuilder()
				.withQuestions(10)
				.withCompletedQuestions(3)
				.build();
			expect(createProgressString(inProgressQuiz)).toBe("3/10");
		});

		it("returns the correct progress string for a completed quiz", () => {
			const completedQuiz = quizStateBuilder()
				.withQuestions(5)
				.withCompletedQuestions(5)
				.build();
			expect(createProgressString(completedQuiz)).toBe("5/5");
		});

		it("returns the correct progress string for a not-started quiz", () => {
			const notStartedQuiz = quizStateBuilder()
				.withQuestions(8)
				.withCompletedQuestions(0)
				.build();
			expect(createProgressString(notStartedQuiz)).toBe("0/8");
		});
	});
});
