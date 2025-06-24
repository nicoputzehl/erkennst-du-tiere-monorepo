
import { HintUtils } from "..";
import type { QuestionBase, HintState, UserPointsState } from "../../../types";
import {
	createAutoFreeHint,
	createContextualHint,
	createFirstLetterHint,
	createLetterCountHint,
} from "../factories";

describe("Hint System Integration", () => {
	const mockQuestion: QuestionBase = {
		id: 1,
		answer: "Leopard",
		images: { imageUrl: 1 },
		hints: [
			createLetterCountHint(1),
			createFirstLetterHint(1),
			createContextualHint(
				1,
				["jaguar"],
				"Fast richtig! Aber diese Katze hat Rosetten.",
			),
			createAutoFreeHint(
				1,
				"Diese Großkatze ist bekannt für ihre Kletterfähigkeiten.",
			),
		],
	};

	const mockHintState: HintState = {
		questionId: 1,
		usedHints: [],
		wrongAttempts: 0,
		autoFreeHintsUsed: [],
	};

	const mockUserPoints: UserPointsState = {
		totalPoints: 50,
		earnedPoints: 50,
		spentPoints: 0,
		pointsHistory: [],
	};

	it("should handle complete hint workflow", () => {
		// 1. Check available hints initially
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		let availableHints = mockQuestion.hints!.map((hint) => {
			const validation = HintUtils.canUseHint(
				hint,
				mockHintState,
				mockUserPoints,
			);
			return { hint, canUse: validation.canUse, reason: validation.reason };
		});

		expect(availableHints.filter((h) => h.canUse)).toHaveLength(2); // Letter count + first letter

		// 2. User makes wrong answer -> trigger contextual hint
		let currentHintState = { ...mockHintState, wrongAttempts: 1 };
		const triggeredHints = HintUtils.checkForContextualHints(
			"jaguar",
			mockQuestion,
			currentHintState,
		);

		expect(triggeredHints).toHaveLength(1);


		// 4. Check available hints after trigger
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		availableHints = mockQuestion.hints!.map((hint) => {
			const validation = HintUtils.canUseHint(
				hint,
				currentHintState,
				mockUserPoints,
			);
			return { hint, canUse: validation.canUse, reason: validation.reason };
		});

		expect(availableHints.filter((h) => h.canUse)).toHaveLength(2);

		// 5. User makes more wrong answers -> auto-free hint becomes available
		currentHintState = { ...currentHintState, wrongAttempts: 5 };

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		availableHints = mockQuestion.hints!.map((hint) => {
			const validation = HintUtils.canUseHint(
				hint,
				currentHintState,
				mockUserPoints,
			);
			return { hint, canUse: validation.canUse, reason: validation.reason };
		});

		expect(availableHints.filter((h) => h.canUse)).toHaveLength(3);
	});

	it("should calculate points correctly for complex questions", () => {
		const points = HintUtils.calculatePointsForCorrectAnswer(mockQuestion);

		expect(points).toBe(18); // 10 base + (4 hints * 2) bonus
	});
});
