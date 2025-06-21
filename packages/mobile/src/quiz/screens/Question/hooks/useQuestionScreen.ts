import { useHints } from "@/quiz/store/hooks/useHints";
import { useQuiz } from "@/quiz/store/hooks/useQuiz";
import { QuestionStatus } from "@/quiz/types";
import { useMemo, useState } from "react";
import { useAnswerState } from "./useAnswerState";
import { useQuestionBusinessLogic } from "./useQuestionBusinessLogic";
import { useQuestionNavigation } from "./useQuestionNavigation";
import { useResultState } from "./useQuestionResultState";

export function useQuestionScreen(quizId: string, questionId: string) {
	const { getQuizState } = useQuiz();
	const { hasVisibleHints } = useHints(quizId, Number.parseInt(questionId));

	// Composition of smaller hooks
	const navigation = useQuestionNavigation(quizId, questionId);
	const answerState = useAnswerState();
	const resultState = useResultState();

	const quizState = getQuizState(quizId);
	const question = quizState?.questions.find(
		(q) => q.id === Number.parseInt(questionId),
	);

	const isSolved = question?.status === QuestionStatus.SOLVED;
	const showInput = useMemo(() => !isSolved, [isSolved]);

	// Business logic delegation
	const { handleSubmit } = useQuestionBusinessLogic({
		quizId,
		questionId,
		question,
		answerState,
		resultState,
	});

	// Initialize solved state
	useState(() => {
		if (isSolved) {
			resultState.setShowResult(true);
			resultState.setIsCorrect(true);
		}
	});

	const headerText = useMemo(() => {
		if (isSolved && question?.answer) {
			return question.answer;
		}
		return question?.title || "Wie heißt das Tier?";
	}, [isSolved, question?.answer, question?.title]);

	const showResultReaction =
		answerState.submittedAnswer &&
		resultState.showResult &&
		!resultState.showHint;

	return {
		// Data
		quizState,
		question,
		isSolved,
		hasVisibleHints,
		showInput,
		headerText,

		// Composed state
		...answerState,
		...resultState,
		...navigation,

		// Actions
		handleSubmit,
		showResultReaction,
	};
}
