import { useThemeColor } from "@/common/hooks/useThemeColor";
import { useQuizStore } from "@/quiz/store/Store";
import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface PointsDisplayProps {
	quizId: string;
	compact?: boolean;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({
	quizId,
	compact = false,
}) => {
	// TODO von außen reingeben
	const pointsBalance = useQuizStore((state) => state.getPointsBalance());
	const textColor = useThemeColor({}, "text");

	return (
		<View
			style={[styles.pointsDisplay, compact && styles.pointsDisplayCompact]}
		>
			<FontAwesome6 name="coins" size={compact ? 14 : 18} color="#FFD700" />
			<Text
				style={[
					compact ? styles.pointsTextCompact : styles.pointsTextLarge,
					{ color: textColor },
				]}
			>
				{pointsBalance}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	pointsDisplay: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: "rgba(255, 215, 0, 0.2)",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
	},
	pointsDisplayCompact: {
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	pointsTextLarge: {
		fontSize: 16,
		fontWeight: "600",
	},
	pointsTextCompact: {
		fontSize: 14,
		fontWeight: "600",
	},
});
