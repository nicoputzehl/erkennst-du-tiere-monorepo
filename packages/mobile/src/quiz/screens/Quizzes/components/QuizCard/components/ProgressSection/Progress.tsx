import React, { memo } from "react";
import { View } from "react-native";

import { ThemedText } from "@/common/components/ThemedText";
import { ProgressIndicator } from "@/quiz/components/ProgressIndicator";
import { styles } from "../../QuizCard.styles";
import type { QuizCardActiveProps } from "../../QuizCard.types";

type QuizCardProgressProps = Pick<
	QuizCardActiveProps,
	"quizCardProgress" | "quizCardProgressString"
>;

export const Progress = memo(
	({ quizCardProgress, quizCardProgressString }: QuizCardProgressProps) => {
		if (!quizCardProgress) return null;
		return (
			<View style={styles.progressContainer}>
				<View style={styles.progressIndicatorContainer}>
					<ProgressIndicator progress={quizCardProgress} />
				</View>
				<ThemedText style={[styles.progressText]}>
					{quizCardProgressString}
				</ThemedText>
			</View>
		);
	},
);

Progress.displayName = "QuizCardProgress";
