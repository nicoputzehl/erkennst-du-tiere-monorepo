import { ThemedText } from "@/common/components/ThemedText";
import {
	Modal,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import type { WrongAnswerHint } from "../Question.types";

type HintProps = {
	hint: WrongAnswerHint | undefined;
	onClose: () => void;
	isVisible: boolean;
};

const Hint = ({ hint, onClose, isVisible }: HintProps) => {
	if (!hint) {
		return null;
	}

	return (
		<Modal visible={isVisible} transparent={true} animationType="fade">
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={styles.overlay2}>
					<View style={styles.usedHintContainer}>
						<ThemedText style={styles.usedHintTitle}>
							💡 {hint.title}
						</ThemedText>
						<ThemedText style={styles.usedHintContent}>
							{hint.content}
						</ThemedText>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

export default Hint;

const styles = StyleSheet.create({
	overlay2: {
		flex: 1,
		backgroundColor: "rgba(205, 205, 205, 0.7)",
		justifyContent: "center",
		alignItems: "center",
	},
	usedHintContainer: {
		backgroundColor: "#E8F5E8",
		padding: 12,
		borderRadius: 16,
		marginBottom: 16,
		width: "90%",
		height: "50%",
	},
	usedHintTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#2E7D32",
		marginBottom: 4,
	},
	usedHintContent: {
		fontSize: 24,
		color: "#1B5E20",
		lineHeight: 28,
	},
});
