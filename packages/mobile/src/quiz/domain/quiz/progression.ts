import { type Question, QuestionStatus, type QuizState } from "../../types";
import { isAnswerCorrect } from "./answerComparison";

export const findNextInactiveQuestionIndex = (
	questions: Question[],
): number => {
	return questions.findIndex((q) => q.status === QuestionStatus.INACTIVE);
};

export const calculateNewQuestionsAfterCorrectAnswer = (
	questions: Question[],
	questionIndex: number,
): Question[] => {
	// Füge diese Prüfung am Anfang hinzu
	if (questionIndex < 0 || questionIndex >= questions.length) {
		return [...questions]; // Gib eine Kopie des Original-Arrays zurück, um Unveränderlichkeit zu gewährleisten
	}

	const newQuestions = questions.map((q, index) => {
		if (index === questionIndex) {
			return { ...q, status: QuestionStatus.SOLVED };
		}
		return q;
	});

	const nextInactiveIndex = findNextInactiveQuestionIndex(newQuestions);
	if (nextInactiveIndex !== -1) {
		newQuestions[nextInactiveIndex] = {
			...newQuestions[nextInactiveIndex],
			status: QuestionStatus.ACTIVE,
		};
	}

	return newQuestions;
};

export const calculateAnswerResult = (
	state: QuizState,
	questionId: number,
	answer: string,
): { newState: QuizState; isCorrect: boolean } => {
	const questionIndex = state.questions.findIndex((q) => q.id === questionId);
	if (questionIndex === -1) {
		throw new Error(`Frage mit ID ${questionId} nicht gefunden`);
	}

	const question = state.questions[questionIndex];
	const isCorrect = isAnswerCorrect(
		answer,
		question.answer,
		question.alternativeAnswers,
	);

	if (!isCorrect) {
		return { newState: state, isCorrect };
	}

	const newQuestions = calculateNewQuestionsAfterCorrectAnswer(
		state.questions,
		questionIndex,
	);

	console.log("state.completedQuestions", state.completedQuestions);

	return {
		newState: {
			...state,
			questions: newQuestions,
			completedQuestions: state.completedQuestions + 1,
		},
		isCorrect,
	};
};

export const sortQuestionsByIds = (questions: Question[]): Question[] => {
	return [...questions].sort((a, b) => a.id - b.id);
};

export const findNextUnsolvedQuestionForward = (
	sortedQuestions: Question[],
	currentIndex: number,
): Question | null => {
	for (let i = currentIndex + 1; i < sortedQuestions.length; i++) {
		if (sortedQuestions[i].status !== "solved") {
			return sortedQuestions[i];
		}
	}
	return null;
};

export const findNextUnsolvedQuestionBackward = (
	sortedQuestions: Question[],
	currentIndex: number,
): Question | null => {
	// Schleife muss von currentIndex - 1 abwärts gehen
	for (let i = currentIndex - 1; i >= 0; i--) {
		// <-- Korrektur hier
		if (sortedQuestions[i].status !== QuestionStatus.SOLVED) {
			return sortedQuestions[i];
		}
	}
	return null;
};

export const findFirstUnsolvedQuestion = (
	questions: Question[],
): Question | null => {
	return questions.find((q) => q.status !== "solved") || null;
};

export const getNextActiveQuestionId = (
	state: QuizState,
	currentQuestionId?: number,
): number | null => {
	const sortedQuestions = sortQuestionsByIds(state.questions);

	if (currentQuestionId !== undefined) {
		const currentIndex = sortedQuestions.findIndex(
			(q) => q.id === currentQuestionId,
		);

		if (currentIndex !== -1) {
			// Suche vorwärts
			const nextForward = findNextUnsolvedQuestionForward(
				sortedQuestions,
				currentIndex,
			);
			if (nextForward) return nextForward.id;

			// Suche rückwärts
			const nextBackward = findNextUnsolvedQuestionBackward(
				sortedQuestions,
				currentIndex,
			);
			if (nextBackward) return nextBackward.id;
		}
	}

	// Finde erste ungelöste Frage
	const firstUnsolved = findFirstUnsolvedQuestion(sortedQuestions);
	return firstUnsolved ? firstUnsolved.id : null;
};
