import type { ViewStyle } from "react-native";

import { styles } from "./QuizCard.styles";
import type { QuizCardVariant } from "./QuizCard.types";

type GetCardStyleOptions = {
	variant: QuizCardVariant;
	isLoading: boolean;
};

export const getQuizCardStyles = ({
	variant,
	isLoading,
}: GetCardStyleOptions): ViewStyle[] => {
	const baseStyle: ViewStyle[] = [styles.quizCardOuter];

	if (variant === "locked") {
		baseStyle.push(styles.locked);
	} else {
		if (isLoading) baseStyle.push(styles.loadingCard);
	}
	return baseStyle;
};
