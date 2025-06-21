import { memo } from "react";
import { View } from "react-native";

import { styles } from "../../QuizCard.styles";
import type { QuizCardViewProps } from "../../QuizCard.types";
import { CardImage } from "./CardImage";
import { LockIcon } from "./LockIcon";

export const StartItem = memo(
	({ variant, quiz }: Pick<QuizCardViewProps, "variant" | "quiz">) => {
		if (variant === "locked") {
			return (
				<View style={styles.quizCardStartItem}>
					<LockIcon />
				</View>
			);
		}
		return (
			<View style={styles.quizCardStartItem}>
				<CardImage quiz={quiz} />
			</View>
		);
	},
);
StartItem.displayName = "QuizCardStartItem";
