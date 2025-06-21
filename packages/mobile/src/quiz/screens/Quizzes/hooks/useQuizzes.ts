import { useQuiz } from "@/quiz/store/hooks/useQuiz";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export const useQuizzes = () => {
	const {
		setCurrentQuiz,
		getUnlockProgress,
		getQuizProgress,
		getQuizProgressString,
		initializeQuizState,
		getQuizState,
	} = useQuiz();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		console.log("[useQuizzes] hook rendering");
	});

	// Fortschritt für ein Quiz abrufen mit Debug-Ausgabe - in useCallback einpacken
	const getProgress = useCallback(
		(quizId: string): number => {
			const progress = getQuizProgress(quizId);
			console.log(
				`[QuizDisplayProvider] Progress for quiz ${quizId}: ${progress}%`,
			);

			// Debug: Direkt den Quiz-Zustand prüfen
			const state = getQuizState(quizId);
			if (state) {
				const calculatedProgress =
					(state.completedQuestions / state.questions.length) * 100;
				console.log(
					`[QuizDisplayProvider] Quiz state for ${quizId}: ${state.completedQuestions}/${state.questions.length} = ${calculatedProgress}%`,
				);
			} else {
				console.log(`[QuizDisplayProvider] No quiz state found for ${quizId}`);
			}

			return progress;
		},
		[getQuizProgress, getQuizState],
	);

	// Navigieren zu einem Quiz, inkl. dessen Initialisierung - in useCallback einpacken
	const navigateToQuiz = useCallback(
		async (quizId: string) => {
			setIsLoading(true);
			try {
				// Quiz-Zustand initialisieren, falls noch nicht geschehen
				const state = await initializeQuizState(quizId);
				if (state) {
					console.log(
						`[QuizDisplayProvider] Quiz ${quizId} initialized: ${state.completedQuestions}/${state.questions.length} completed`,
					);
				}

				// Zum Quiz navigieren
				setCurrentQuiz(quizId);
				router.navigate(`/quiz/${quizId}`);
			} catch (error) {
				console.error(
					`[QuizDisplayProvider] Error navigating to quiz ${quizId}:`,
					error,
				);
			} finally {
				setIsLoading(false);
			}
		},
		[initializeQuizState, setCurrentQuiz],
	);

	return {
		isLoading,
		getUnlockInfo: getUnlockProgress,
		getProgress,
		navigateToQuiz,
		getQuizProgress,
		getQuizProgressString,
		initializeQuizState,
	};
};
