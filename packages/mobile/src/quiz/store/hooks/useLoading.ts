import { useMemo } from "react";
import { useQuizStore } from "../Store";

/**
 * Loading hook for specific operations
 */
export function useLoading(operationName?: string) {
	const setLoading = useQuizStore((state) => state.setLoading);
	const isOperationLoading = useQuizStore((state) =>
		operationName
			? state.loadingOperations.has(operationName)
			: state.isLoading,
	);

	const startLoading = useMemo(
		() => () => setLoading(operationName || "global", true),
		[setLoading, operationName],
	);
	const stopLoading = useMemo(
		() => () => setLoading(operationName || "global", false),
		[setLoading, operationName],
	);

	return {
		isLoading: isOperationLoading,
		startLoading,
		stopLoading,
	};
}
