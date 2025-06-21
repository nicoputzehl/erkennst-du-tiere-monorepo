import type { HintState } from "@/quiz/types/hint";
import { HintUtils } from "..";
import type { QuestionBase } from "../../../types";
import { createContextualHint, createLetterCountHint } from "../factories";

describe("HintUtils.checkForContextualHints", () => {
	const mockQuestion: QuestionBase = {
		id: 1,
		answer: "Leopard",
		images: { imageUrl: 1 },
		hints: [
			createContextualHint(1, ["jaguar", "gepard"], "Richtige Richtung!"),
			createContextualHint(2, ["elefant"], "Ganz anderes Tier!"),
			createLetterCountHint(1), // Nicht-contextual hint
		],
	};

	const mockHintState: HintState = {
		questionId: 1,
		usedHints: [],
		wrongAttempts: 1,
		autoFreeHintsUsed: [],
	};

	it("should trigger contextual hint on matching answer", () => {
		const triggered = HintUtils.checkForContextualHints(
			"jaguar",
			mockQuestion,
			mockHintState,
		);

		expect(triggered).toHaveLength(1);
		expect(triggered[0].content).toBe("Richtige Richtung!");
		expect(triggered[0].triggers).toContain("jaguar");
	});

	it("should trigger multiple contextual hints if multiple match", () => {
		const questionWithMultiple: QuestionBase = {
			...mockQuestion,
			hints: [
				createContextualHint(1, ["big", "groß"], "Größe stimmt!"),
				createContextualHint(2, ["cat", "katze"], "Kategorie stimmt!"),
			],
		};

		const triggered = HintUtils.checkForContextualHints(
			"big cat",
			questionWithMultiple,
			mockHintState,
		);

		expect(triggered).toHaveLength(2);
	});

	it("should handle case-insensitive matching", () => {
		const triggered = HintUtils.checkForContextualHints(
			"JAGUAR",
			mockQuestion,
			mockHintState,
		);

		expect(triggered).toHaveLength(1);
	});

	it("should handle partial matches", () => {
		const triggered = HintUtils.checkForContextualHints(
			"ist das ein jaguar?",
			mockQuestion,
			mockHintState,
		);

		expect(triggered).toHaveLength(1);
	});

	it("should return empty array when no hints match", () => {
		const triggered = HintUtils.checkForContextualHints(
			"zebra",
			mockQuestion,
			mockHintState,
		);

		expect(triggered).toHaveLength(0);
	});
});
