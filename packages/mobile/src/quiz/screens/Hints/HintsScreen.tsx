import Header from "@/common/components/Header";
import { ThemedView } from "@/common/components/ThemedView";
import { useThemeColor } from "@/common/hooks/useThemeColor";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { HintsContent } from "./components/HintsContent";
import { PointsDisplay } from "./components/PointsDisplay";

interface HintsScreenProps {
	quizId: string;
	questionId: string;
}

export const HintsScreen: React.FC<HintsScreenProps> = ({
	quizId,
	questionId,
}) => {
	const handleClose = () => {
		router.back();
	};

	const iconColor = useThemeColor({}, "tintOnGradient");
	return (
		<ThemedView gradientType="primary" style={styles.container}>
			<View style={styles.container}>
				<Header
					title="Hinweise"
					leftSlot={
						<View style={styles.headerLeft}>
							<FontAwesome6
								name="lightbulb"
								size={20}
								color={iconColor}
								style={styles.headerIcon}
							/>
						</View>
					}
					rightSlot={
						<View style={styles.headerRight}>
							<PointsDisplay quizId={quizId} compact />
							<TouchableOpacity
								onPress={handleClose}
								style={styles.closeButton}
								activeOpacity={0.7}
								hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
							>
								<FontAwesome6 name="xmark" size={24} color={iconColor} />
							</TouchableOpacity>
						</View>
					}
				/>

				{/* Content */}
				<View style={styles.content}>
					<HintsContent quizId={quizId} questionId={questionId} />
				</View>
			</View>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		borderRadius: 16,
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	headerIcon: {
		marginRight: 8,
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	closeButton: {
		padding: 4,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
	},
	content: {
		flex: 1,
		paddingHorizontal: 4,
	},
});
