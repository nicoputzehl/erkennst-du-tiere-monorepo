import type { QuestionBase } from "../../types";
import type { PointTransaction, UserPointsState } from "../../types/hint";

export const calculatePointsForCorrectAnswer = (
	question: QuestionBase,
): number => {
	const basePoints = 10;
	const hintBonus = question.hints?.length ? question.hints.length * 2 : 0;
	return basePoints + hintBonus;
};

export const createPointTransaction = (
	type: "earned" | "spent",
	amount: number,
	reason: string,
	quizId?: string,
	questionId?: number,
	hintId?: string,
): PointTransaction => {
	return {
		id: `${Date.now()}_${Math.random()}`,
		type,
		amount,
		reason,
		timestamp: Date.now(),
		quizId,
		questionId,
		hintId,
	};
};

export const getInitialUserPoints = (): UserPointsState => ({
	totalPoints: 50, // Startpunkte
	earnedPoints: 50,
	spentPoints: 0,
	pointsHistory: [createPointTransaction("earned", 50, "Startguthaben")],
});
