import { useThemeColor } from "./useThemeColor";

export const useSemanticColors = () => {
	return {
		primary: useThemeColor({}, "primary"),
		success: useThemeColor({}, "success"),
		error: useThemeColor({}, "error"),
		warning: useThemeColor({}, "warning"),
		info: useThemeColor({}, "info"),

		buttonPrimary: useThemeColor({}, "buttonPrimary"),
		buttonSuccess: useThemeColor({}, "buttonSuccess"),
		buttonWarning: useThemeColor({}, "buttonWarning"),
		buttonError: useThemeColor({}, "buttonError"),
		buttonDisabled: useThemeColor({}, "buttonDisabled"),

		textPrimary: useThemeColor({}, "textPrimary"),
		textSecondary: useThemeColor({}, "textSecondary"),
		textOnButton: useThemeColor({}, "textOnButton"),
		textPlaceholder: useThemeColor({}, "textPlaceholder"),

		border: useThemeColor({}, "border"),
		borderActive: useThemeColor({}, "borderActive"),

		cardBackground: useThemeColor({}, "cardBackground"),
		cardBorder: useThemeColor({}, "cardBorder"),
		containerBackground: useThemeColor({}, "containerBackground"),

		correct: useThemeColor({}, "correct"),
		incorrect: useThemeColor({}, "incorrect"),
		locked: useThemeColor({}, "locked"),
		new: useThemeColor({}, "new"),
	};
};
