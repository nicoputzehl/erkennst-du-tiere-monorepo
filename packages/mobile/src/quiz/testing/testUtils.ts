import { createQuizConfig } from "../domain/quiz/factories";
import {
	type Question,
	type QuestionBase,
	QuestionStatus,
	type Quiz,
	type QuizConfig,
	type QuizState,
} from "../types";

/**
 * Erstellt Test-Frage - reine Factory-Funktion
 */
export const createTestQuestion = (
	overrides: Partial<QuestionBase> = {},
): QuestionBase => ({
	id: 1,
	images: {
		imageUrl: 4,
		thumbnailUrl: 5,
	},
	answer: "Test Answer",
	alternativeAnswers: ["Alt Answer"],
	funFact: "Test fun fact",
	wikipediaName: "Test_Wikipedia",
	...overrides,
});

/**
 * Erstellt Test-Quiz-Frage mit Status - reine Factory-Funktion
 */
export const createTestQuizQuestion = (
	overrides: Partial<Question> = {},
): Question => ({
	id: 1,
	images: {
		imageUrl: 4,
		thumbnailUrl: 5,
	},
	answer: "Test Answer",
	alternativeAnswers: ["Alt Answer"],
	funFact: "Test fun fact",
	wikipediaName: "Test_Wikipedia",
	status: QuestionStatus.ACTIVE,
	...overrides,
});

/**
 * Erstellt Test-Quiz-Inhalt - reine Factory-Funktion
 */
export const createTestQuiz = (overrides: Partial<Quiz> = {}): Quiz => ({
	id: "test-quiz",
	title: "Test Quiz",
	questions: [createTestQuestion()],
	...overrides,
});

/**
 * Erstellt Test-Quiz-Konfiguration - reine Factory-Funktion
 */
export const createTestQuizConfig = (
	overrides: Partial<QuizConfig> = {},
): QuizConfig => {
	const baseQuiz = createTestQuiz(overrides);

	return createQuizConfig(baseQuiz, {
		initiallyLocked: overrides.initiallyLocked ?? false,
		order: overrides.order ?? 1,
		initialUnlockedQuestions: overrides.initialUnlockedQuestions ?? 2,
		unlockCondition: overrides.unlockCondition,
	});
};

/**
 * Erstellt Test-Quiz-State - reine Factory-Funktion
 */
export const createTestQuizState = (
	overrides: Partial<QuizState> = {},
): QuizState => ({
	id: "test-quiz-state",
	title: "Test Quiz State",
	questions: [createTestQuizQuestion()],
	completedQuestions: 0,
	hintStates: {},
	...overrides,
});

/**
 * Builder für komplexe Quiz-States - funktionale Komposition
 */
export const quizStateBuilder = (baseState: Partial<QuizState> = {}) => ({
	withQuestions: (count: number) => {
		const questions = Array.from({ length: count }, (_, i) =>
			createTestQuizQuestion({ id: i + 1 }),
		);
		return quizStateBuilder({ ...baseState, questions });
	},

	withCompletedQuestions: (count: number) => {
		return quizStateBuilder({ ...baseState, completedQuestions: count });
	},

	withSolvedQuestions: (solvedIndices: number[]) => {
		const questions = (baseState.questions || [createTestQuizQuestion()]).map(
			(q, i) =>
				solvedIndices.includes(i)
					? { ...q, status: QuestionStatus.SOLVED }
					: { ...q, status: QuestionStatus.ACTIVE },
		);
		return quizStateBuilder({ ...baseState, questions });
	},

	build: (): QuizState => createTestQuizState(baseState),
});

/**
 * Builder für Quiz-Collections - funktionale Komposition
 */
export const quizCollectionBuilder = () => {
	const quizzes: Quiz[] = [];
	const configs: QuizConfig[] = [];

	return {
		addQuiz: (quiz: Partial<Quiz> = {}) => {
			const testQuiz = createTestQuiz(quiz);
			const testConfig = createTestQuizConfig(testQuiz);
			quizzes.push(testQuiz);
			configs.push(testConfig);
			return quizCollectionBuilder();
		},

		addLockedQuiz: (requiredQuizId: string, quiz: Partial<Quiz> = {}) => {
			const testQuiz = createTestQuiz(quiz);
			const testConfig = createTestQuizConfig({
				...testQuiz,
				initiallyLocked: true,
				unlockCondition: {
					requiredQuizId,
					description: `Complete ${requiredQuizId} to unlock`,
				},
			});
			quizzes.push(testQuiz);
			configs.push(testConfig);
			return quizCollectionBuilder();
		},

		buildQuizzes: (): Quiz[] => quizzes,
		buildConfigs: (): QuizConfig[] => configs,
	};
};

/**
 * Erstellt Mock Quiz-States - reine Funktion
 */
export const createMockQuizStates = (
	quizIds: string[],
	completedQuizIds: string[] = [],
): Record<string, QuizState> => {
	return quizIds.reduce(
		(acc, quizId) => {
			const isCompleted = completedQuizIds.includes(quizId);
			acc[quizId] = quizStateBuilder()
				.withQuestions(5)
				.withCompletedQuestions(isCompleted ? 5 : 2)
				.withSolvedQuestions(isCompleted ? [0, 1, 2, 3, 4] : [0, 1])
				.build();
			return acc;
		},
		{} as Record<string, QuizState>,
	);
};

/**
 * Erstellt Mock Unlock-Chain - reine Funktion
 */
export const createMockUnlockChain = (): {
	quizzes: Quiz[];
	configs: QuizConfig[];
} => {
	const builder = quizCollectionBuilder()
		.addQuiz({ id: "quiz1", title: "First Quiz" })
		.addLockedQuiz("quiz1", { id: "quiz2", title: "Second Quiz" })
		.addLockedQuiz("quiz2", { id: "quiz3", title: "Third Quiz" });

	return {
		quizzes: builder.buildQuizzes(),
		configs: builder.buildConfigs(),
	};
};

// Vergleichsfunktionen und Assertions bleiben unverändert...
export const assertQuizStateValid = (state: QuizState): boolean => {
	return (
		state.id.length > 0 &&
		state.title.length > 0 &&
		state.questions.length > 0 &&
		state.completedQuestions >= 0 &&
		state.completedQuestions <= state.questions.length
	);
};

export const assertQuizValid = (quiz: Quiz): boolean => {
	return (
		quiz.id.length > 0 && quiz.title.length > 0 && quiz.questions.length > 0
	);
};

export const assertQuizConfigValid = (config: QuizConfig): boolean => {
	return (
		assertQuizValid(config) &&
		(config.order || 0) >= 0 &&
		(config.initialUnlockedQuestions || 0) >= 0
	);
};

export const areQuizStatesEqual = (
	state1: QuizState,
	state2: QuizState,
): boolean => {
	return (
		state1.id === state2.id &&
		state1.completedQuestions === state2.completedQuestions &&
		state1.questions.length === state2.questions.length &&
		state1.questions.every((q1, i) => {
			const q2 = state2.questions[i];
			return q1.id === q2.id && q1.status === q2.status;
		})
	);
};

// ====== SCENARIO BUILDERS (FUNCTIONAL COMPOSITION) ======
export const scenarioBuilder = {
	emptyQuiz: () =>
		createTestQuizState({
			questions: [],
			completedQuestions: 0,
		}),

	quizInProgress: () =>
		quizStateBuilder()
			.withQuestions(5)
			.withCompletedQuestions(2)
			.withSolvedQuestions([0, 1])
			.build(),

	completedQuiz: () =>
		quizStateBuilder()
			.withQuestions(3)
			.withCompletedQuestions(3)
			.withSolvedQuestions([0, 1, 2])
			.build(),

	unlockChain: () => ({
		...createMockUnlockChain(),
		quizStates: createMockQuizStates(["quiz1"], ["quiz1"]), // quiz1 abgeschlossen
	}),
};
