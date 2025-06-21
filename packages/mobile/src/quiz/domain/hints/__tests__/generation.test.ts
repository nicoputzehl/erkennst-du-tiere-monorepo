import type { QuestionBase } from "@/quiz/types/question";
import { HintUtils } from "..";
import {
	createContextualHint,
	createCustomHint,
	createFirstLetterHint,
	createLetterCountHint,
} from "../factories";

describe("HintUtils.generateHintContent", () => {
	const mockQuestion: QuestionBase = {
		id: 1,
		answer: "Leopard",
		images: { imageUrl: 1 },
		hints: [],
	};

	it("should generate letter count hint", () => {
		const hint = createLetterCountHint(1);

		const content = HintUtils.generateHintContent(hint, mockQuestion);

		expect(content).toBe("Das gesuchte Tier hat 7 Buchstaben");
	});

	it("should generate first letter hint", () => {
		const hint = createFirstLetterHint(1);

		const content = HintUtils.generateHintContent(hint, mockQuestion);

		expect(content).toBe('Das gesuchte Tier beginnt mit "L"');
	});

	it("should return static content for custom hints", () => {
		const hint = createCustomHint(1, "Lebensraum", "Lebt in der Savanne", 15);

		const content = HintUtils.generateHintContent(hint, mockQuestion);

		expect(content).toBe("Lebt in der Savanne");
	});

	it("should return contextual hint content", () => {
		const hint = createContextualHint(1, ["jaguar"], "Fast richtig!");

		const content = HintUtils.generateHintContent(hint, mockQuestion);

		expect(content).toBe("Fast richtig!");
	});
});
