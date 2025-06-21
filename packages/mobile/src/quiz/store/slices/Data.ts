import type { StateCreator } from "zustand";
import type { Quiz, QuizConfig } from "../../types";
import type { QuizStore } from "../Store";

export interface QuizDataSlice {
	quizzes: Record<string, Quiz>;
	quizConfigs: Record<string, QuizConfig>;
	isQuizDataLoaded: boolean;
	registerQuiz: (config: QuizConfig) => void;
	setQuizDataLoaded: (loaded: boolean) => void;
}
// StateCreator ist ein generischer Typ von Zustand, der die Funktion zum Erstellen eines Slices definiert.
// T is the type of the entire store, A and B are middleware types (empty here), C is the slice type.
// The `store` argument is the full StoreApi instance, which is necessary for Zustand's StateCreator.
export const createQuizDataSlice: StateCreator<
	QuizStore,
	[],
	[],
	QuizDataSlice
> = (set, get, store) => ({
	quizzes: {},
	quizConfigs: {},
	isQuizDataLoaded: false,
	registerQuiz: (config: QuizConfig) => {
		console.log(`[QuizDataSlice] Registering quiz: ${config.id}`);
		const quiz: Quiz = {
			id: config.id,
			title: config.title,
			questions: config.questions,
			titleImage: config.titleImage,
		};
		set((state) => ({
			quizzes: { ...state.quizzes, [config.id]: quiz },
			quizConfigs: { ...state.quizConfigs, [config.id]: config },
		}));
	},
	setQuizDataLoaded: (loaded: boolean) => {
		console.log(`[QuizDataSlice] Setting isQuizDataLoaded to: ${loaded}`);
		set({ isQuizDataLoaded: loaded });
	},
});
