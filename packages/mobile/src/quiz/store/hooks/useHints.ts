import { useCallback, useMemo } from "react";
import { HintType, type PurchasableHint, type AutoFreeHint, type HintTriggerResult } from "../../types/hint";
import { useQuizStore } from "../Store";
import { isAutoFreeHint, isContextualHint } from "../../domain/hints/validation";

export const useHints = (quizId: string, questionId: number) => {
	const quizState = useQuizStore((state) => state.quizStates[quizId]);
	const globalPointsBalance = useQuizStore((state) => state.getPointsBalance());

	const question = quizState?.questions.find((q) => q.id === questionId);
	const hintState = quizState?.hintStates[questionId];

	const availableHints = useMemo(() => {
		if (!question?.hints || !hintState) return [];

		return question.hints.map((hint) => {
			const alreadyUsed = hintState.usedHints.some((h) => h.id === hint.id);

			if (alreadyUsed) {
				return { hint, canUse: false, reason: "Hint bereits verwendet" };
			}

			// Auto-Free Hints: Prüfe spezielle Bedingungen
			if (hint.type === HintType.AUTO_FREE) {
				const alreadyUsedAutoFree = hintState.autoFreeHintsUsed?.includes(
					hint.id,
				);
				if (alreadyUsedAutoFree) {
					return { hint, canUse: false, reason: "Hint bereits verwendet" };
				}

				const canUse = hintState.wrongAttempts >= hint.triggerAfterAttempts;
				return {
					hint,
					canUse,
					reason: canUse
						? undefined
						: `Erst nach ${hint.triggerAfterAttempts} falschen Versuchen`,
				};
			}

			// Contextual Hints: Können nicht direkt gekauft werden
			if (hint.type === HintType.CONTEXTUAL) {
				return {
					hint,
					canUse: false,
					reason: "Wird durch Antworten ausgelöst",
				};
			}

			// Normale bezahlte Hints
			const hasEnoughPoints = globalPointsBalance >= hint.cost;
			return {
				hint,
				canUse: hasEnoughPoints,
				reason: hasEnoughPoints ? undefined : "Nicht genug Punkte",
			};
		});
	}, [question?.hints, hintState, globalPointsBalance]);

	const { purchasableHints, autoTriggerHints } = useMemo(() => {
		const purchasable = availableHints.filter(
			(h) =>
				!isAutoFreeHint(h.hint) &&
				!isContextualHint(h.hint) &&
				h.canUse,
		) as { hint: PurchasableHint; canUse: boolean; reason: string | undefined; }[]; // Explicitly cast to the desired type;
		const autoTrigger = availableHints.filter(
			(h) =>
				(h.hint.type === HintType.CONTEXTUAL || h.hint.type === HintType.AUTO_FREE) &&
				h.canUse,
		);

		return { purchasableHints: purchasable, autoTriggerHints: autoTrigger };
	}, [availableHints]);

	const usedHints = useMemo(() => {
		return hintState?.usedHints || [];
	}, [hintState?.usedHints]);

	const hasVisibleHints = useMemo(
		() => usedHints.length > 0 || purchasableHints.length > 0,
		[usedHints.length, purchasableHints.length],
	);

	// Store-Aktionen
	const applyHint = useQuizStore((state) => state.applyHint);
	const recordWrongAnswer = useQuizStore((state) => state.recordWrongAnswer);
	const markAutoFreeHintAsUsed = useQuizStore(
		(state) => state.markAutoFreeHintAsUsed,
	);
	const markHintAsUsed = useQuizStore((state) => state.markHintAsUsed);

	const getAutoFreeHints = useCallback((): AutoFreeHint[] => {
		if (!question?.hints || !hintState) return [];

		return question.hints.filter(
			(hint): hint is AutoFreeHint =>
				hint.type === HintType.AUTO_FREE &&
				!hintState.autoFreeHintsUsed?.includes(hint.id) &&
				!hintState.usedHints.some((uh) => uh.id === hint.id) &&
				hintState.wrongAttempts >= hint.triggerAfterAttempts,
		);
	}, [question?.hints, hintState]);

	const handleUseHint = useCallback(
		async (hintId: string) => {
			return await applyHint(quizId, questionId, hintId);
		},
		[quizId, questionId, applyHint],
	);

	const handleWrongAnswer = useCallback(
		(userAnswer: string): HintTriggerResult => {
			console.log("[useHints] Processing wrong answer:", userAnswer);

			// Verwende die neue recordWrongAnswer Funktion
			const triggerResult = recordWrongAnswer(quizId, questionId, userAnswer);

			console.log("[useHints] Trigger result:", {
				contextualHints: triggerResult.contextualHints.length,
				autoFreeHints: triggerResult.autoFreeHints.length,
			});

			return triggerResult;
		},
		[quizId, questionId, recordWrongAnswer],
	);

	const markContextualHintAsShown = useCallback((hintId: string) => {
		// Contextual Hints werden NICHT als "verwendet" markiert
		// Sie können beliebig oft ausgelöst werden
		console.log(
			"[useHints] Contextual hint shown (not marking as used):",
			hintId,
		);
	}, []);

	const markAutoFreeHintAsShown = useCallback(
		(hintId: string) => {
			// Auto-Free Hints werden als verwendet markiert
			console.log("[useHints] Marking auto-free hint as used:", hintId);
			markAutoFreeHintAsUsed(quizId, questionId, hintId);
		},
		[quizId, questionId, markAutoFreeHintAsUsed],
	);

	return {
		// Daten
		availableHints,
		pointsBalance: globalPointsBalance,
		wrongAttempts: hintState?.wrongAttempts || 0,
		usedHints,
		hasVisibleHints,

		// Kategorisierte Hints
		purchasableHints,
		autoTriggerHints,

		// Aktionen
		handleUseHint,
		recordWrongAnswer: handleWrongAnswer,
		getAutoFreeHints,

		// Neue Aktionen für bessere Kontrolle
		markContextualHintAsShown,
		markAutoFreeHintAsShown,
		markHintAsUsed,
	};
};
