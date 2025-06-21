import { useMemo } from "react";

import type { Quiz, QuizState } from "../../types";
import { useQuizStore } from "../Store";

export function useQuiz() {
	const quizzesRecord = useQuizStore((state) => state.quizzes);
	const quizStatesRecord = useQuizStore((state) => state.quizStates);
	const quizConfigsRecord = useQuizStore((state) => state.quizConfigs);
	const isQuizDataLoaded = useQuizStore((state) => state.isQuizDataLoaded);

	const quizzes = useMemo(() => {
		const quizArray = Object.values(quizzesRecord);
		console.log(
			`[useQuiz Hook] Converting ${quizArray.length} quizzes to array. isQuizDataLoaded: ${isQuizDataLoaded}`,
		);
		return quizArray;
	}, [quizzesRecord, isQuizDataLoaded]);

	const getQuizById = useMemo(
		() =>
			(id: string): Quiz | undefined => {
				return quizzesRecord[id];
			},
		[quizzesRecord],
	);

	const getQuizState = useMemo(
		() =>
			(id: string): QuizState | undefined => {
				return quizStatesRecord[id];
			},
		[quizStatesRecord],
	);

	const currentQuizId = useQuizStore((state) => state.currentQuizId);
	const currentQuizState = useQuizStore((state) =>
		state.currentQuizId ? state.quizStates[state.currentQuizId] : null,
	);
	const isLoading = useQuizStore((state) => state.isLoading);

	// Aktionen aus dem Store auswählen
	const initializeQuizState = useQuizStore(
		(state) => state.initializeQuizState,
	);
	const updateQuizState = useQuizStore((state) => state.updateQuizState);
	const resetQuizState = useQuizStore((state) => state.resetQuizState);
	const answerQuestion = useQuizStore((state) => state.answerQuestion);
	const setCurrentQuiz = useQuizStore((state) => state.setCurrentQuiz);
	const startQuiz = useQuizStore((state) => state.startQuiz);
	const resetQuiz = useQuizStore((state) => state.resetQuiz);

	// Fortschritts- und Navigationsaktionen aus dem Store auswählen
	const getQuizProgress = useQuizStore((state) => state.getQuizProgress);
	const getQuizProgressString = useQuizStore(
		(state) => state.getQuizProgressString,
	);
	const getNextActiveQuestion = useQuizStore(
		(state) => state.getNextActiveQuestion,
	);

	// Freischalt-System-Aktionen aus dem Store auswählen
	const checkForUnlocks = useQuizStore((state) => state.checkForUnlocks);
	const isQuizUnlocked = useQuizStore((state) => state.isQuizUnlocked);
	const getUnlockProgress = useQuizStore((state) => state.getUnlockProgress);
	const detectMissedUnlocks = useQuizStore(
		(state) => state.detectMissedUnlocks,
	);
	const resetAllQuizStates = useQuizStore((state) => state.resetAllQuizStates); // Diese Aktion ist jetzt global im Store definiert

	// Abgeleitete Funktion: Prüfen, ob ein Quiz abgeschlossen ist
	const isQuizCompleted = useMemo(
		() =>
			(quizId: string): boolean => {
				const state = quizStatesRecord[quizId];
				return state
					? state.completedQuestions === state.questions.length
					: false;
			},
		[quizStatesRecord],
	);

	// Abgeleitete Funktion: Freischaltbeschreibung abrufen
	const getUnlockDescription = useMemo(
		() =>
			(quizId: string): string | null => {
				const config = quizConfigsRecord[quizId];
				return config?.unlockCondition?.description || null;
			},
		[quizConfigsRecord],
	);

	// Abgeleitete Funktion: Allgemeine Statistiken abrufen
	const getStatistics = useMemo(
		() => () => {
			const allStates = Object.values(quizStatesRecord);
			const totalQuizzes = allStates.length;
			const completedQuizzes = allStates.filter(
				(quiz) => quiz.completedQuestions === quiz.questions.length,
			).length;
			const totalQuestions = allStates.reduce(
				(sum, quiz) => sum + quiz.questions.length,
				0,
			);
			const completedQuestions = allStates.reduce(
				(sum, quiz) => sum + quiz.completedQuestions,
				0,
			);
			const completionPercentage =
				totalQuestions > 0
					? Math.round((completedQuestions / totalQuestions) * 100)
					: 0;

			return {
				totalQuizzes,
				completedQuizzes,
				totalQuestions,
				completedQuestions,
				completionPercentage,
			};
		},
		[quizStatesRecord],
	);

	return {
		// Datenzugriff
		quizzes,
		getQuizById,
		getQuizState,
		isQuizDataLoaded,

		// Aktueller Zustand
		currentQuizId,
		currentQuizState,
		isLoading,

		// Quiz-Operationen
		initializeQuizState,
		updateQuizState,
		resetQuizState,
		startQuiz,
		resetQuiz,
		setCurrentQuiz,

		// Antwortverarbeitung
		answerQuestion,

		// Fortschritt
		getQuizProgress,
		getQuizProgressString,
		isQuizCompleted,
		getNextActiveQuestion,

		// Freischalt-System
		checkForUnlocks,
		isQuizUnlocked,
		getUnlockProgress,
		getUnlockDescription,
		detectMissedUnlocks,

		// Datenmanagement
		getStatistics,
		resetAllQuizStates,
	};
}
