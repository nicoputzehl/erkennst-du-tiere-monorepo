import { useMemo } from "react";

import { QuizUtils } from "../../domain/quiz";
import { useQuizStore } from "../Store";

/**
 * Statistics hook
 */
export function useQuizStatistics() {
	const quizStates = useQuizStore((state) => state.quizStates);

	return useMemo(() => {
		return {
			totalQuizzes: QuizUtils.countTotalQuizzes(quizStates),
			completedQuizzes: QuizUtils.countCompletedQuizzes(quizStates),
			totalQuestions: QuizUtils.countTotalQuestions(quizStates),
			completedQuestions: QuizUtils.countCompletedQuestions(quizStates),
			completionPercentage: QuizUtils.calculateCompletionPercentage(
				QuizUtils.countTotalQuestions(quizStates),
				QuizUtils.countCompletedQuestions(quizStates),
			),
		};
	}, [quizStates]);
}
