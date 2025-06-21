import type { StateCreator } from "zustand";
import type { QuizStore } from "../Store";

interface ToastState {
	visible: boolean;
	message: string;
	type: "success" | "error" | "info" | "warning";
	duration?: number;
}

export interface UISlice {
	currentQuizId: string | null;
	isLoading: boolean;
	loadingOperations: Set<string>;
	toast: ToastState | null;
	navigationHistory: string[]; // PERSISTED
	setLoading: (operation: string, loading: boolean) => void;
	showToast: (
		message: string,
		type?: ToastState["type"],
		duration?: number,
	) => void;
	hideToast: () => void;
	setCurrentQuiz: (quizId: string | null) => void;
}

export const createUISlice: StateCreator<QuizStore, [], [], UISlice> = (
	set,
	get,
	store,
) => ({
	currentQuizId: null,
	isLoading: false,
	loadingOperations: new Set(),
	toast: null,
	navigationHistory: [],
	setLoading: (operation: string, loading: boolean) => {
		set((state) => {
			const newOperations = new Set(state.loadingOperations);
			if (loading) {
				newOperations.add(operation);
			} else {
				newOperations.delete(operation);
			}
			return {
				loadingOperations: newOperations,
				isLoading: operation === "global" ? loading : newOperations.size > 0,
			};
		});
	},
	showToast: (message: string, type = "info" as const, duration = 3000) => {
		console.log(`[UISlice] Showing ${type} toast: ${message}`);
		set({ toast: { visible: true, message, type, duration } });
		setTimeout(() => {
			get().hideToast();
		}, duration);
	},
	hideToast: () => {
		set({ toast: null });
	},
	setCurrentQuiz: (quizId: string | null) => {
		set((state) => ({
			currentQuizId: quizId,
			navigationHistory: quizId
				? [
						quizId,
						...state.navigationHistory.filter((id) => id !== quizId),
					].slice(0, 10)
				: state.navigationHistory,
		}));
	},
});
