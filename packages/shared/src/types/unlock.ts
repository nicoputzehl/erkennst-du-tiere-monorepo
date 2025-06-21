export interface BaseUnlockCondition {
  type: string;
  description: string;
}

export interface PlaythroughCondition extends BaseUnlockCondition {
  type: "playthrough";
  requiredQuizId: string;
}

export interface ProgressCondition extends BaseUnlockCondition {
  type: "progress";
  requiredQuizId: string;
  requiredQuestionsSolved: number;
}


export type UnlockCondition = PlaythroughCondition | ProgressCondition;

export interface UnlockConditionProgress {
  condition: UnlockCondition;
  currentProgress: number;
  isMet: boolean;
}


export function isQuizPlaythroughCondition(
  condition: UnlockCondition
): condition is PlaythroughCondition {
  return condition.type === "playthrough";
}

export function isQuizProgressCondition(
  condition: UnlockCondition
): condition is ProgressCondition {
  return condition.type === "progress";
}

// export function isAnotherFutureCondition(
//   condition: UnlockCondition
// ): condition is AnotherFutureCondition {
//   return condition.type === "anotherFutureCondition";
// }