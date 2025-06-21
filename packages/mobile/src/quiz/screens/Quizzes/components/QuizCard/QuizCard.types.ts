import type { Quiz, UnlockCondition } from "@/quiz/types";

export type QuizCardActiveProps = {
	quiz: Quiz;
	// TODO evtl progress in einem Type zusammenfassen
	quizCardProgress: number;
	quizCardProgressString: string | null;
	onPress: (id: string) => void;
	isLoading: boolean;
};

export type QuizCardLockedProps = {
	quiz: Quiz;
	unlockProgress: UnlockProgress | null;
};

export interface QuizCardViewProps {
	quiz: Quiz;
	variant: "active" | "locked";

	onPress?: (id: string) => void;
	isLoading?: boolean;
	quizCardProgress?: number | null;
	quizCardProgressString?: string | null;

	unlockProgress?: UnlockProgress;
}

// Props for sub-components
export interface QuizImageProps {
	quiz: Quiz;
}

export interface UnlockProgressProps {
	unlockProgress?: UnlockProgress;
}

export interface UnlockProgress {
	condition: UnlockCondition | null;
	progress: number;
}

export type QuizCardVariant = "active" | "locked";
