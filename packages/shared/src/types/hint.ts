import type { QuestionBase } from "./question";

export enum HintType {
	LETTER_COUNT = "letter_count",
	FIRST_LETTER = "first_letter",
	CATEGORY = "category",
	REGION = "region",
	CUSTOM = "custom",
	CONTEXTUAL = "contextual",
	AUTO_FREE = "auto_free",
}

// ==========================================
// BASE & DERIVED INTERFACES
// ==========================================

export interface HintBase {
	id: string;
	type: HintType;
	title: string;
	description: string;
}

export interface StaticHint extends HintBase {
	cost: number;
	type: HintType.CUSTOM | HintType.CATEGORY | HintType.REGION;
	content: string;
}

export interface DynamicHint extends HintBase {
	cost: number;
	type: HintType.LETTER_COUNT | HintType.FIRST_LETTER;
	generator: (question: QuestionBase) => string;
}

export interface ContextualHint extends HintBase {
	type: HintType.CONTEXTUAL;
	triggers: string[];
	content: string;
	triggerSpecificContent?: Record<string, string>;
}

export interface AutoFreeHint extends HintBase {
	type: HintType.AUTO_FREE;
	triggerAfterAttempts: number;
	content: string;
	escalatingContent?: string[];
}

export type Hint = StaticHint | DynamicHint | ContextualHint | AutoFreeHint;

export type PurchasableHint = StaticHint | DynamicHint;

export type UsedHint = {
	id: string;
	title: string;
	content: string;
};

// ==========================================
// STATE TYPES
// ==========================================

export interface HintState {
	questionId: number;
	usedHints: UsedHint[];
	wrongAttempts: number;
	autoFreeHintsUsed: string[];
}

export interface PointTransaction {
	id: string;
	type: "earned" | "spent";
	amount: number;
	reason: string;
	timestamp: number;
	questionId?: number;
	hintId?: string;
	quizId?: string;
}

export interface UserPointsState {
	totalPoints: number;
	earnedPoints: number;
	spentPoints: number;
	pointsHistory: PointTransaction[];
}

// ==========================================
// RESULT TYPES
// ==========================================

export interface UseHintResult {
	success: boolean;
	hintContent?: string;
	pointsDeducted?: number;
	error?: string;
}



export interface HintTriggerResult {
	contextualHints: ContextualHint[];
	autoFreeHints: AutoFreeHint[];
}

// ==========================================
// RESULT TYPES
// ==========================================

