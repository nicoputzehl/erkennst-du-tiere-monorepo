import { useCallback, useState } from "react";
import type { WrongAnswerHint } from "../Question.types";

export const useResultState = () => {
	const [showResult, setShowResult] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [statusChanged, setStatusChanged] = useState(false);
	const [hint, setHint] = useState<WrongAnswerHint | undefined>(undefined);
	const [showHint, setShowHint] = useState(false);

	const handleShowHint = (hint: WrongAnswerHint) => {
		setHint(hint);
		setShowHint(true);
	};

	const resetResult = useCallback(() => {
		setShowResult(false);
		setStatusChanged(false);
		setHint(undefined);
		setShowHint(false);
	}, []);

	return {
		showResult,
		setShowResult,
		isCorrect,
		setIsCorrect,
		statusChanged,
		setStatusChanged,
		hint,
		setHint,
		resetResult,
		showHint,
		handleShowHint,
	};
};
