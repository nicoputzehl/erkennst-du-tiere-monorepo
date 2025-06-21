import {
	createTestQuizQuestion,
	quizStateBuilder,
} from "../../../testing/testUtils";
import { type Question, QuestionStatus } from "../../../types";
import { isAnswerCorrect } from "../answerComparison";
import { findNextInactiveQuestionIndex, calculateNewQuestionsAfterCorrectAnswer, calculateAnswerResult, sortQuestionsByIds, findNextUnsolvedQuestionForward, findNextUnsolvedQuestionBackward, findFirstUnsolvedQuestion, getNextActiveQuestionId } from "../progression";


jest.mock("../answerComparison", () => ({
	isAnswerCorrect: jest.fn(), // Exportiere eine Mock-Funktion für isAnswerCorrect
}));

describe("Quiz Progression Utilities", () => {
	// Hilfsfunktion zur Erstellung von QuizQuestions mit spezifischem Status
	const createQuestions = (statuses: QuestionStatus[]): Question[] => {
		return statuses.map((status, index) =>
			createTestQuizQuestion({ id: index + 1, status: status }),
		);
	};

	describe("findNextInactiveQuestionIndex", () => {
		it("returns the index of the first INACTIVE question", () => {
			const questions = createQuestions([
				QuestionStatus.ACTIVE,
				QuestionStatus.SOLVED,
				QuestionStatus.INACTIVE, // This one
				QuestionStatus.INACTIVE,
			]);
			expect(findNextInactiveQuestionIndex(questions)).toBe(2);
		});

		it("returns -1 if no INACTIVE questions are found", () => {
			const questions = createQuestions([
				QuestionStatus.ACTIVE,
				QuestionStatus.SOLVED,
				QuestionStatus.ACTIVE,
			]);
			expect(findNextInactiveQuestionIndex(questions)).toBe(-1);
		});

		it("returns -1 for an empty array", () => {
			expect(findNextInactiveQuestionIndex([])).toBe(-1);
		});
	});

	// ---

	describe("calculateNewQuestionsAfterCorrectAnswer", () => {
		it("sets the answered question to SOLVED and activates the next INACTIVE question", () => {
			const initialQuestions = createQuestions([
				QuestionStatus.ACTIVE, // q1
				QuestionStatus.ACTIVE, // q2 (being answered)
				QuestionStatus.INACTIVE, // q3 (should become ACTIVE)
				QuestionStatus.INACTIVE, // q4
			]);

			const newQuestions = calculateNewQuestionsAfterCorrectAnswer(
				initialQuestions,
				1,
			); // Answer q2 (index 1)

			expect(newQuestions[0].status).toBe(QuestionStatus.ACTIVE);
			expect(newQuestions[1].status).toBe(QuestionStatus.SOLVED);
			expect(newQuestions[2].status).toBe(QuestionStatus.ACTIVE); // Previously INACTIVE, now ACTIVE
			expect(newQuestions[3].status).toBe(QuestionStatus.INACTIVE);
		});

		it("only sets the answered question to SOLVED if no INACTIVE question exists", () => {
			const initialQuestions = createQuestions([
				QuestionStatus.ACTIVE,
				QuestionStatus.ACTIVE, // being answered
				QuestionStatus.SOLVED,
			]);

			const newQuestions = calculateNewQuestionsAfterCorrectAnswer(
				initialQuestions,
				1,
			); // Answer q2 (index 1)

			expect(newQuestions[0].status).toBe(QuestionStatus.ACTIVE);
			expect(newQuestions[1].status).toBe(QuestionStatus.SOLVED);
			expect(newQuestions[2].status).toBe(QuestionStatus.SOLVED);
		});

		it("does not modify questions if the index is out of bounds", () => {
			const initialQuestions = createQuestions([
				QuestionStatus.ACTIVE,
				QuestionStatus.INACTIVE,
			]);
			const newQuestions = calculateNewQuestionsAfterCorrectAnswer(
				initialQuestions,
				99,
			); // Invalid index
			expect(newQuestions).toEqual(initialQuestions); // Should be identical (or deep copy if map is used)
		});
	});

	// ---

	describe("calculateAnswerResult", () => {
		// Hier können wir isAnswerCorrect als Mock-Funktion typisieren
		const mockIsAnswerCorrect = isAnswerCorrect as jest.Mock;

		beforeEach(() => {
			// Setzt den Mock vor jedem Test zurück
			mockIsAnswerCorrect.mockClear(); // Wichtig: Mock-State zurücksetzen
			// Die folgende Zeile entfernen, da sie den TypeError verursacht:
			// (isAnswerCorrect as jest.Mock) = mockIsAnswerCorrect;
		});

		afterEach(() => {
			// Stellt die Originalfunktion nach jedem Test wieder her (optional, aber gute Praxis)
			jest.restoreAllMocks();
		});

		it("returns original state and isCorrect: false if answer is incorrect", () => {
			mockIsAnswerCorrect.mockReturnValue(false); // Simulate incorrect answer

			const initialState = quizStateBuilder()
				.withQuestions(3)
				.withSolvedQuestions([]) // None solved initially
				.build();

			const { newState, isCorrect } = calculateAnswerResult(
				initialState,
				initialState.questions[0].id,
				"wrong answer",
			);

			expect(isCorrect).toBe(false);
			// State should be unchanged
			expect(newState).toEqual(initialState);
			expect(newState.completedQuestions).toBe(0);
			expect(newState.questions[0].status).toBe(QuestionStatus.ACTIVE);
		});

		it("updates state and returns isCorrect: true if answer is correct", () => {
			mockIsAnswerCorrect.mockReturnValue(true); // Simulate correct answer

			const initialState = quizStateBuilder()
				.withQuestions(3)
				.withSolvedQuestions([0]) // Q1 solved
				.withCompletedQuestions(1)
				.build();
			// Ensure Q2 (index 1) is ACTIVE and Q3 (index 2) is INACTIVE
			initialState.questions[0].status = QuestionStatus.SOLVED;
			initialState.questions[1].status = QuestionStatus.ACTIVE;
			initialState.questions[2].status = QuestionStatus.INACTIVE;

			const { newState, isCorrect } = calculateAnswerResult(
				initialState,
				initialState.questions[1].id,
				"correct answer",
			);

			expect(isCorrect).toBe(true);
			expect(newState.completedQuestions).toBe(
				initialState.completedQuestions + 1,
			); // 1 + 1 = 2
			expect(newState.questions[1].status).toBe(QuestionStatus.SOLVED); // Answered question is solved
			expect(newState.questions[2].status).toBe(QuestionStatus.ACTIVE); // Next inactive is now active
			expect(newState.questions[0].status).toBe(QuestionStatus.SOLVED); // Previous solved remains solved
		});

		it("throws an error if questionId is not found", () => {
			mockIsAnswerCorrect.mockReturnValue(true); // Mock isAnswerCorrect for consistency
			const initialState = quizStateBuilder().withQuestions(2).build();
			expect(() => calculateAnswerResult(initialState, 999, "answer")).toThrow(
				"Frage mit ID 999 nicht gefunden",
			);
		});

		it("correctly increments completedQuestions when an active question is answered correctly", () => {
			mockIsAnswerCorrect.mockReturnValue(true);
			const initialState = quizStateBuilder()
				.withQuestions(3)
				.withCompletedQuestions(0)
				.build(); // Q1 active, Q2 active, Q3 inactive (by default from builder)

			const { newState } = calculateAnswerResult(
				initialState,
				initialState.questions[0].id,
				"answer",
			);
			expect(newState.completedQuestions).toBe(1);

			const { newState: secondState } = calculateAnswerResult(
				newState,
				newState.questions[1].id,
				"answer",
			);
			expect(secondState.completedQuestions).toBe(2);
		});
	});

	// ---

	describe("sortQuestionsByIds", () => {
		it("sorts questions by their ID in ascending order", () => {
			const unsortedQuestions = [
				createTestQuizQuestion({ id: 3 }),
				createTestQuizQuestion({ id: 1 }),
				createTestQuizQuestion({ id: 2 }),
			];
			const sortedQuestions = sortQuestionsByIds(unsortedQuestions);
			expect(sortedQuestions.map((q) => q.id)).toEqual([1, 2, 3]);
			// Ensure original array is not mutated
			expect(unsortedQuestions.map((q) => q.id)).toEqual([3, 1, 2]);
		});

		it("returns an empty array if given an empty array", () => {
			expect(sortQuestionsByIds([])).toEqual([]);
		});

		it("returns the same array if already sorted", () => {
			const sortedQuestions = [
				createTestQuizQuestion({ id: 1 }),
				createTestQuizQuestion({ id: 2 }),
			];
			expect(sortQuestionsByIds(sortedQuestions).map((q) => q.id)).toEqual([
				1, 2,
			]);
		});
	});

	// ---

	describe("findNextUnsolvedQuestionForward", () => {
		const questions = [
			createTestQuizQuestion({ id: 1, status: QuestionStatus.SOLVED }),
			createTestQuizQuestion({ id: 2, status: QuestionStatus.ACTIVE }), // Next unsolved
			createTestQuizQuestion({ id: 3, status: QuestionStatus.INACTIVE }),
			createTestQuizQuestion({ id: 4, status: QuestionStatus.SOLVED }),
			createTestQuizQuestion({ id: 5, status: QuestionStatus.ACTIVE }),
		];

		it("finds the next unsolved question when available", () => {
			expect(findNextUnsolvedQuestionForward(questions, 0)).toEqual(
				questions[1],
			); // From Q1 (solved)
			expect(findNextUnsolvedQuestionForward(questions, 1)).toEqual(
				questions[2],
			); // From Q2 (active)
			expect(findNextUnsolvedQuestionForward(questions, 3)).toEqual(
				questions[4],
			); // From Q4 (solved)
		});

		it("returns null if no next unsolved question is found forward", () => {
			const allSolvedQuestions = [
				createTestQuizQuestion({ id: 1, status: QuestionStatus.SOLVED }),
				createTestQuizQuestion({ id: 2, status: QuestionStatus.SOLVED }),
			];
			expect(findNextUnsolvedQuestionForward(allSolvedQuestions, 0)).toBeNull();
			expect(findNextUnsolvedQuestionForward(allSolvedQuestions, 1)).toBeNull();
		});

		it("returns null if current index is the last element", () => {
			expect(findNextUnsolvedQuestionForward(questions, 4)).toBeNull();
		});

		it("returns null for an empty array", () => {
			expect(findNextUnsolvedQuestionForward([], 0)).toBeNull();
		});
	});

	// ---

	describe("findNextUnsolvedQuestionBackward", () => {
		const questions = [
			createTestQuizQuestion({ id: 1, status: QuestionStatus.INACTIVE }),
			createTestQuizQuestion({ id: 2, status: QuestionStatus.SOLVED }),
			createTestQuizQuestion({ id: 3, status: QuestionStatus.ACTIVE }), // Next unsolved
			createTestQuizQuestion({ id: 4, status: QuestionStatus.SOLVED }),
			createTestQuizQuestion({ id: 5, status: QuestionStatus.SOLVED }),
		];

		it("finds the next unsolved question when available backwards", () => {
			expect(findNextUnsolvedQuestionBackward(questions, 4)).toEqual(
				questions[2],
			); // From Q5 (solved)
			expect(findNextUnsolvedQuestionBackward(questions, 2)).toEqual(
				questions[0],
			); // From Q3 (active)
		});

		it("returns null if no next unsolved question is found backward", () => {
			const allSolvedQuestions = [
				createTestQuizQuestion({ id: 1, status: QuestionStatus.SOLVED }),
				createTestQuizQuestion({ id: 2, status: QuestionStatus.SOLVED }),
			];
			expect(
				findNextUnsolvedQuestionBackward(allSolvedQuestions, 1),
			).toBeNull();
			expect(
				findNextUnsolvedQuestionBackward(allSolvedQuestions, 0),
			).toBeNull(); // Index 0 has no backward
		});

		it("returns null if current index is the first element", () => {
			expect(findNextUnsolvedQuestionBackward(questions, 0)).toBeNull();
		});

		it("returns null for an empty array", () => {
			expect(findNextUnsolvedQuestionBackward([], 0)).toBeNull();
		});
	});

	// ---

	describe("findFirstUnsolvedQuestion", () => {
		it("returns the first active question", () => {
			const questions = createQuestions([
				QuestionStatus.SOLVED,
				QuestionStatus.ACTIVE, // First unsolved
				QuestionStatus.INACTIVE,
			]);
			expect(findFirstUnsolvedQuestion(questions)).toEqual(questions[1]);
		});

		it("returns the first inactive question if no active ones", () => {
			const questions = createQuestions([
				QuestionStatus.SOLVED,
				QuestionStatus.SOLVED,
				QuestionStatus.INACTIVE, // First unsolved
			]);
			expect(findFirstUnsolvedQuestion(questions)).toEqual(questions[2]);
		});

		it("returns null if all questions are solved", () => {
			const questions = createQuestions([
				QuestionStatus.SOLVED,
				QuestionStatus.SOLVED,
			]);
			expect(findFirstUnsolvedQuestion(questions)).toBeNull();
		});

		it("returns null for an empty array", () => {
			expect(findFirstUnsolvedQuestion([])).toBeNull();
		});
	});

	// ---

	describe("getNextActiveQuestionId", () => {
		it("returns null for an empty quiz state", () => {
			const state = quizStateBuilder().withQuestions(0).build();
			expect(getNextActiveQuestionId(state)).toBeNull();
		});

		it("returns the first unsolved question ID if no currentQuestionId is provided", () => {
			const state = quizStateBuilder()
				.withQuestions(3) // Q1 active, Q2 active, Q3 inactive
				.withSolvedQuestions([])
				.build();
			expect(getNextActiveQuestionId(state)).toBe(1); // Q1 (id: 1) is active
		});

		it("returns the next forward unsolved question ID from currentQuestionId", () => {
			const state = quizStateBuilder()
				.withQuestions(5)
				.withSolvedQuestions([0, 2]) // Q1, Q3 solved
				.build(); // Q2, Q4, Q5 are unsolved (active or inactive)
			state.questions[1].status = QuestionStatus.ACTIVE; // Q2 active
			state.questions[3].status = QuestionStatus.ACTIVE; // Q4 active
			state.questions[4].status = QuestionStatus.INACTIVE; // Q5 inactive

			// Current is Q1 (id=1, solved). Next active should be Q2 (id=2).
			expect(getNextActiveQuestionId(state, 1)).toBe(2);
			// Current is Q2 (id=2, active). Next active should be Q4 (id=4).
			expect(getNextActiveQuestionId(state, 2)).toBe(4);
			// Current is Q4 (id=4, active). Next active should be Q5 (id=5).
			expect(getNextActiveQuestionId(state, 4)).toBe(5);
		});

		it("returns the next backward unsolved question ID if no forward is found from currentQuestionId", () => {
			const state = quizStateBuilder()
				.withQuestions(5)
				.withSolvedQuestions([0, 1, 3, 4]) // Q1, Q2, Q4, Q5 solved
				.build();
			state.questions[2].status = QuestionStatus.ACTIVE; // Q3 active

			// Current is Q5 (id=5, solved). No forward. Should find Q3 (id=3).
			expect(getNextActiveQuestionId(state, 5)).toBe(3);
		});

		it("returns the first unsolved question ID if currentQuestionId is not found", () => {
			const state = quizStateBuilder()
				.withQuestions(3)
				.withSolvedQuestions([0]) // Q1 solved, Q2 active, Q3 inactive
				.build();
			state.questions[1].status = QuestionStatus.ACTIVE;
			state.questions[2].status = QuestionStatus.INACTIVE;

			expect(getNextActiveQuestionId(state, 999)).toBe(2); // Q2 is first unsolved
		});

		it("returns null if all questions are solved", () => {
			const state = quizStateBuilder()
				.withQuestions(3)
				.withSolvedQuestions([0, 1, 2]) // All solved
				.build();
			expect(getNextActiveQuestionId(state, 1)).toBeNull();
			expect(getNextActiveQuestionId(state)).toBeNull(); // No current ID
		});
	});
});
