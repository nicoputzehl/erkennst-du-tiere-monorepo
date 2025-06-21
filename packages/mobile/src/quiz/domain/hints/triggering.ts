// src/quiz/domain/hints/triggering.ts - DEBUG VERSION

import type { QuestionBase } from "../../types";
import type {
	AutoFreeHint,
	ContextualHint,
	HintState,
	HintTriggerResult,
} from "../../types/hint";
import { normalizeString } from "../quiz/utils/stringManipulation";
import { isAutoFreeHint, isContextualHint } from "./validation";

export const checkForContextualHints = (
	userAnswer: string,
	question: QuestionBase,
	hintState: HintState,
): ContextualHint[] => {
	console.log("🎯 [checkForContextualHints] Input:", {
		userAnswer,
		questionId: question.id,
		hintsAvailable: !!question.hints,
		hintsCount: question.hints?.length || 0,
	});

	if (!question.hints) {
		console.log("🎯 [checkForContextualHints] No hints available for question");
		return [];
	}

	const contextualHints = question.hints.filter(isContextualHint);
	console.log(
		"🎯 [checkForContextualHints] Found contextual hints:",
		contextualHints.length,
	);

	const normalizedUserAnswer = normalizeString(userAnswer);
	console.log(
		"🎯 [checkForContextualHints] Normalized user answer:",
		normalizedUserAnswer,
	);

	const triggeredHints = contextualHints.filter((hint) => {
		console.log("🎯 [checkForContextualHints] Checking hint:", {
			hintId: hint.id,
			triggers: hint.triggers,
		});

		const triggerMatches = hint.triggers.some((trigger) => {
			const normalizedTrigger = normalizeString(trigger);
			const isMatch = normalizedUserAnswer.includes(normalizedTrigger);
			console.log("🎯 [checkForContextualHints] Trigger check:", {
				trigger,
				normalizedTrigger,
				normalizedUserAnswer,
				isMatch,
			});
			return isMatch;
		});

		console.log("🎯 [checkForContextualHints] Hint triggered:", triggerMatches);
		return triggerMatches;
	});

	console.log("🎯 [checkForContextualHints] Final triggered hints:", {
		count: triggeredHints.length,
		hintIds: triggeredHints.map((h) => h.id),
	});

	return triggeredHints;
};

export const checkForAutoFreeHints = (
	question: QuestionBase,
	hintState: HintState,
): AutoFreeHint[] => {
	console.log("🎯 [checkForAutoFreeHints] Checking auto-free hints");

	if (!question.hints) return [];

	const autoFreeHints = question.hints.filter(isAutoFreeHint);

	return autoFreeHints.filter((hint) => {
		// Prüfe ob bereits verwendet
		const alreadyUsed =
			hintState.autoFreeHintsUsed?.includes(hint.id) ||
			hintState.usedHints.some((used) => used.id === hint.id);

		if (alreadyUsed) {
			console.log(`🎯 [checkForAutoFreeHints] Hint ${hint.id} already used`);
			return false;
		}

		// Prüfe Trigger-Bedingung
		const canTrigger = hintState.wrongAttempts >= hint.triggerAfterAttempts;
		console.log(`🎯 [checkForAutoFreeHints] Hint ${hint.id} can trigger:`, {
			wrongAttempts: hintState.wrongAttempts,
			required: hint.triggerAfterAttempts,
			canTrigger,
		});

		return canTrigger;
	});
};

export const checkTriggeredHints = (
	userAnswer: string,
	question: QuestionBase,
	hintState: HintState,
): HintTriggerResult => {
	const contextualHints = checkForContextualHints(
		userAnswer,
		question,
		hintState,
	);
	const autoFreeHints = checkForAutoFreeHints(question, hintState);

	return {
		contextualHints,
		autoFreeHints,
	};
};

export const getTriggeredContent = (
	hint: ContextualHint,
	userAnswer: string,
): string => {
	if (hint.triggerSpecificContent) {
		const normalizedAnswer = normalizeString(userAnswer);
		for (const [trigger, specificContent] of Object.entries(
			hint.triggerSpecificContent,
		)) {
			if (normalizedAnswer.includes(normalizeString(trigger))) {
				return specificContent;
			}
		}
	}

	return hint.content;
};
