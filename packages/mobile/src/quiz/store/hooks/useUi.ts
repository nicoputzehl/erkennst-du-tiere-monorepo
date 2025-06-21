import { useMemo } from "react";
import { useQuizStore } from "../Store";

/**
 * UI state hook - replaces UIStateProvider
 */
export function useUI() {
	const toast = useQuizStore((state) => state.toast);
	const isLoading = useQuizStore((state) => state.isLoading);
	const navigationHistory = useQuizStore((state) => state.navigationHistory);
	const pendingUnlocks = useQuizStore((state) => state.pendingUnlocks);

	const setLoading = useQuizStore((state) => state.setLoading);
	const showToast = useQuizStore((state) => state.showToast);
	const hideToast = useQuizStore((state) => state.hideToast);
	const addPendingUnlock = useQuizStore((state) => state.addPendingUnlock);

	// Convenience methods
	const showSuccess = useMemo(
		() => (message: string, duration?: number) =>
			showToast(message, "success", duration),
		[showToast],
	);
	const showError = useMemo(
		() => (message: string, duration?: number) =>
			showToast(message, "error", duration),
		[showToast],
	);
	const showInfo = useMemo(
		() => (message: string, duration?: number) =>
			showToast(message, "info", duration),
		[showToast],
	);
	const showWarning = useMemo(
		() => (message: string, duration?: number) =>
			showToast(message, "warning", duration),
		[showToast],
	);

	const getPendingUnlocksCount = useMemo(
		() => () => pendingUnlocks.filter((unlock) => !unlock.shown).length,
		[pendingUnlocks],
	);

	const checkPendingUnlocks = useMemo(
		() => () => {
			const unshown = pendingUnlocks.filter((unlock) => !unlock.shown);

			if (unshown.length > 0) {
				console.log(
					`[useUI] Found ${unshown.length} unshown unlock notifications`,
				);

				useQuizStore.setState((state) => ({
					pendingUnlocks: state.pendingUnlocks.map((unlock) =>
						unshown.includes(unlock) ? { ...unlock, shown: true } : unlock,
					),
				}));

				unshown.forEach((unlock, index) => {
					setTimeout(
						() => {
							showSuccess(
								`🎉 "${unlock.quizTitle}" ist jetzt verfügbar!`,
								3000,
							);
						},
						300 + index * 500,
					);
				});
			}
		},
		[pendingUnlocks, showSuccess],
	);

	return {
		// State
		toast,
		isLoading,
		navigationHistory,
		pendingUnlocks,

		// Actions
		setLoading,
		showToast,
		hideToast,
		showSuccess,
		showError,
		showInfo,
		showWarning,
		addPendingUnlock,

		// Pending unlocks
		getPendingUnlocksCount,
		checkPendingUnlocks,
	};
}
