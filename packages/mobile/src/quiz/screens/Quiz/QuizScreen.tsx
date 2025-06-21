import { ErrorComponent } from "@/common/components/ErrorComponent";
import Header from "@/common/components/Header";
import { LoadingComponent } from "@/common/components/LoadingComponent";
import { ThemedView } from "@/common/components/ThemedView";
import { QuizProgress } from "@/quiz/screens/Quiz/components/QuizProgress";
import type React from "react";
import { StyleSheet, View } from "react-native";
import { QuestionGrid } from "./components/QuestionGrid";
import { QUIZ_LAYOUT } from "./constants/constants";
import { useQuizScreen } from "./hooks/useQuizScreen";
import { calculateItemWidth } from "./utils/utils";

interface QuizScreenProps {
	quizId: string | null;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ quizId }) => {
	const {
		quizState,
		isLoading,
		error,
		handleQuestionClick,
		getQuizProgress,
		navigateBack,
	} = useQuizScreen(quizId);
	const itemWidth = calculateItemWidth();

	if (isLoading) return <LoadingComponent message="Quiz wird geladen..." />;
	if (error || !quizState)
		return <ErrorComponent message={error || "Quiz nicht gefunden"} />;

	return (
		<ThemedView style={styles.container} gradientType="primary">
			<Header
				showBackButton
				onBackPress={navigateBack}
				title={quizState.title}
			/>
			<View style={styles.scrollContent}>
				<QuestionGrid
					questions={quizState.questions}
					itemWidth={itemWidth}
					onQuestionClick={handleQuestionClick}
				/>
			</View>
			<QuizProgress
				completed={quizState.completedQuestions}
				total={quizState.questions.length}
				progress={getQuizProgress(quizState.id)}
			/>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: QUIZ_LAYOUT.padding,
	},
	scrollContent: {
		flex: 1,
		padding: QUIZ_LAYOUT.padding,
		justifyContent: "center",
	},
});
