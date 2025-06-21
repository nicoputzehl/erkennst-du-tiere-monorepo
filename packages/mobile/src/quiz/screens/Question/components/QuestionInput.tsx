// src/quiz/screens/Question/components/QuestionInput/QuestionInput.tsx - NEW OPTIMIZED COMPONENT
import ThemedTextInput from "@/common/components/ThemedTextInput";
import { useThemeColor } from "@/common/hooks/useThemeColor";
import { FontAwesome6 } from "@expo/vector-icons";
import { memo, useEffect, useRef } from "react";
import {
	Keyboard,
	StyleSheet,
	type TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface QuestionInputProps {
	value: string;
	onChangeText: (text: string) => void;
	onSubmit: () => void;
	onClear: () => void;
	isSubmitting?: boolean;
	hasError?: boolean;
}

export const QuestionInput: React.FC<QuestionInputProps> = memo(
	({
		value,
		onChangeText,
		onSubmit,
		onClear,
		isSubmitting = false,
		hasError = false,
	}) => {
		const inputRef = useRef<TextInput>(null);

		const borderColor = useThemeColor({}, "lightAccent");
		const textColor = useThemeColor({}, "tintOnGradient");
		const clearIconColor = useThemeColor({}, "textSecondary");
		const placeholderColor = useThemeColor(
			{ light: "#666", dark: "#666" },
			"text",
		);

		useEffect(() => {
			const timer = setTimeout(() => {
				inputRef.current?.focus();
			}, 300);
			return () => clearTimeout(timer);
		}, []);

		useEffect(() => {
			if (isSubmitting) {
				inputRef.current?.blur();
				Keyboard.dismiss();
			}
		}, [isSubmitting]);

		const handleSubmit = () => {
			if (!value.trim() || isSubmitting) return;
			Keyboard.dismiss();
			onSubmit();
		};

		const handleClear = () => {
			onClear();
			inputRef.current?.focus();
		};

		return (
			<View style={styles.container}>
				<View style={styles.inputContainer}>
					<ThemedTextInput
						ref={inputRef}
						style={[
							styles.input,
							{
								color: textColor,
								borderBottomColor: borderColor,
							},
							isSubmitting && styles.inputDisabled,
							hasError && styles.inputError,
						]}
						value={value}
						onChangeText={onChangeText}
						onSubmitEditing={handleSubmit}
						autoCapitalize="characters"
						autoCorrect={false}
						placeholder="Antwort eingeben..."
						placeholderTextColor={placeholderColor}
						textAlignVertical="center"
						editable={!isSubmitting}
						returnKeyType="done"
						submitBehavior="blurAndSubmit"
						maxLength={50}
					/>

					{value.length > 0 && !isSubmitting && (
						<TouchableOpacity
							style={styles.clearButton}
							onPress={handleClear}
							accessibilityLabel="Eingabe löschen"
							accessibilityRole="button"
						>
							<FontAwesome6
								name="circle-xmark"
								size={20}
								color={clearIconColor}
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.value === nextProps.value &&
			prevProps.isSubmitting === nextProps.isSubmitting &&
			prevProps.hasError === nextProps.hasError &&
			prevProps.onChangeText === nextProps.onChangeText &&
			prevProps.onSubmit === nextProps.onSubmit &&
			prevProps.onClear === nextProps.onClear
		);
	},
);

QuestionInput.displayName = "QuestionInput";

const styles = StyleSheet.create({
	container: {
		marginBottom: 20,
		alignItems: "center",
		width: "100%",
	},
	inputContainer: {
		width: "85%",
		marginBottom: 16,
		position: "relative",
		flexDirection: "row",
		alignItems: "center",
	},
	input: {
		flex: 1,
		height: 50,
		borderWidth: 0,
		borderBottomWidth: 2,
		paddingHorizontal: 12,
		paddingVertical: 8,
		paddingRight: 40, // Space for clear button
		fontSize: 24,
		backgroundColor: "transparent",
		textAlign: "center",
		fontWeight: "500",
	},
	inputDisabled: {
		opacity: 0.7,
	},
	inputError: {
		borderBottomWidth: 3,
	},
	clearButton: {
		position: "absolute",
		right: 8,
		top: "50%",
		transform: [{ translateY: -10 }],
		padding: 4,
	},
});
