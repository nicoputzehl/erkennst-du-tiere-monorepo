import type { HintState } from "./hint";
import type { Question, QuestionBase } from "./question";
import type { UnlockCondition } from "./unlock";

/**
 * Quiz Content - Reine Inhaltsdaten ohne Konfiguration
 * Wird für die Datenanzeige und -verwaltung verwendet
 */
export interface Quiz {
	id: string;
	title: string;
	questions: QuestionBase[];
	titleImage?: number;
}

/**
 * Quiz Configuration - Erweitert Quiz um Konfigurationsoptionen
 * Wird für die Quiz-Erstellung und -Registrierung verwendet
 */
export interface QuizConfig extends Quiz {
	initiallyLocked?: boolean;
	unlockCondition?: UnlockCondition;
	order?: number;
	initialUnlockedQuestions?: number;
}

/**
 * Quiz State - Runtime-Zustand eines Quiz
 * Erweitert Quiz um Status-Informationen
 */
export interface QuizState {
	id: string;
	title: string;
	questions: Question[];
	completedQuestions: number;
	hintStates: Record<number, HintState>;
}

/**
 * Quiz Progress - Fortschrittsinformationen
 */
export interface QuizProgress {
	quizId: string;
	completed: number;
	total: number;
	percentage: number;
}
