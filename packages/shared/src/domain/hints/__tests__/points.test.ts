import type { QuestionBase } from "@/quiz/types";
import { HintUtils } from "..";
import {
	createCustomHint,
	createFirstLetterHint,
	createLetterCountHint,
} from "../factories";

describe("HintUtils.calculatePointsForCorrectAnswer", () => {
	it("should calculate base points for question without hints", () => {
		const question: QuestionBase = {
			id: 1,
			answer: "Leopard",
			images: { imageUrl: 1 },
		};

		const points = HintUtils.calculatePointsForCorrectAnswer(question);

		expect(points).toBe(10); // Base points
	});

	it("should add bonus points for questions with hints", () => {
		const question: QuestionBase = {
			id: 1,
			answer: "Leopard",
			images: { imageUrl: 1 },
			hints: [
				createLetterCountHint(1),
				createFirstLetterHint(1),
				createCustomHint(1, "Test", "Test", 10),
			],
		};

		const points = HintUtils.calculatePointsForCorrectAnswer(question);

		expect(points).toBe(16); // 10 base + (3 hints * 2) bonus
	});
});

describe("HintUtils.createPointTransaction", () => {
	it("should create earned point transaction", () => {
		const transaction = HintUtils.createPointTransaction(
			"earned",
			15,
			"Frage korrekt beantwortet",
			"quiz1",
			1,
		);

		expect(transaction.type).toBe("earned");
		expect(transaction.amount).toBe(15);
		expect(transaction.reason).toBe("Frage korrekt beantwortet");
		expect(transaction.quizId).toBe("quiz1");
		expect(transaction.questionId).toBe(1);
		expect(transaction.id).toBeDefined();
		expect(transaction.timestamp).toBeDefined();
	});

	it("should create spent point transaction with hint", () => {
		const transaction = HintUtils.createPointTransaction(
			"spent",
			10,
			"Hint verwendet",
			"quiz1",
			1,
			"hint_123",
		);

		expect(transaction.type).toBe("spent");
		expect(transaction.amount).toBe(10);
		expect(transaction.hintId).toBe("hint_123");
	});
});
