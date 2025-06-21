import { router } from "expo-router";
import { useCallback } from "react";

export const useQuestionNavigation = (quizId: string, questionId: string) => {
	const navigateToHintsModal = useCallback(() => {
		router.push(`/quiz/${quizId}/${questionId}/hints-modal`);
	}, [quizId, questionId]);

	const handleBack = useCallback(() => {
		router.back();
	}, []);

	return {
		navigateToHintsModal,

		handleBack,
	};
};
