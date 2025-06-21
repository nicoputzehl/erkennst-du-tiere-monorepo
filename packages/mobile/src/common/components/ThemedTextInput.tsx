import { forwardRef } from "react";
import { TextInput, type TextInputProps } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
	lightColor?: string;
	darkColor?: string;
};

const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(
	({ style, lightColor, darkColor, ...rest }, ref) => {
		const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

		return (
			<TextInput
				ref={ref}
				style={[{ color }, style, { fontFamily: "Ubuntu_400Regular" }]}
				{...rest}
			/>
		);
	},
);
ThemedTextInput.displayName = "ThemedTextInput";
export default ThemedTextInput;
