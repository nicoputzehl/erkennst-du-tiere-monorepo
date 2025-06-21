import { useMemo } from "react";
import { useQuizStore } from "../Store";

/**
 * Hook for unlock detection - simplified
 */
export function useUnlockDetection() {
	const detectMissedUnlocks = useQuizStore(
		(state) => state.detectMissedUnlocks,
	);

	useMemo(() => {
		const timer = setTimeout(() => {
			detectMissedUnlocks();
		}, 100);

		return () => clearTimeout(timer);
	}, [detectMissedUnlocks]);

	return {
		detectMissedUnlocks,
	};
}
