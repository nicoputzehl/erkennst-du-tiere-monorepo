import { ErrorComponent } from "@/common/components/ErrorComponent";
import Header from "@/common/components/Header";
import { LoadingComponent } from "@/common/components/LoadingComponent";
import { ThemedView } from "@/common/components/ThemedView";
import { useThemeColor } from "@/common/hooks/useThemeColor";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Hint from "./components/Hint";
import { QuestionContentContainer } from "./components/QuestionContentContainer";
import { QuestionInput } from "./components/QuestionInput";
import ResultReaction from "./components/ResultReaction";
import Solved from "./components/Solved";
import { useQuestionScreen } from "./hooks/useQuestionScreen";

export interface QuestionScreenProps {
	quizId: string | null;
	questionId: string | null;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
	quizId,
	questionId,
}) => {
	const {
		quizState,
		question,
		answer,
		handleChangeAnswer,
		isSubmitting,
		showResult,
		isCorrect,
		statusChanged,
		isSolved,
		handleSubmit,
		handleBack,
		// TODO Hints noch entfernen
		hint,
		hasVisibleHints,
		clearAnswer,
		showInput,
		headerText,
		resetResult,
		showHint,
		navigateToHintsModal,
		showResultReaction,
	} = useQuestionScreen(quizId || "", questionId || "");

	const iconColor = useThemeColor({}, "tintOnGradient");

	// TODO auf anderen Komponente außerhalb des Views
	const headerActions = useMemo(() => {
		const actions = [];

		if (hasVisibleHints) {
			actions.push({
				key: "hints",
				icon: <FontAwesome6 name="lightbulb" size={24} color="gold" />,
				onPress: navigateToHintsModal,
				accessibilityHint: "Öffnet die Seite mit den Hinweisen",
			});
		}

		actions.push({
			key: "close",
			icon: <MaterialCommunityIcons name="close" size={32} color={iconColor} />,
			onPress: handleBack,
			accessibilityHint: "Schließt die Frage",
		});

		return actions;
	}, [hasVisibleHints, handleBack, iconColor, navigateToHintsModal]);

	// Early returns for error states
	if (!quizId || !questionId) {
		return <ErrorComponent message="Quiz oder Frage-ID fehlt" />;
	}

	if (!quizState) {
		return <LoadingComponent message="Quiz wird geladen..." />;
	}

	if (!question) {
		return <ErrorComponent message="Frage nicht gefunden" />;
	}

	return (
		<ThemedView gradientType="primary" style={{ flex: 1 }}>
			<Header
				showBackButton={false}
				title={headerText}
				rightSlot={
					<View style={styles.headerActions}>
						{headerActions.map((action) => (
							<TouchableOpacity
								key={action.key}
								onPress={action.onPress}
								style={styles.actionButton}
								accessibilityHint={action.accessibilityHint}
							>
								{action.icon}
							</TouchableOpacity>
						))}
					</View>
				}
			/>
			<Hint hint={hint} isVisible={showHint} onClose={resetResult} />
			{showResultReaction && <ResultReaction correctAnswer={isCorrect} />}
			<QuestionContentContainer question={question}>
				{isSolved && (
					<View style={styles.resultContainer}>
						<Solved question={question} justSolved={statusChanged} />
					</View>
				)}
				{showInput && (
					<QuestionInput
						value={answer}
						onChangeText={handleChangeAnswer}
						onSubmit={handleSubmit}
						onClear={clearAnswer}
						isSubmitting={isSubmitting}
						hasError={showResult && !isCorrect}
					/>
				)}
			</QuestionContentContainer>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	headerActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		justifyContent: "flex-end",
	},
	actionButton: {
		padding: 8,
		borderRadius: 20,
	},
	resultContainer: {
		flex: 1,
		justifyContent: "space-between",
		minHeight: 200,
		padding: 16,
	},
});
