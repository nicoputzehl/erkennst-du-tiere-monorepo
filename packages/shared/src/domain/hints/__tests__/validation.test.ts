
import { HintUtils } from "..";
import { type HintState, type UserPointsState, type Question, QuestionStatus } from "../../../types";
import {
	createContextualHint,
	createFirstLetterHint,
	createLetterCountHint,
} from "../factories";

describe("HintUtils", () => {
	describe("canUseHint", () => {
		it("should allow using hint with sufficient points", () => {
			const hint = createLetterCountHint(1);
			const hintState: HintState = {
				questionId: 1,
				usedHints: [],
				wrongAttempts: 0,
				autoFreeHintsUsed: [],
			};
			const userPoints: UserPointsState = {
				totalPoints: 50,
				earnedPoints: 50,
				spentPoints: 0,
				pointsHistory: [],
			};

			const result = HintUtils.canUseHint(hint, hintState, userPoints);
			expect(result.canUse).toBe(true);
		});

		it("should prevent using hint with insufficient points", () => {
			const hint = createFirstLetterHint(1);
			const hintState: HintState = {
				questionId: 1,
				usedHints: [],
				wrongAttempts: 0,
				autoFreeHintsUsed: [],
			};
			const userPoints: UserPointsState = {
				totalPoints: 5, // Nicht genug für 10 Punkte Hint
				earnedPoints: 5,
				spentPoints: 0,
				pointsHistory: [],
			};

			const result = HintUtils.canUseHint(hint, hintState, userPoints);
			expect(result.canUse).toBe(false);
			expect(result.reason).toBe("Nicht genug Punkte");
		});
	});

	describe("generateHintContent", () => {
		it("should generate letter count hint", () => {
			const hint = createLetterCountHint(1);
			const question: Question = {
				id: 1,
				answer: "Leopard",
				images: { imageUrl: 1 },
				status: QuestionStatus.ACTIVE,
			};

			const content = HintUtils.generateHintContent(hint, question);
			expect(content).toBe("Das gesuchte Tier hat 7 Buchstaben");
		});
	});

	describe("checkForContextualHints", () => {
		it("should trigger contextual hint on matching answer", () => {
			const question: Question = {
				id: 1,
				answer: "Leopard",
				images: { imageUrl: 1 },
				status: QuestionStatus.ACTIVE,
				hints: [createContextualHint(1, ["jaguar"], "Fast richtig!")],
			};
			const hintState: HintState = {
				questionId: 1,
				usedHints: [],
				wrongAttempts: 1,
				autoFreeHintsUsed: [],
			};

			const triggered = HintUtils.checkForContextualHints(
				"jaguar",
				question,
				hintState,
			);
			expect(triggered).toHaveLength(1);
			expect(triggered[0].content).toBe("Fast richtig!");
		});
	});
});
