import {
	type AutoFreeHint,
	type ContextualHint,
	type DynamicHint,
	type Hint,
	type HintState,
	HintType,
	type StaticHint,
	type UserPointsState,
} from "../../types/hint";

export const canUseHint = (
	hint: Hint,
	hintState: HintState,
	globalUserPoints: UserPointsState, // ← Jetzt global
): { canUse: boolean; reason?: string } => {
	// Bereits verwendet?
	if (hintState.usedHints.some((h) => h.id === hint.id)) {
		return { canUse: false, reason: "Hint bereits verwendet" };
	}

	if (isAutoFreeHint(hint)) {
		// Auto-Free Hints: Prüfe ob bereits verwendet
		if (hintState.autoFreeHintsUsed?.includes(hint.id)) {
			return { canUse: false, reason: "Hint bereits verwendet" };
		}

		// Prüfe Trigger-Bedingung
		if (hintState.wrongAttempts < hint.triggerAfterAttempts) {
			return {
				canUse: false,
				reason: `Erst nach ${hint.triggerAfterAttempts} falschen Versuchen`,
			};
		}
		return { canUse: true };
	}

	if (isContextualHint(hint)) {
		return { canUse: false, reason: "Wird durch Antworten ausgelöst" };
	}

	if (hintState.usedHints.some((h) => h.id === hint.id)) {
		return { canUse: false, reason: "Hint bereits verwendet" };
	}

	// Standard Punkte-Check (global)
	if (globalUserPoints.totalPoints < hint.cost) {
		return { canUse: false, reason: "Nicht genug Punkte" };
	}

	return { canUse: true };
};

export const canTriggerContextualHint = (
	hint: ContextualHint,
	userAnswer: string,
): boolean => {
	if (!isContextualHint(hint)) return false;

	const normalizedAnswer = userAnswer.toLowerCase().trim();
	return hint.triggers.some((trigger) =>
		normalizedAnswer.includes(trigger.toLowerCase().trim()),
	);
};

// ==========================================
// TYPE GUARDS - für sichere Type-Unterscheidung
// ==========================================

export const isStaticHint = (hint: Hint): hint is StaticHint => {
	return [HintType.CUSTOM, HintType.CATEGORY, HintType.REGION].includes(
		hint.type,
	);
};

export const isDynamicHint = (hint: Hint): hint is DynamicHint => {
	return [HintType.LETTER_COUNT, HintType.FIRST_LETTER].includes(hint.type);
};

export const isContextualHint = (hint: Hint): hint is ContextualHint => {
	return hint.type === HintType.CONTEXTUAL;
};

export const isAutoFreeHint = (hint: Hint): hint is AutoFreeHint => {
	return hint.type === HintType.AUTO_FREE;
};
