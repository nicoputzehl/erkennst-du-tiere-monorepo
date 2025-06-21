import { useColorScheme } from "@/common/hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, StyleSheet, type ViewProps } from "react-native";
import { Gradients } from "../constants/Gradients";

export type ThemedViewProps = ViewProps & {
	lightColor?: string;
	darkColor?: string;
	gradientColors?: {
		light: [string, string, ...string[]];
		dark: [string, string, ...string[]];
	};
	gradientType?: "primary" | "secondary" | "neutral" | "success";
};

export function ThemedView({
	style,
	lightColor,
	darkColor,
	gradientColors,
	gradientType = "primary",
	...otherProps
}: ThemedViewProps) {
	const colorScheme = useColorScheme();

	const getGradientColors = (): [string, string, ...string[]] => {
		if (gradientColors) {
			return gradientColors[colorScheme ?? "light"];
		}

		// Fallback auf Colors-Konstante basierend auf gradientType
		const isDark = colorScheme === "dark";
		const gradients = isDark ? Gradients.dark : Gradients.light;

		switch (gradientType) {
			case "secondary":
				return gradients.gradientSecondary as [string, string, ...string[]];
			case "neutral":
				return gradients.gradientNeutral as [string, string, ...string[]];
			case "success":
				return gradients.gradientSuccess as [string, string, ...string[]];
			default:
				return gradients.gradientNewPrimary as [string, string, ...string[]];
		}
	};

	const currentGradientColors = getGradientColors();

	return (
		<LinearGradient
			colors={currentGradientColors}
			style={{ flex: 1 }}
			start={{ x: 0, y: 0.2 }}
			end={{ x: 0, y: 1 }}
		>
			<SafeAreaView
				style={[componentStyles.container, style]}
				{...otherProps}
			/>
		</LinearGradient>
	);
}

const componentStyles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
