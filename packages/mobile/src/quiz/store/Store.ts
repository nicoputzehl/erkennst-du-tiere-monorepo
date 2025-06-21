import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import {
	type StorageValue,
	persist,
	subscribeWithSelector,
} from "zustand/middleware";
import { QuizUtils } from "../domain/quiz";
import type { QuizState } from "../types";

import { HintUtils } from "../domain/hints";
import type { HintState, UserPointsState } from "../types/hint";
import { type HintSlice, createHintSlice } from "./slices/Hint";
import { type QuizDataSlice, createQuizDataSlice } from "./slices/Data";
import { type QuizStateSlice, createQuizStateSlice } from "./slices/State";
import { type UISlice, createUISlice } from "./slices/UI";
import { type UnlockSlice, createUnlockSlice } from "./slices/Unlock";

export interface QuizStore
	extends QuizDataSlice,
		QuizStateSlice,
		UISlice,
		UnlockSlice,
		HintSlice {
	userPoints: UserPointsState;
	clearPersistedData: () => Promise<void>;
}

const STORAGE_KEY = "quiz_store_v1";

// Definieren des Typs für die persistierten Eigenschaften
type PersistedQuizStore = Pick<
	QuizStore,
	"quizStates" | "navigationHistory" | "pendingUnlocks" | "userPoints"
>;

export const useQuizStore = create<QuizStore>()(
	persist(
		subscribeWithSelector((set, get, store) => ({
			// Kombiniere die Slices
			...createQuizDataSlice(set, get, store), // Pass 'store' to slice creators
			...createQuizStateSlice(set, get, store), // Pass 'store' to slice creators
			...createUISlice(set, get, store), // Pass 'store' to slice creators
			...createUnlockSlice(set, get, store), // Pass 'store' to slice creators
			...createHintSlice(set, get, store), // Pass 'store' to slice creators

			userPoints: HintUtils.getInitialUserPoints(),

			// Aktionen, die den gesamten Store betreffen oder Slices koordinieren
			// src/quiz/store/Quiz.store.ts - FIXED resetAllQuizStates function

			// In der useQuizStore create function, ersetzen Sie die resetAllQuizStates Funktion:

			resetAllQuizStates: () => {
				console.log("[QuizStore] Resetting all quiz states (global action)...");

				const { quizzes, quizConfigs } = get();

				// WICHTIG: Prüfe ob Quizzes vorhanden sind
				if (Object.keys(quizzes).length === 0) {
					console.warn(
						"[QuizStore] No quizzes available for reset. This might indicate a problem.",
					);

					// Setze trotzdem alle Flags zurück
					set((state) => ({
						quizStates: {},
						pendingUnlocks: [],
						navigationHistory: [],
						currentQuizId: null,
						isLoading: false,
						loadingOperations: new Set(),
						toast: null,
						isQuizDataLoaded: false,
						userPoints: HintUtils.getInitialUserPoints(), // FIXED: Reset user points too
					}));

					console.log("[QuizStore] Reset completed despite missing quizzes.");
					return;
				}

				const newQuizStates: Record<string, QuizState> = {};

				try {
					for (const quiz of Object.values(quizzes)) {
						const config = quizConfigs[quiz.id];
						if (config) {
							const newQuizState = QuizUtils.createQuizState(quiz, {
								initialUnlockedQuestions: config.initialUnlockedQuestions || 2,
							});
							if (newQuizState) {
								// FIXED: Ensure hint states are properly initialized for each question
								const hintStates: Record<number, HintState> = {};
								for (const question of quiz.questions) {
									hintStates[question.id] = {
										questionId: question.id,
										usedHints: [],
										wrongAttempts: 0,
										autoFreeHintsUsed: [],
									};
								}

								newQuizState.hintStates = hintStates;
								newQuizStates[quiz.id] = newQuizState;
							}
						} else {
							console.warn(`[QuizStore] No config found for quiz ${quiz.id}`);
						}
					}

					console.log(
						`[QuizStore] Created ${Object.keys(newQuizStates).length} new quiz states with reset hint states`,
					);

					set((state) => ({
						quizStates: newQuizStates,
						pendingUnlocks: [],
						navigationHistory: [],
						currentQuizId: null,
						isLoading: false,
						loadingOperations: new Set(),
						toast: null,
						// WICHTIG: isQuizDataLoaded NICHT zurücksetzen, da die Quizzes noch geladen sind
						isQuizDataLoaded: state.isQuizDataLoaded, // Keep current value
						userPoints: HintUtils.getInitialUserPoints(), // FIXED: Reset points completely
					}));

					console.log(
						"[QuizStore] All quiz states reset complete with hint states.",
					);
				} catch (error) {
					console.error("[QuizStore] Error during reset:", error);

					// Bei Fehler sicherheitshalber alles zurücksetzen
					set((state) => ({
						quizStates: {},
						pendingUnlocks: [],
						navigationHistory: [],
						currentQuizId: null,
						isLoading: false,
						loadingOperations: new Set(),
						toast: null,
						isQuizDataLoaded: false,
						userPoints: HintUtils.getInitialUserPoints(),
					}));
				}
			},
			clearPersistedData: async () => {
				try {
					await AsyncStorage.removeItem(STORAGE_KEY);
					// Setze den gesamten Store auf den Initialzustand zurück, indem die Zustandseigenschaften direkt zurückgesetzt werden.
					// Dies vermeidet den Fehler "Expected 3 arguments, but got 2" bei der erneuten Initialisierung der Slices.
					set({
						// Reset QuizDataSlice state
						quizzes: {},
						quizConfigs: {},
						isQuizDataLoaded: false,
						// Reset QuizStateSlice state
						quizStates: {},
						// Reset UISlice state
						currentQuizId: null,
						isLoading: false,
						loadingOperations: new Set(),
						toast: null,
						navigationHistory: [],
						// Reset UnlockSlice state
						pendingUnlocks: [],
						userPoints: HintUtils.getInitialUserPoints(),
					});
					console.log(
						"[QuizStore] All persisted data cleared and store reset.",
					);
				} catch (error) {
					console.error("[QuizStore] Failed to clear persisted data:", error);
					throw error;
				}
			},
		})),
		{
			name: STORAGE_KEY,
			storage: {
				getItem: async (name: string) => {
					try {
						const value = await AsyncStorage.getItem(name);
						return value ? JSON.parse(value) : null;
					} catch (error) {
						console.error(
							`[QuizStore] Failed to get item from storage (${name}):`,
							error,
						);
						throw error;
					}
				},
				setItem: async (
					name: string,
					value: StorageValue<PersistedQuizStore>,
				) => {
					try {
						await AsyncStorage.setItem(name, JSON.stringify(value));
					} catch (error) {
						console.error(
							`[QuizStore] Failed to set item to storage (${name}):`,
							error,
						);
						throw error;
					}
				},
				removeItem: async (name: string) => {
					try {
						await AsyncStorage.removeItem(name);
					} catch (error) {
						console.error(
							`[QuizStore] Failed to remove item from storage (${name}):`,
							error,
						);
						throw error;
					}
				},
			},
			partialize: (state): PersistedQuizStore => ({
				quizStates: state.quizStates,
				navigationHistory: state.navigationHistory,
				pendingUnlocks: state.pendingUnlocks,
				userPoints: state.userPoints,
			}),
			onRehydrateStorage: (state) => {
				console.log(
					"[QuizStore] Rehydrating store - START onRehydrateStorage callback",
				);
				return (persistedState, error) => {
					if (error) {
						console.error("[QuizStore] Hydration failed", error);
						useQuizStore
							.getState()
							.showToast("Fehler beim Laden der Daten!", "error", 5000);
					} else {
						console.log(
							"[QuizStore] Hydration successful. Now performing post-hydration tasks.",
						);
						useQuizStore.getState().detectMissedUnlocks(); // Aufruf einer Aktion aus UnlockSlice
					}
					console.log(
						"[QuizStore] Rehydrating store - END onRehydrateStorage callback",
					);
				};
			},
		},
	),
);
