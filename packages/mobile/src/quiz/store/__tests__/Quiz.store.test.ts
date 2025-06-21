import AsyncStorage from "@react-native-async-storage/async-storage";
import { act } from "@testing-library/react-native";
import { QuestionStatus } from "../../types";
import { useQuizStore } from "../Store";
import { QuizUtils } from "../../domain/quiz";

// Mocken Sie createQuizState, da es eine externe Abhängigkeit ist
jest.mock("../../domain/quiz", () => ({
	createQuizState: jest.fn((quiz, config) => ({
		id: quiz.id,
		title: quiz.title,
		questions: quiz.questions.map((q: any, index: number) => ({
			...q,
			// Verwenden Sie hier die String-Literale anstelle der Enum-Werte,
			// um den 'out-of-scope variable' Fehler zu vermeiden.
			status:
				index < (config?.initialUnlockedQuestions || 0) ? "active" : "inactive",
		})),
		completedQuestions: 0,
		// config wird hier nur für initialUnlockedQuestions verwendet
	})),
}));

describe("QuizStore", () => {
	const MOCK_QUIZ_CONFIG = {
		id: "quiz1",
		title: "Test Quiz",
		questions: [
			{ id: 1, images: { imageUrl: 1 }, answer: "a" },
			{ id: 2, images: { imageUrl: 2 }, answer: "b" },
		],
		initialUnlockedQuestions: 1,
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		// Clear the store state before each test
		await act(async () => {
			await useQuizStore.getState().clearPersistedData();
		});
		// Ensure the store is truly reset to its initial state for each test
		useQuizStore.setState(useQuizStore.getInitialState(), true);
	});

	it("should initialize with default states", () => {
		const state = useQuizStore.getState();
		expect(state.quizzes).toEqual({});
		expect(state.quizStates).toEqual({});
		expect(state.isQuizDataLoaded).toBe(false);
		expect(state.currentQuizId).toBeNull();
		expect(state.pendingUnlocks).toEqual([]);
		expect(state.navigationHistory).toEqual([]);
	});

	it("should persist and rehydrate selected parts of the store", async () => {
		// Simulate some state changes
		act(() => {
			useQuizStore.getState().registerQuiz(MOCK_QUIZ_CONFIG);
			useQuizStore.getState().initializeQuizState(MOCK_QUIZ_CONFIG.id);
			useQuizStore.getState().answerQuestion(MOCK_QUIZ_CONFIG.id, 1, "a");
		});

		const stateBeforeRehydration = useQuizStore.getState();
		expect(
			stateBeforeRehydration.quizStates[MOCK_QUIZ_CONFIG.id],
		).toBeDefined();
		expect(
			stateBeforeRehydration.quizStates[MOCK_QUIZ_CONFIG.id].completedQuestions,
		).toBe(1);

		// Simulate rehydration by clearing the store and then re-initializing
		// We mock getItem to return the state we expect to be persisted
		(AsyncStorage.getItem as jest.Mock).mockImplementationOnce((name) => {
			if (name === "quiz_store_v1") {
				return Promise.resolve(
					JSON.stringify({
						state: {
							quizStates: stateBeforeRehydration.quizStates,
							navigationHistory: stateBeforeRehydration.navigationHistory,
							pendingUnlocks: stateBeforeRehydration.pendingUnlocks,
						},
						version: 0, // Zustandz-persist Version
					}),
				);
			}
			return Promise.resolve(null);
		});

		// Re-initialize the store to trigger rehydration
		await act(async () => {
			await useQuizStore.persist.rehydrate();
		});

		const stateAfterRehydration = useQuizStore.getState();

		expect(
			stateAfterRehydration.quizStates[MOCK_QUIZ_CONFIG.id].completedQuestions,
		).toBe(1);
		expect(stateAfterRehydration.quizStates).toEqual(
			stateBeforeRehydration.quizStates,
		);
		expect(stateAfterRehydration.navigationHistory).toEqual(
			stateBeforeRehydration.navigationHistory,
		);
		expect(stateAfterRehydration.pendingUnlocks).toEqual(
			stateBeforeRehydration.pendingUnlocks,
		);
	});

	it("should clear persisted data and reset the store", async () => {
		// Simulate some state
		act(() => {
			useQuizStore.getState().registerQuiz(MOCK_QUIZ_CONFIG);
			useQuizStore.getState().setCurrentQuiz(MOCK_QUIZ_CONFIG.id);
			useQuizStore.getState().initializeQuizState(MOCK_QUIZ_CONFIG.id);
			useQuizStore.getState().answerQuestion(MOCK_QUIZ_CONFIG.id, 1, "a");
		});

		let state = useQuizStore.getState();
		expect(state.currentQuizId).toBe(MOCK_QUIZ_CONFIG.id);
		expect(state.quizStates[MOCK_QUIZ_CONFIG.id]).toBeDefined();
		expect(state.quizStates[MOCK_QUIZ_CONFIG.id].completedQuestions).toBe(1);

		await act(async () => {
			await useQuizStore.getState().clearPersistedData();
		});

		state = useQuizStore.getState();
		expect(AsyncStorage.removeItem).toHaveBeenCalledWith("quiz_store_v1");
		expect(state.quizzes).toEqual({});
		expect(state.quizConfigs).toEqual({});
		expect(state.isQuizDataLoaded).toBe(false);
		expect(state.quizStates).toEqual({});
		expect(state.currentQuizId).toBeNull();
		expect(state.isLoading).toBe(false);
		expect(state.loadingOperations).toEqual(new Set());
		expect(state.toast).toBeNull();
		expect(state.navigationHistory).toEqual([]);
		expect(state.pendingUnlocks).toEqual([]);
	});

	it("resetAllQuizStates should reset all relevant states", () => {
		// Setup initial state for multiple quizzes
		const quiz2Config = {
			id: "quiz2",
			title: "Test Quiz 2",
			questions: [{ id: 3, images: { imageUrl: 3 }, answer: "c" }],
			initialUnlockedQuestions: 1,
		};

		act(() => {
			useQuizStore.getState().registerQuiz(MOCK_QUIZ_CONFIG);
			useQuizStore.getState().registerQuiz(quiz2Config);
			useQuizStore.getState().initializeQuizState(MOCK_QUIZ_CONFIG.id);
			useQuizStore.getState().initializeQuizState(quiz2Config.id);
			useQuizStore.getState().answerQuestion(MOCK_QUIZ_CONFIG.id, 1, "a"); // Complete one question
			useQuizStore.getState().setCurrentQuiz(MOCK_QUIZ_CONFIG.id);
			// Korrektur: addPendingUnlock benötigt quizId und quizTitle
			useQuizStore
				.getState()
				.addPendingUnlock("someUnlockId", "Some Quiz Title");
			// Korrektur: setLoading benötigt auch einen Operationsnamen
			useQuizStore.getState().setLoading("resettingQuizzes", true);
			// Korrektur: setToast ist showToast
			useQuizStore.getState().showToast("test", "info", 1000);
		});

		let state = useQuizStore.getState();
		expect(state.quizStates[MOCK_QUIZ_CONFIG.id].completedQuestions).toBe(1);
		expect(state.pendingUnlocks.length).toBe(1);
		expect(state.currentQuizId).toBe(MOCK_QUIZ_CONFIG.id);
		expect(state.isLoading).toBe(true);
		expect(state.toast).not.toBeNull();
		expect(state.isQuizDataLoaded).toBe(false);

		act(() => {
			useQuizStore.getState().resetAllQuizStates();
		});

		state = useQuizStore.getState();
		expect(state.quizStates[MOCK_QUIZ_CONFIG.id].completedQuestions).toBe(0); // Should be reset
		// Stellen Sie sicher, dass der Status der ersten Frage nach dem Zurücksetzen ACTIVE ist
		expect(state.quizStates[MOCK_QUIZ_CONFIG.id].questions[0].status).toBe(
			QuestionStatus.ACTIVE,
		);
		expect(state.pendingUnlocks).toEqual([]);
		expect(state.navigationHistory).toEqual([]); // Sollte jetzt leer sein nach resetAllQuizStates
		expect(state.currentQuizId).toBeNull();
		expect(state.isLoading).toBe(false);
		expect(state.loadingOperations).toEqual(new Set());
		expect(state.toast).toBeNull();
		expect(state.isQuizDataLoaded).toBe(false);
	});

	it("onRehydrateStorage should call detectMissedUnlocks on successful hydration", async () => {
		const detectMissedUnlocksMock = jest.fn();
		jest.spyOn(useQuizStore, "getState").mockReturnValue({
			...useQuizStore.getState(),
			detectMissedUnlocks: detectMissedUnlocksMock,
			showToast: jest.fn(),
		});

		// Simulate successful rehydration by returning data from AsyncStorage
		(AsyncStorage.getItem as jest.Mock).mockImplementationOnce((name) => {
			if (name === "quiz_store_v1") {
				return Promise.resolve(
					JSON.stringify({
						state: {
							quizStates: {},
							navigationHistory: [],
							pendingUnlocks: [],
						},
						version: 0,
					}),
				);
			}
			return Promise.resolve(null);
		});

		// Manually trigger rehydration process
		await act(async () => {
			await useQuizStore.persist.rehydrate();
		});

		expect(detectMissedUnlocksMock).toHaveBeenCalledTimes(1);
		jest.restoreAllMocks();
	});

	it("onRehydrateStorage should show toast on failed hydration", async () => {
		const showToastMock = jest.fn();
		jest.spyOn(useQuizStore, "getState").mockReturnValue({
			...useQuizStore.getState(),
			showToast: showToastMock,
			detectMissedUnlocks: jest.fn(),
		});

		// Simulate failed rehydration by throwing an error
		(AsyncStorage.getItem as jest.Mock).mockImplementationOnce(() => {
			return Promise.reject(new Error("Storage read error"));
		});

		// Manually trigger rehydration process and expect it to catch the error
		await act(async () => {
			await useQuizStore.persist.rehydrate();
		});

		expect(showToastMock).toHaveBeenCalledWith(
			"Fehler beim Laden der Daten!",
			"error",
			5000,
		);
		jest.restoreAllMocks();
	});
});
