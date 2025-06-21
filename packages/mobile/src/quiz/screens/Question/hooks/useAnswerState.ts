import { useCallback, useState } from "react";

export const useAnswerState = () => {
	const [answer, setAnswer] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submittedAnswer, setSubmittedAnswer] = useState<boolean>(false);

	const resetSubmittedAnswer = useCallback(() => {
		setSubmittedAnswer(false);
	}, []);

	const handleChangeAnswer = useCallback(
		(answer: string) => {
			setAnswer(answer);
			resetSubmittedAnswer();
		},
		[resetSubmittedAnswer],
	);

	const clearAnswer = useCallback(() => {
		setAnswer("");
		resetSubmittedAnswer();
	}, [resetSubmittedAnswer]);

	return {
		answer,
		handleChangeAnswer,
		isSubmitting,
		setIsSubmitting,
		clearAnswer,
		submittedAnswer,
		setSubmittedAnswer,
	};
};
