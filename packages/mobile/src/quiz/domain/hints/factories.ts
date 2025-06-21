import {
	type AutoFreeHint,
	type ContextualHint,
	type DynamicHint,
	HintType,
	type StaticHint,
} from "../../types/hint";
import type { QuestionBase } from "../../types/question";

console.log("🏭 [Factories] File loading...");

/**
 * Erstellt einen Buchstabenanzahl-Hint
 * Kosten: 5 Punkte
 */
export const createLetterCountHint = (questionId: number): DynamicHint => {
	console.log(
		"🏭 [createLetterCountHint] Creating hint for question:",
		questionId,
	);

	const generator = (question: QuestionBase) => {
		console.log("🏭 [generator] Generating letter count for:", question.answer);
		return `Das gesuchte Tier hat ${question.answer.length} Buchstaben`;
	};

	const hint: DynamicHint = {
		id: `${questionId}_letter_count`,
		type: HintType.LETTER_COUNT,
		cost: 5,
		title: "Buchstabenanzahl",
		description: "Zeigt die Anzahl der Buchstaben",
		generator,
	};

	console.log("🏭 [createLetterCountHint] Created hint:", {
		id: hint.id,
		hasGenerator: typeof hint.generator === "function",
		generatorString: `${hint.generator.toString().substring(0, 50)}...`,
	});

	return hint;
};

/**
 * Erstellt einen Erster-Buchstabe-Hint
 * Kosten: 10 Punkte
 */
export const createFirstLetterHint = (questionId: number): DynamicHint => {
	console.log(
		"🏭 [createFirstLetterHint] Creating hint for question:",
		questionId,
	);

	const generator = (question: QuestionBase) => {
		console.log("🏭 [generator] Generating first letter for:", question.answer);
		return `Das gesuchte Tier beginnt mit "${question.answer[0].toUpperCase()}"`;
	};

	const hint: DynamicHint = {
		id: `${questionId}_first_letter`,
		type: HintType.FIRST_LETTER,
		cost: 10,
		title: "Erster Buchstabe",
		description: "Zeigt den ersten Buchstaben",
		generator,
	};

	console.log("🏭 [createFirstLetterHint] Created hint:", {
		id: hint.id,
		hasGenerator: typeof hint.generator === "function",
	});

	return hint;
};

/**
 * Erstellt einen benutzerdefinierten Hint
 * @param questionId - ID der Frage
 * @param title - Titel des Hints (z.B. "Lebensraum")
 * @param content - Inhalt des Hints
 * @param cost - Kosten in Punkten (empfohlen: 8-15)
 */
export const createCustomHint = (
	questionId: number,
	title: string,
	content: string,
	cost: number,
): StaticHint => {
	console.log("🏭 [createCustomHint] Creating custom hint:", {
		questionId,
		title,
		cost,
	});

	return {
		id: `${questionId}_custom_${title.toLowerCase().replace(/\s+/g, "_")}`,
		type: HintType.CUSTOM,
		cost,
		title,
		description: `Individueller Hinweis: ${title}`,
		content,
	};
};

/**
 * Erstellt einen kontextuellen Hint (reagiert auf bestimmte Antworten)
 * @param questionId - ID der Frage
 * @param triggers - Antworten die diesen Hint auslösen
 * @param content - Hint-Inhalt
 * @param cost - Kosten (Standard: 0 = kostenlos)
 */
export const createContextualHint = (
	questionId: number,
	triggers: string[],
	content: string,
	optional?: {
		title?: string;
	}
): ContextualHint => {
	const title = optional?.title ?? "Knapp daneben";
	console.log("🏭 [createContextualHint] Creating contextual hint:", {
		questionId,
		triggers,
		title,
	});

	return {
		id: `${questionId}_contextual_${triggers[0].toLowerCase().replace(/\s+/g, "_")}`,
		type: HintType.CONTEXTUAL,
		title,
		description: "Wird bei bestimmten Antworten ausgelöst",
		triggers,
		content,
	};
};

/**
 * Erstellt einen automatisch kostenlosen Hint nach X falschen Versuchen
 * @param questionId - ID der Frage
 * @param content - Hint-Inhalt
 * @param triggerAfterAttempts - Anzahl falsche Versuche (Standard: 5)
 */
export const createAutoFreeHint = (
	questionId: number,
	content: string,
	triggerAfterAttempts = 5,
	title = "Kleiner Tipp",
): AutoFreeHint => {
	console.log("🏭 [createAutoFreeHint] Creating auto-free hint:", {
		questionId,
		triggerAfterAttempts,
	});

	return {
		id: `${questionId}_auto_free`,
		type: HintType.AUTO_FREE,
		title,
		description: `Wird nach ${triggerAfterAttempts} falschen Versuchen freigeschaltet`,
		triggerAfterAttempts,
		content,
	};
};

/**
 * Erstellt Escalating Auto-Free Hint mit mehreren Stufen
 * @param questionId - ID der Frage
 * @param contents - Array von Hint-Inhalten (von vage zu spezifisch)
 * @param triggerAfterAttempts - Anzahl falsche Versuche für ersten Hint
 */
export const createEscalatingAutoFreeHint = (
	questionId: number,
	contents: string[],
	triggerAfterAttempts = 5,
): AutoFreeHint => {
	console.log("🏭 [createEscalatingAutoFreeHint] Creating escalating hint:", {
		questionId,
		triggerAfterAttempts,
	});

	return {
		id: `${questionId}_escalating_free`,
		type: HintType.AUTO_FREE,
		title: "Erweiterte Hilfe",
		description: "Zusätzliche Hinweise nach vielen Versuchen",
		triggerAfterAttempts,
		content: contents[0],
		escalatingContent: contents,
	};
};
