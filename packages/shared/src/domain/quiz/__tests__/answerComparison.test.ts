// answerComparison.test.ts

// Direkte Imports der Funktionen, die getestet werden
import { arePhoneticallySimilar, isAnswerCorrect } from "../answerComparison";
// KEINE jest.mock() Aufrufe mehr!

describe("arePhoneticallySimilar", () => {
	beforeEach(() => {
		// Wenn es globale Mocks gäbe, würde man sie hier zurücksetzen.
		// Aber da wir keine Mocks verwenden, ist dieser Block optional für diese Tests.
	});

	describe("input validation", () => {
		it("should return false for empty strings", () => {
			expect(arePhoneticallySimilar("", "")).toBe(false);
			expect(arePhoneticallySimilar("  ", "  ")).toBe(false);
			expect(arePhoneticallySimilar("test", "")).toBe(false);
			expect(arePhoneticallySimilar("", "test")).toBe(false);
		});

		it("should handle whitespace-only strings", () => {
			expect(arePhoneticallySimilar("   ", "test")).toBe(false);
			expect(arePhoneticallySimilar("test", "   ")).toBe(false);
		});
	});

	describe("phonetic comparison", () => {
		// Hier nutzen wir die tatsächliche Implementierung der Kölner Phonetik.
		// Die erwarteten Werte müssen genau den tatsächlichen Codes entsprechen.
		it("should return true for identical phonetic codes (real logic)", () => {
			// "Müller" und "Mueller" sollten phonetisch gleich sein: 657
			expect(arePhoneticallySimilar("Müller", "Mueller")).toBe(true);
		});

		it("should return false for different phonetic codes (real logic)", () => {
			// "Schmidt" (868) und "Meyer" (67) sollten phonetisch unterschiedlich sein
			expect(arePhoneticallySimilar("Schmidt", "Meyer")).toBe(false);
		});

		it("should return false for inputs that result in empty phonetic codes", () => {
			// Nicht-alphabetische Zeichen führen zu leeren Codes nach Phonetik-Regeln
			expect(arePhoneticallySimilar("???", "---")).toBe(false);
			expect(arePhoneticallySimilar("test1", "???")).toBe(false);
		});
	});
});

describe("isAnswerCorrect", () => {
	beforeEach(() => {
		// Keine Mocks zum zurücksetzen hier
	});

	describe("input validation", () => {
		it("should return false for null/undefined inputs", () => {
			expect(isAnswerCorrect(null as any, "correct")).toBe(false);
			expect(isAnswerCorrect("user", null as any)).toBe(false);
			expect(isAnswerCorrect(undefined as any, "correct")).toBe(false);
			expect(isAnswerCorrect("user", undefined as any)).toBe(false);
		});

		it("should return false for empty strings", () => {
			expect(isAnswerCorrect("", "correct")).toBe(false);
			expect(isAnswerCorrect("user", "")).toBe(false);
			expect(isAnswerCorrect("", "")).toBe(false);
		});
	});

	describe("exact matching after normalization", () => {
		// Hier basiert die Erwartung auf der echten normalizeString-Funktion (toLowerCase().trim())
		it("should return true for identical normalized answers", () => {
			expect(isAnswerCorrect("Test", "TEST")).toBe(true); // "test" === "test"
		});

		it("should handle case differences through normalization", () => {
			expect(isAnswerCorrect("Berlin", "BERLIN")).toBe(true); // "berlin" === "berlin"
		});

		it("should handle leading/trailing whitespace through normalization", () => {
			expect(isAnswerCorrect(" Test ", "test")).toBe(true); // "test" === "test"
		});
	});

	describe("phonetic matching", () => {
		it("should return true for phonetically similar answers", () => {
			// "Mueller" (657) und "Müller" (657) sind phonetisch gleich
			expect(isAnswerCorrect("Mueller", "Müller")).toBe(true);
		});

		it("should return false for phonetically different answers", () => {
			// "Schmidt" (868) und "Meyer" (67) sind phonetisch unterschiedlich
			expect(isAnswerCorrect("Schmidt", "Meyer")).toBe(false);
		});
	});

	describe("alternative answers", () => {
		it("should return false when no alternatives provided", () => {
			expect(isAnswerCorrect("user", "correct")).toBe(false); // Annahme: user und correct sind weder exakt noch phonetisch gleich
		});

		it("should return false for empty alternatives array", () => {
			expect(isAnswerCorrect("user", "correct", [])).toBe(false);
		});

		it("should match against normalized alternative answers", () => {
			// "Berlin" (user) vs "München" (correct) -> kein Match.
			// Aber "Berlin" (user) vs "BERLIN" (alternative) -> exakter Match nach Normalisierung
			expect(isAnswerCorrect("Berlin", "München", ["BERLIN", "Hamburg"])).toBe(
				true,
			);
		});

		it("should match against phonetically similar alternatives", () => {
			// "Mueller" (user) vs "Schmidt" (correct) -> kein Match.
			// Aber "Mueller" (user, 657) vs "Müller" (alternative, 657) -> phonetischer Match
			expect(isAnswerCorrect("Mueller", "Schmidt", ["Müller"])).toBe(true);
		});

		it("should return false when no alternative matches", () => {
			// "User" vs "Correct" -> kein Match.
			// "User" vs "Alt1" -> kein Match.
			// "User" vs "Alt2" -> kein Match.
			expect(isAnswerCorrect("User", "Correct", ["Alt1", "Alt2"])).toBe(false);
		});

		it("should check multiple alternatives and return true for first match", () => {
			// "target" vs "correct" -> kein Match.
			// "target" vs "wrong" -> kein Match.
			// "target" vs "TARGET" -> exakter Match (nach Normalisierung)
			expect(
				isAnswerCorrect("target", "correct", ["wrong", "TARGET", "other"]),
			).toBe(true);
		});
	});

	describe("integration scenarios", () => {
		it("should handle complex real-world scenario", () => {
			// User answers "Berlin", correct is "München", alternatives include "Berlin"
			expect(
				isAnswerCorrect("Berlin   ", "München", [
					"Hamburg",
					" Berlin ",
					"Dresden",
				]),
			).toBe(true); // Should match ' Berlin ' with 'Berlin   ' after normalization
		});

		it("should prioritize exact match over phonetic match", () => {
			// "test" und "TEST" sind exakt gleich nach Normalisierung, daher sollte der phonetische Vergleich nicht nötig sein
			expect(isAnswerCorrect("test", "TEST")).toBe(true);
		});
	});
});
