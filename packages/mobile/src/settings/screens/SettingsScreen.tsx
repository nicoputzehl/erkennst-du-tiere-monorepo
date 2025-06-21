import Header from "@/common/components/Header";
import { ThemedText } from "@/common/components/ThemedText";
import { ThemedView } from "@/common/components/ThemedView";
import { useQuizStatistics, useUI } from "@/quiz/store";
import { useQuiz } from "@/quiz/store/hooks/useQuiz";
import { router } from "expo-router";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

export function SettingsScreen() {
	const { quizzes, resetQuizState, resetAllQuizStates } = useQuiz();
	const { showSuccess, showError } = useUI();
	const statistics = useQuizStatistics();

	const [resettingQuiz, setResettingQuiz] = useState<string | null>(null);
	const [resettingAll, setResettingAll] = useState(false);

	const navigateBack = () => {
		router.back();
	};

	const handleResetQuiz = async (quizId: string, quizTitle: string) => {
		setResettingQuiz(quizId);

		try {
			resetQuizState(quizId);
			showSuccess(`Quiz "${quizTitle}" zurückgesetzt!`);
		} catch (error) {
			console.error(`Error resetting quiz ${quizId}:`, error);
			showError(`Fehler beim Zurücksetzen: ${error}`);
		} finally {
			setResettingQuiz(null);
		}
	};

	const handleResetAll = () => {
		Alert.alert(
			"Alle Quizzes zurücksetzen?",
			"Möchtest du wirklich alle Quiz-Fortschritte zurücksetzen?",
			[
				{ text: "Abbrechen", style: "cancel" },
				{
					text: "Zurücksetzen",
					style: "destructive",
					onPress: async () => {
						setResettingAll(true);
						try {
							await resetAllQuizStates();
							showSuccess("Alle Quizzes wurden zurückgesetzt!");
						} catch (error) {
							showError(`Fehler: ${error}`);
						} finally {
							setResettingAll(false);
							navigateBack();
						}
					},
				},
			],
		);
	};

	return (
		<ThemedView style={styles.container}>
			<View style={styles.container}>
				<Header
					title="Einstellungen"
					showBackButton
					onBackPress={navigateBack}
				/>

				<ScrollView style={styles.scrollView}>
					{/* Statistics Section */}
					<View style={styles.section}>
						<ThemedText style={styles.sectionTitle}>Statistiken</ThemedText>
						<View style={styles.statRow}>
							<ThemedText style={styles.statLabel}>
								Abgeschlossene Quizzes:
							</ThemedText>
							<ThemedText style={styles.statValue}>
								{statistics.completedQuizzes} / {statistics.totalQuizzes}
							</ThemedText>
						</View>
						<View style={styles.statRow}>
							<ThemedText style={styles.statLabel}>
								Beantwortete Fragen:
							</ThemedText>
							<ThemedText style={styles.statValue}>
								{statistics.completedQuestions} / {statistics.totalQuestions}
							</ThemedText>
						</View>
						<View style={styles.statRow}>
							<ThemedText style={styles.statLabel}>
								Gesamtfortschritt:
							</ThemedText>
							<ThemedText style={styles.statValue}>
								{statistics.completionPercentage}%
							</ThemedText>
						</View>
					</View>

					{/* Reset Section */}
					<View style={styles.section}>
						<ThemedText style={styles.sectionTitle}>
							Quiz-Fortschritte zurücksetzen
						</ThemedText>

						<TouchableOpacity
							style={[
								styles.resetAllButton,
								resettingAll && styles.disabledButton,
							]}
							onPress={handleResetAll}
							disabled={resettingAll}
						>
							{resettingAll ? (
								<ActivityIndicator size="small" color="#fff" />
							) : (
								<ThemedText style={styles.resetAllButtonText}>
									Alle Quizzes zurücksetzen
								</ThemedText>
							)}
						</TouchableOpacity>

						{quizzes.map((quiz) => (
							<TouchableOpacity
								key={quiz.id}
								style={[
									styles.quizResetButton,
									resettingQuiz === quiz.id && styles.disabledButton,
								]}
								onPress={() => handleResetQuiz(quiz.id, quiz.title)}
								disabled={resettingQuiz === quiz.id}
							>
								{resettingQuiz === quiz.id ? (
									<ActivityIndicator size="small" color="#fff" />
								) : (
									<ThemedText style={styles.quizResetButtonText}>
										{quiz.title} zurücksetzen
									</ThemedText>
								)}
							</TouchableOpacity>
						))}
					</View>

					{/* App Info Section */}
					<View style={styles.section}>
						<ThemedText style={styles.sectionTitle}>
							App-Informationen
						</ThemedText>
						<ThemedText style={styles.infoText}>Version: 1.0.0</ThemedText>
						<ThemedText style={styles.infoText}>
							© 2025 Erkennst du: Tiere?
						</ThemedText>
					</View>
				</ScrollView>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	scrollView: {
		flex: 1,
	},
	section: {
		marginBottom: 24,
		padding: 16,
		backgroundColor: "#f8f9fa",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 16,
		color: "#343a40",
	},
	statRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	statLabel: {
		fontSize: 14,
		color: "#6c757d",
	},
	statValue: {
		fontSize: 14,
		fontWeight: "600",
		color: "#495057",
	},
	resetAllButton: {
		backgroundColor: "#dc3545",
		padding: 12,
		borderRadius: 8,
		alignItems: "center",
		marginBottom: 16,
	},
	resetAllButtonText: {
		color: "white",
		fontWeight: "600",
		fontSize: 16,
	},
	quizResetButton: {
		backgroundColor: "#6c757d",
		padding: 12,
		borderRadius: 8,
		alignItems: "center",
		marginBottom: 8,
	},
	quizResetButtonText: {
		color: "white",
		fontWeight: "500",
	},
	disabledButton: {
		opacity: 0.6,
	},
	infoText: {
		fontSize: 14,
		color: "#6c757d",
		marginBottom: 8,
	},
});
