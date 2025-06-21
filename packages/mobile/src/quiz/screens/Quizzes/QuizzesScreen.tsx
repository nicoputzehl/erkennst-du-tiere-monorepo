import Header from "@/common/components/Header";
import { ThemedView } from "@/common/components/ThemedView";
import { FontSizes } from "@/common/constants/Styles";
import { useThemeColor } from "@/common/hooks/useThemeColor";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { QuizGrid } from "./components/QuizGrid";
import { useQuizzesScreen } from "./hooks/useQuizzesScreen";
import { Quiz } from "@quiz-app/shared";

type QuizzesProps = {
	quizzes: Quiz[];
};

export default function QuizzesScreen({ quizzes }: QuizzesProps) {
	useQuizzesScreen();

	// Theme-basierte Farben
	const textColor = useThemeColor({}, "text");

	const handleNavigateToSettings = () => {
		router.navigate("/settings");
	};

	const renderContent = () => (
		<ScrollView
			style={styles.scrollView}
			contentContainerStyle={styles.scrollContent}
			showsVerticalScrollIndicator={false}
		>
			<QuizGrid quizzes={quizzes} />
		</ScrollView>
	);

	return (
		<ThemedView style={styles.container} gradientType="primary">
			<Header
				title="Erkennst du: Tiere"
				titleType="defaultSemiBold"
				rightSlot={
					<TouchableOpacity
						onPress={handleNavigateToSettings}
						style={styles.settingsButton}
						activeOpacity={0.7}
						accessibilityLabel="Einstellungen öffnen"
						accessibilityRole="button"
					>
						<FontAwesome6
							name="gear"
							size={FontSizes.xxl}
							// TODO Color aus Constanten
							color={typeof textColor === "string" ? textColor : "#FFFFFF"}
						/>
					</TouchableOpacity>
				}
			/>

			{renderContent()}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	settingsButton: {
		padding: 10,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
		alignItems: "center",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
		paddingTop: 8,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		textAlign: "center",
		opacity: 0.8,
	},
});
