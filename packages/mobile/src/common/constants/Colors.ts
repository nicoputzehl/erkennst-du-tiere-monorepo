import { ColorsValues } from "./Colors.values";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#64B5F6";

export const Colors = {
	light: {
		text: "#FFFFFF",
		background: "#fff",
		tint: tintColorLight,
		tintOnGradient: ColorsValues.graphite,
		icon: "#FFFFFF",
		tabIconDefault: "#687076",
		tabIconSelected: tintColorLight,
		accent: ColorsValues.strawberry,
		lightAccent: ColorsValues.citrus,

		primary: "#0a7ea4",
		success: "#5c7fbb",
		error: "#8b603b",
		warning: "#FF9800",
		info: "#2196F3",

		buttonPrimary: "#0a7ea4",
		buttonSuccess: "#4CAF50",
		buttonWarning: "#FF9800",
		buttonError: "#F44336",
		buttonDisabled: "#ccc",

		textPrimary: "#FFFFFF",
		textSecondary: "#6c757d",
		textOnButton: "#fff",
		textPlaceholder: "#666",

		border: "rgba(0, 0, 0, 0.1)",
		borderActive: "#0a7ea4",
		shadow: "#000",

		cardBackground: "#f5f5f5",
		cardBorder: "rgba(0, 0, 0, 0.1)",
		containerBackground: "rgba(255, 255, 255, 0.1)",

		correct: "#4CAF50",
		incorrect: "#F44336",
		locked: "#6c757d",
		new: "#ff9800",
	},
	dark: {
		// TODO Dark Colors noch besser ausdiefinieren
		text: "#ECEDEE",
		background: "#151718",
		tint: tintColorDark,
		tintOnGradient: ColorsValues.lightgrey,
		icon: "#ECEDEE",
		tabIconDefault: "#9BA1A6",
		tabIconSelected: tintColorDark,
		accent: ColorsValues.dawnorange,
		primary: "#64B5F6",
		success: "#81C784",
		error: "#E57373",
		warning: "#FFB74D",
		info: "#64B5F6",
		lightAccent: ColorsValues.citrus,

		buttonPrimary: "#64B5F6",
		buttonSuccess: "#81C784",
		buttonWarning: "#FFB74D",
		buttonError: "#E57373",
		buttonDisabled: "#424242",

		textPrimary: "#ECEDEE",
		textSecondary: "#9BA1A6",
		textOnButton: "#fff",
		textPlaceholder: "#666",

		border: "rgba(255, 255, 255, 0.2)",
		borderActive: "#64B5F6",
		shadow: "#000",

		cardBackground: "#2a2a2a",
		cardBorder: "rgba(255, 255, 255, 0.2)",
		containerBackground: "rgba(0, 0, 0, 0.2)",

		correct: "#81C784",
		incorrect: "#E57373",
		locked: "#9BA1A6",
		new: "#FFB74D",
	},
};
