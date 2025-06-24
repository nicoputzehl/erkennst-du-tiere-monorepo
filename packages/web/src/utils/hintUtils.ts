import  { HintType, type QuestionBase } from "@quiz-app/shared";


/**
 * Generates automatic hints based on hint type and question
 */
function recreateGenerator(
  hintType: HintType,
): ((question: QuestionBase) => string) {
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
}

/**
 * Creates a letter count hint for a question
 */
function createLetterCountHint(questionId: number) {
  return {
    id: `${questionId}_auto_letter_count`,
    type: 'auto_generated',
    title: 'Buchstaben-Anzahl',
    description: 'Automatisch generierter Hint für die Buchstaben-Anzahl',
    // Hier verwenden wir den direkten Funktionsaufruf anstatt eines Strings
    // Die Logik für den Generator bleibt in der Funktion recreateGenerator
    // Dieser "generator" String im Objekt war vermutlich ein Platzhalter für eine Laufzeit-Ausführung.
    // Wenn dieser String später evaluiert wird, musst du diese Zeile anpassen.
    // Ansonsten wäre es sinnvoller, hier direkt die Funktion zu referenzieren, falls möglich.
    // Für dieses Beispiel belassen wir es als String, da es so im Original war.
    generator: 'HintUtils.recreateGenerator(HintType.LETTER_COUNT)',
    triggerAfterAttempts: 0,
    content: ''
  };
}

/**
 * Creates a first letter hint for a question
 */
function createFirstLetterHint(questionId: number) {
  return {
    id: `${questionId}_auto_first_letter`,
    type: 'auto_generated',
    title: 'Erster Buchstabe',
    description: 'Automatisch generierter Hint für den ersten Buchstaben',
    generator: 'HintUtils.recreateGenerator(HintType.FIRST_LETTER)',
    triggerAfterAttempts: 0,
    content: ''
  };
}

/**
 * Generates the actual hint content for export
 */
function generateHintContent(hintType: HintType, answer: string): string {
  // `this.recreateGenerator` wird zu `recreateGenerator`
  const generator = recreateGenerator(hintType);
  return generator({ answer });
}

// Exportiere alle Funktionen in einem Konstanten-Objekt
export const HintUtils = {
  recreateGenerator,
  createLetterCountHint,
  createFirstLetterHint,
  generateHintContent,
} as const;