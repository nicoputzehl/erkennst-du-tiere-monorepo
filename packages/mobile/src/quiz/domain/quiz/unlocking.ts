import type { QuizConfig, QuizState, UnlockCondition } from "../../types";
import { type PlaythroughCondition, type ProgressCondition, isQuizPlaythroughCondition, isQuizProgressCondition } from "../../types/unlock";
import { calculateCompletionPercentage, isCompleted } from "./statistics";

export const checkUnlockCondition = (
	condition: UnlockCondition,
	quizStates: Record<string, QuizState>,
): { isMet: boolean; progress: number } => {
	if (isQuizPlaythroughCondition(condition)) {
		return checkPlaythroughCondition(condition, quizStates);
	}

	if (isQuizProgressCondition(condition)) {
		return checkProgressCondition(condition, quizStates);
	}
	return {
		isMet: false,
		progress: 0,
	};
};

const checkPlaythroughCondition = (
	condition: PlaythroughCondition,
	quizStates: Record<string, QuizState>,
): { isMet: boolean; progress: number } => {
	const quizState = quizStates[condition.requiredQuizId];

	const isRequiredQuizCompleted = quizState
		? isCompleted(quizState)
		: false;
	return {
		isMet: isRequiredQuizCompleted,
		progress: isRequiredQuizCompleted ? 100 : 0,
	};
};

const checkProgressCondition = (
	condition: ProgressCondition,
	quizStates: Record<string, QuizState>,
): { isMet: boolean; progress: number } => {
	const { requiredQuestionsSolved, requiredQuizId } = condition;
	const quizState = quizStates[requiredQuizId];
	console.log("[checkProgressCondition] requiredQuestionsSolved", requiredQuestionsSolved);
	console.log("[checkProgressCondition]  completedQuestions", quizState.completedQuestions);
	const isMet = quizState.completedQuestions >= requiredQuestionsSolved;

	const progress = isMet ? 100 : calculateCompletionPercentage(requiredQuestionsSolved, quizState.completedQuestions);
	console.log("checkProgressCondition",{ isMet, progress });
	return { isMet, progress };
}



export const canUnlockQuiz = (
	config: QuizConfig,
	quizStates: Record<string, QuizState>,
): boolean => {
	if (!config.initiallyLocked || !config.unlockCondition) {
		return true; // Nicht gesperrt oder keine Bedingung -> immer freigeschaltet
	}

	const { isMet } = checkUnlockCondition(config.unlockCondition, quizStates);
	return isMet;
};

export const isQuizUnlocked = (
	config: QuizConfig,
	quizStates: Record<string, QuizState>,
): boolean => {
	if (!config || !config.initiallyLocked) return true;
	if (!config.unlockCondition) return true;
	const isUnlocked = checkUnlockCondition(config.unlockCondition, quizStates).isMet;

	return isUnlocked;
};


export const getUnlockProgress = (
	config: QuizConfig | undefined,
	quizStates: Record<string, QuizState>,
): { condition: UnlockCondition | null; progress: number; isMet: boolean } => {
	if (!config?.initiallyLocked || !config.unlockCondition) {
		return { condition: null, progress: 100, isMet: true };
	}

	const { isMet, progress } = checkUnlockCondition(config.unlockCondition, quizStates);
	return {
		condition: config.unlockCondition,
		progress,
		isMet,
	};
};

