import { colognePhonetic, normalizeString } from "./utils/stringManipulation";

export function arePhoneticallySimilar(
	answer1: string,
	answer2: string,
): boolean {
	if (!answer1 || !answer2) {
		// Prüfe auf leere Strings VOR dem Trimmen
		return false;
	}

	const trimmedAnswer1 = answer1.trim();
	const trimmedAnswer2 = answer2.trim();

	if (!trimmedAnswer1 || !trimmedAnswer2) {
		// Nach dem Trimmen prüfen
		return false;
	}

	const phonetic1 = colognePhonetic(trimmedAnswer1);
	const phonetic2 = colognePhonetic(trimmedAnswer2);

	// Beide müssen einen Code haben und gleich sein
	return (
		phonetic1.length > 0 && phonetic2.length > 0 && phonetic1 === phonetic2
	);
}

export const isAnswerCorrect = (
	userAnswer: string,
	correctAnswer: string,
	alternativeAnswers?: string[],
): boolean => {
	if (!userAnswer || !correctAnswer) {
		// Basic null/undefined/empty check
		return false;
	}

	const normalizedUserAnswer = normalizeString(userAnswer);
	const normalizedCorrectAnswer = normalizeString(correctAnswer);

	// 1. Exakter, normalisierter Vergleich
	if (normalizedUserAnswer === normalizedCorrectAnswer) {
		return true;
	}

	// 2. Phonetischer Vergleich mit der korrekten Antwort
	if (arePhoneticallySimilar(userAnswer, correctAnswer)) {
		return true;
	}

	// 3. Alternative Antworten prüfen (falls vorhanden)
	if (alternativeAnswers?.length) {
		for (const alt of alternativeAnswers) {
			if (!alt) continue; // Leere alternative Antworten überspringen
			const normalizedAlt = normalizeString(alt);

			if (
				normalizedAlt === normalizedUserAnswer ||
				arePhoneticallySimilar(alt, userAnswer)
			) {
				return true;
			}
		}
	}

	return false;
};
