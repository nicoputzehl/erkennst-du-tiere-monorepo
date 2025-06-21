import React from "react";
import {
	type StyleProp,
	StyleSheet,
	type TextStyle,
	TouchableOpacity,
	type TouchableOpacityProps,
} from "react-native";
import { ThemedText } from "./ThemedText";

interface ButtonProps extends TouchableOpacityProps {
	text: string;
	buttonStyle?: StyleProp<TextStyle>;
}

const Button = ({
	disabled,
	onPress,
	text,
	buttonStyle,
	style,
}: ButtonProps) => {
	return (
		<TouchableOpacity
			style={[styles.button, disabled && styles.disabledButton, style]}
			onPress={onPress}
			disabled={disabled}
			activeOpacity={0.8}
		>
			<ThemedText style={[styles.buttonText, buttonStyle]}>{text}</ThemedText>
		</TouchableOpacity>
	);
};

export default Button;

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#0a7ea4",
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 12,
		width: "70%",
		alignItems: "center",
		justifyContent: "center",
		minHeight: 50,
		// Schatten
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	disabledButton: {
		opacity: 0.5,
		backgroundColor: "#ccc",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 16,
		letterSpacing: 0.5,
	},
});
