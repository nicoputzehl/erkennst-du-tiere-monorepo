import { useUI } from "@/quiz/store";
import { useHints } from "@/quiz/store/hooks/useHints";
import { useQuiz } from "@/quiz/store/hooks/useQuiz";
import type { Question } from "@/quiz/types";
import { useCallback } from "react";
import type { WrongAnswerHint } from "../Question.types";

interface UseQuestionBusinessLogicProps {
	quizId: string;
	questionId: string;
	question: Question | undefined;
	answerState: {
		answer: string;
		isSubmitting: boolean;
		setIsSubmitting: (value: boolean) => void;
		setSubmittedAnswer: (value: boolean) => void;
	};
	resultState: {
		handleShowHint: (hint: WrongAnswerHint) => void;
		setIsCorrect: (value: boolean) => void;
		setShowResult: (value: boolean) => void;
		setStatusChanged: (value: boolean) => void;
	};
}

export const useQuestionBusinessLogic = ({
	quizId,
	questionId,
	question,
	answerState,
	resultState,
}: UseQuestionBusinessLogicProps) => {
	const { answerQuestion } = useQuiz();
	const { showSuccess } = useUI();

	const {
		recordWrongAnswer,
		markContextualHintAsShown,
		markAutoFreeHintAsShown,
	} = useHints(quizId, Number.parseInt(questionId));

	const handleCorrectAnswer = useCallback(
		async (result: any) => {
			resultState.setIsCorrect(true);
			resultState.setShowResult(true);

			setTimeout(() => {
				resultState.setStatusChanged(true);
			}, 500);

			// Handle unlock notifications
			if (result.unlockedQuizzes.length > 0) {
				result.unlockedQuizzes.forEach((unlockedQuiz: any, index: number) => {
					setTimeout(
						() => {
							showSuccess(`🎉 "${unlockedQuiz.title}" freigeschaltet!`, 4000);
						},
						(index + 1) * 500,
					);
				});
			}
		},
		[resultState, showSuccess],
	);

	const handleIncorrectAnswer = useCallback(
		async (userAnswer: string) => {
			console.log(
				"[handleIncorrectAnswer] Processing incorrect answer:",
				userAnswer,
			);

			const triggerResult = recordWrongAnswer(userAnswer);

			console.log("[handleIncorrectAnswer] Trigger result:", {
				contextualHints: triggerResult.contextualHints.length,
				autoFreeHints: triggerResult.autoFreeHints.length,
			});

			let hintShown = false;

			if (triggerResult.contextualHints.length > 0) {
				const contextualHint = triggerResult.contextualHints[0];

				console.log(
					"[handleIncorrectAnswer] Showing contextual hint:",
					contextualHint.id,
				);

				markContextualHintAsShown(contextualHint.id);

				resultState.handleShowHint({
					title: contextualHint.title,
					content: contextualHint.content,
				});
				hintShown = true;
			} else if (triggerResult.autoFreeHints.length > 0) {
				const autoFreeHint = triggerResult.autoFreeHints[0];

				console.log(
					"[handleIncorrectAnswer] Showing auto-free hint:",
					autoFreeHint.id,
				);

				markAutoFreeHintAsShown(autoFreeHint.id);

				resultState.handleShowHint({
					title: autoFreeHint.title,
					content: autoFreeHint.content,
				});
				hintShown = true;
			}

			resultState.setIsCorrect(false);

			if (!hintShown) {
				resultState.setShowResult(true);
			}
		},
		[
			recordWrongAnswer,
			markContextualHintAsShown,
			markAutoFreeHintAsShown,
			resultState,
		],
	);

	const handleSubmit = useCallback(async () => {
		if (answerState.isSubmitting || !answerState.answer.trim() || !question)
			return;

		answerState.setIsSubmitting(true);

		try {
			const result = await answerQuestion(
				quizId,
				question.id,
				answerState.answer.trim(),
			);

			if (result.isCorrect) {
				await handleCorrectAnswer(result);
			} else {
				await handleIncorrectAnswer(answerState.answer.trim());
			}
		} catch (error) {
			console.error(
				"[useQuestionBusinessLogic] Error submitting answer:",
				error,
			);
			resultState.setIsCorrect(false);
			resultState.setShowResult(true);
		} finally {
			answerState.setIsSubmitting(false);
			answerState.setSubmittedAnswer(true);
		}
	}, [
		answerState,
		question,
		answerQuestion,
		quizId,
		resultState,
		handleCorrectAnswer,
		handleIncorrectAnswer,
	]);

	return { handleSubmit };
};
