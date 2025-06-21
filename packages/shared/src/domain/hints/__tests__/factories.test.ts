
import { HintType, QuestionBase } from "@quiz-app/shared";
import {
	createAutoFreeHint,
	createContextualHint,
	createLetterCountHint,
} from "../factories";

describe("Hint Factory Functions", () => {
	describe("createLetterCountHint", () => {
		it("should create letter count hint with correct properties", () => {
			const hint = createLetterCountHint(42);

			expect(hint.id).toBe("42_letter_count");
			expect(hint.type).toBe(HintType.LETTER_COUNT);
			expect(hint.cost).toBe(5);
			expect(hint.title).toBe("Buchstabenanzahl");
			expect(hint.generator).toBeDefined();
		});

		it("should generate correct content", () => {
			const hint = createLetterCountHint(1);
			const question: QuestionBase = {
				id: 1,
				answer: "Test",
				images: { imageUrl: 1 },
			};

			const content = hint.generator(question);

			expect(content).toBe("Das gesuchte Tier hat 4 Buchstaben");
		});
	});

	describe("createContextualHint", () => {
		it("should create contextual hint with triggers", () => {
			const hint = createContextualHint(
				1,
				["jaguar", "leopard"],
				"Fast richtig!",
			);

			expect(hint.type).toBe(HintType.CONTEXTUAL);
			expect(hint.triggers).toEqual(["jaguar", "leopard"]);
			expect(hint.content).toBe("Fast richtig!");
		});
	});

	describe("createAutoFreeHint", () => {
		it("should create auto-free hint with trigger attempts", () => {
			const hint = createAutoFreeHint(1, "Free hint!", 3);

			expect(hint.type).toBe(HintType.AUTO_FREE);
			expect(hint.triggerAfterAttempts).toBe(3);
			expect(hint.content).toBe("Free hint!");
		});

		it("should default to 5 trigger attempts", () => {
			const hint = createAutoFreeHint(1, "content");

			expect(hint.triggerAfterAttempts).toBe(5);
		});
	});
});
