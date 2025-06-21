import { ThemedView } from "@/common/components/ThemedView";
import { QuizScreen } from "@/quiz/screens/Quiz/QuizScreen";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function QuizRoute() {
	const { quizId } = useLocalSearchParams<{ quizId: string }>();
	const [isParsingParams, setIsParsingParams] = useState(true);

	useEffect(() => {
		// Einfacher Effekt, um den Initialzustand zu überbrücken
		setIsParsingParams(false);
	}, []);

	if (isParsingParams) {
		return (
			<ThemedView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#0a7ea4" />
			</ThemedView>
		);
	}

	return <QuizScreen quizId={quizId || null} />;
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
