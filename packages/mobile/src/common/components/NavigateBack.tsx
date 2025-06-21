import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";

type NavigateBackProps = {
	onPress: () => void;
	text?: string;
	iconColor?: string;
	textColor?: string;
};

const NavigateBack = ({
	onPress,
	text = "Zurück",
	iconColor = "#007AFF", // iOS Standard Blau
	textColor = "#007AFF", // iOS Standard Blau
}: NavigateBackProps) => {
	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<FontAwesome6
				name="chevron-left"
				size={18} // Kleiner wie bei iOS
				color={iconColor}
				style={styles.icon}
			/>
			<ThemedText style={[styles.backButton, { color: textColor }]}>
				{text}
			</ThemedText>
		</TouchableOpacity>
	);
};

export default NavigateBack;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
	},
	icon: {
		marginRight: 6, // Etwas mehr Abstand
	},
	backButton: {
		fontSize: 17, // iOS Standard Schriftgröße
		fontWeight: "400", // Normal weight wie iOS
	},
});
