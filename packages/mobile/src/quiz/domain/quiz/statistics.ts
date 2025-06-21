import type { QuizState } from "../../types";

export function countTotalQuizzes(quizStates: { [id: string]: QuizState }) {
	return Object.values(quizStates).length;
}

export function countCompletedQuizzes(quizStates: {
	[id: string]: QuizState;
}): number {
	return Object.values(quizStates).filter(
		(quiz) => quiz.completedQuestions === quiz.questions.length,
	).length;
}

export function countTotalQuestions(quizStates: {
	[id: string]: QuizState;
}): number {
	return Object.values(quizStates).reduce(
		(sum, quiz) => sum + quiz.questions.length,
		0,
	);
}

export function countCompletedQuestions(quizStates: {
	[id: string]: QuizState;
}): number {
	return Object.values(quizStates).reduce(
		(sum, quiz) => sum + quiz.completedQuestions,
		0,
	);
}

export function calculateCompletionPercentage(
	totalQuestions: number,
	completedQuestions: number,
): number {
	return totalQuestions > 0
		? Math.round((completedQuestions / totalQuestions) * 100)
		: 0;
}

export const isCompleted = (state: QuizState): boolean => {
	return state.completedQuestions === state.questions.length;
};

export const calculateQuizProgress = (state: QuizState): number => {
	if (!state.questions?.length) return 0;
	return Math.round((state.completedQuestions / state.questions.length) * 100);
};

export const createProgressString = (state: QuizState): string | null => {
	if (!state.questions?.length) return null;
	return `${state.completedQuestions}/${state.questions.length}`;
};
