import { useUI, useUnlockDetection } from "@/quiz/store";
import { useQuiz } from "@/quiz/store/hooks/useQuiz";
import { useEffect } from "react";

export function useQuizzesScreen() {
	const { quizzes, initializeQuizState } = useQuiz();
	const { checkPendingUnlocks, setLoading } = useUI();

	const { detectMissedUnlocks } = useUnlockDetection();
	useEffect(() => {
		const initialize = async () => {
			setLoading("quizzesInit", true);

			try {
				console.log("[useQuizzesScreen] Initializing quiz states...");

				for (const quiz of quizzes) {
					initializeQuizState(quiz.id);
				}

				console.log("[useQuizzesScreen] All quiz states initialized");

				setTimeout(() => {
					console.log("[useQuizzesScreen] Running missed unlock detection");
					detectMissedUnlocks();
				}, 200);

				// Check for pending unlocks after initialization
				setTimeout(() => {
					checkPendingUnlocks();
				}, 400);
			} catch (error) {
				console.error(
					"[useQuizzesScreen] Error initializing quiz states:",
					error,
				);
			} finally {
				setLoading("quizzesInit", false);
			}
		};

		if (quizzes.length > 0) {
			initialize();
		}
	}, [
		quizzes,
		initializeQuizState,
		checkPendingUnlocks,
		setLoading,
		detectMissedUnlocks,
	]);
}
