import { animalQuizConfigs } from "@/animals/quizzes";
import { ThemedText } from "@/common/components/ThemedText";
import React, { type ReactNode, useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import {
	initializeAllQuizzes,
	registerQuizzes,
} from "../initialization/registerQuizzes";
import { useQuizStore } from "../store/Store";

interface QuizProviderProps {
	children: ReactNode;
}

export function QuizProvider({ children }: QuizProviderProps) {
	const hasStoreHydrated = useQuizStore.persist.hasHydrated();
	const isQuizDataLoadedInStore = useQuizStore(
		(state) => state.isQuizDataLoaded,
	);
	const setQuizDataLoaded = useQuizStore((state) => state.setQuizDataLoaded);
	const quizStatesRecord = useQuizStore((state) => state.quizStates);
	const quizzesRecord = useQuizStore((state) => state.quizzes);

	const hasRegisteredQuizzesRef = useRef(false);
	const hasInitializedStatesRef = useRef(false);

	const quizzesCount = Object.keys(quizzesRecord).length;
	const quizStatesRecordCount = Object.keys(quizStatesRecord).length;

	const hasQuizzes = quizzesCount > 0;
	const hasQuizStates = quizStatesRecordCount > 0;

	// ZUSÄTZLICH: Reset detection
	const previousQuizStatesCountRef = useRef<number>(
		Object.keys(quizStatesRecord).length,
	);
	const currentQuizStatesCount = Object.keys(quizStatesRecord).length;

	// Detect if quizzes were reset (count went to 0 or significantly reduced)
	useEffect(() => {
		const previousCount = previousQuizStatesCountRef.current;
		const currentCount = currentQuizStatesCount;

		if (previousCount > 0 && currentCount === 0) {
			console.log(
				"[QuizProvider] RESET DETECTED: Quiz states were cleared, resetting flags",
			);
			hasRegisteredQuizzesRef.current = false;
			hasInitializedStatesRef.current = false;
			setQuizDataLoaded(false); // WICHTIG: Reset das Data-Loaded Flag
		}

		previousQuizStatesCountRef.current = currentCount;
	}, [currentQuizStatesCount, setQuizDataLoaded]);

	// Effekt zur Registrierung statischer Quiz-Daten
	useEffect(() => {
		let isMounted = true;

		console.log(
			`[QuizProvider-Effect1] Check conditions - Hydrated: ${hasStoreHydrated}, RegisteredRef: ${hasRegisteredQuizzesRef.current}, DataLoadedInStore: ${isQuizDataLoadedInStore}, QuizzesCount: ${Object.keys(quizzesRecord).length}`,
		);

		// VERBESSERTE BEDINGUNG: Prüfe auch ob Quizzes im Store vorhanden sind
		if (
			!hasStoreHydrated ||
			hasRegisteredQuizzesRef.current ||
			(isQuizDataLoadedInStore && Object.keys(quizzesRecord).length > 0)
		) {
			console.log(
				`[QuizProvider-Effect1] Skipping registration. Conditions not met.`,
			);
			return;
		}

		console.log(
			"[QuizProvider-Effect1] Attempting to register quiz configs...",
		);

		try {
			registerQuizzes(animalQuizConfigs);

			const currentQuizzesInStore = useQuizStore.getState().quizzes;
			console.log(
				"[QuizProvider-Effect1] Quizzes in store AFTER registerQuizzes:",
				Object.keys(currentQuizzesInStore).length,
			);

			if (Object.keys(currentQuizzesInStore).length > 0) {
				console.log(
					"[QuizProvider-Effect1] Quiz configs successfully registered. Setting isQuizDataLoaded to true.",
				);
				if (isMounted) {
					setQuizDataLoaded(true);
					hasRegisteredQuizzesRef.current = true;
				}
			} else {
				console.warn(
					"[QuizProvider-Effect1] Quiz configs registered, but quizzes object in store is still empty.",
				);
			}
		} catch (error) {
			console.error(
				"[QuizProvider-Effect1] Error during quiz registration:",
				error,
			);
			// Bei Fehler flags zurücksetzen
			hasRegisteredQuizzesRef.current = false;
			setQuizDataLoaded(false);
		}

		return () => {
			isMounted = false;
		};
	}, [
		hasStoreHydrated,
		isQuizDataLoadedInStore,
		setQuizDataLoaded,
		hasQuizzes,
		quizzesRecord,
	]); // WICHTIG: quizzesRecord.length als Dependency

	// Effekt zur Initialisierung benutzerspezifischer Quiz-Zustände (asynchron)
	useEffect(() => {
		let isMounted = true;

		const areQuizStatesInitializedInStore =
			Object.keys(quizStatesRecord).length > 0;

		console.log(
			`[QuizProvider-Effect2] Check conditions - DataLoaded: ${isQuizDataLoadedInStore}, InitializedRef: ${hasInitializedStatesRef.current}, StatesInStore: ${areQuizStatesInitializedInStore}, QuizzesInStore: ${Object.keys(quizzesRecord).length}`,
		);

		if (
			!isQuizDataLoadedInStore ||
			hasInitializedStatesRef.current ||
			areQuizStatesInitializedInStore ||
			Object.keys(quizzesRecord).length === 0
		) {
			console.log(
				`[QuizProvider-Effect2] Skipping state initialization. Conditions not met.`,
			);
			return;
		}

		const initializeStates = async () => {
			console.log("[QuizProvider-Effect2] Initializing all quiz states...");
			try {
				await initializeAllQuizzes();
				if (isMounted) {
					hasInitializedStatesRef.current = true;
					console.log("[QuizProvider-Effect2] All quiz states initialized.");
				}
			} catch (error) {
				console.error(
					"[QuizProvider-Effect2] Error during state initialization:",
					error,
				);
				// Bei Fehler flag zurücksetzen
				hasInitializedStatesRef.current = false;
			}
		};

		initializeStates();

		return () => {
			isMounted = false;
		};
	}, [
		isQuizDataLoadedInStore,
		hasQuizStates,
		hasQuizzes,
		quizzesRecord,
		quizStatesRecord,
	]); // WICHTIG: beide als Dependencies

	// VERBESSERTE App-Ready-Logik
	const isAppReady =
		hasStoreHydrated && isQuizDataLoadedInStore && hasQuizzes && hasQuizStates;

	console.log(`[QuizProvider] App readiness check:`, {
		hasStoreHydrated,
		isQuizDataLoadedInStore,
		hasQuizzes,
		hasQuizStates,
		isAppReady,
	});

	if (!isAppReady) {
		const loadingMessage = !hasStoreHydrated
			? "Store wird geladen..."
			: !isQuizDataLoadedInStore || !hasQuizzes
				? "Quiz-Daten werden geladen..."
				: !hasQuizStates
					? "Quiz-Zustände werden initialisiert..."
					: "App wird geladen...";

		console.log(`[QuizProvider] App not ready: ${loadingMessage}`);

		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#0000ff" />
				<ThemedText style={styles.loadingText}>{loadingMessage}</ThemedText>
			</View>
		);
	}

	console.log("[QuizProvider] App ready, rendering children");
	return <>{children}</>;
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f0f0f0",
	},
	loadingText: {
		marginTop: 20,
		fontSize: 18,
		color: "#333",
	},
});
