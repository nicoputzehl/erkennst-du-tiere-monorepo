import type { QuestionBase } from "../../types";
import { type Hint, HintType } from "../../types/hint";
import {
	isAutoFreeHint,
	isContextualHint,
	isDynamicHint,
	isStaticHint,
} from "./validation";

/**
 * Rekonstruiert Generator-Funktionen für dynamische Hints
 * Diese Funktionen gehen bei Serialisierung verloren und müssen zur Laufzeit wiederhergestellt werden
 */
const recreateGenerator = (
	hintType: HintType,
): ((question: QuestionBase) => string) => {
	switch (hintType) {
		case HintType.LETTER_COUNT:
			return (question: QuestionBase) =>
				`Das gesuchte Tier hat ${question.answer.length} Buchstaben`;

		case HintType.FIRST_LETTER:
			return (question: QuestionBase) =>
				`Das gesuchte Tier beginnt mit "${question.answer[0].toUpperCase()}"`;

		default:
			return () => "Hint nicht verfügbar";
	}
};

export const generateHintContent = (
	hint: Hint,
	question: QuestionBase,
): string => {
	console.log("🔧 [generateHintContent] Processing hint:", {
		hintId: hint.id,
		hintType: hint.type,
		hasGenerator:
			"generator" in hint && typeof (hint as any).generator === "function",
		questionAnswer: question.answer,
	});

	if (isDynamicHint(hint)) {
		// Prüfe ob Generator-Funktion vorhanden ist
		if (typeof (hint as any).generator === "function") {
			console.log("🔧 [generateHintContent] Using existing generator");
			return (hint as any).generator(question);
		}
		// Generator-Funktion wurde durch Serialisierung verloren - rekonstruiere sie
		console.log(
			"🔧 [generateHintContent] Recreating generator for type:",
			hint.type,
		);
		const recreatedGenerator = recreateGenerator(hint.type);
		return recreatedGenerator(question);
	}

	if (isStaticHint(hint)) {
		console.log("🔧 [generateHintContent] Using static content");
		return hint.content;
	}

	if (isContextualHint(hint)) {
		console.log("🔧 [generateHintContent] Using contextual content");
		return hint.content;
	}

	if (isAutoFreeHint(hint)) {
		console.log("🔧 [generateHintContent] Using auto-free content");
		if (hint.escalatingContent) {
			// Needs access to wrong attempts - passed separately
			return hint.content; // Fallback for now
		}
		return hint.content;
	}

	console.warn(
		"🔧 [generateHintContent] Unknown hint type, returning fallback",
	);
	return "Hint nicht verfügbar";
};
