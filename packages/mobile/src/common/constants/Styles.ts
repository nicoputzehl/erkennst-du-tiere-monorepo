// src/common/constants/Styles.ts
import { StyleSheet } from "react-native";

export const Spacing = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	xxl: 24,
	xxxl: 32,
} as const;

export const BorderRadius = {
	sm: 4,
	md: 8,
	lg: 12,
	xl: 16,
	full: 9999,
} as const;

export const FontSizes = {
	xs: 12,
	sm: 14,
	md: 16,
	lg: 18,
	xl: 20,
	xxl: 24,
} as const;

export const FontWeights = {
	normal: "400",
	medium: "500",
	semibold: "600",
	bold: "700",
} as const;

export const Shadows = {
	sm: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	md: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	lg: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 5,
	},
	boxShadow: "0 2px 4px rgba(0, 0, 0, .1)",
} as const;

// Gemeinsame Layout-Styles
export const CommonStyles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centered: {
		justifyContent: "center",
		alignItems: "center",
	},
	row: {
		flexDirection: "row",
	},
	rowCentered: {
		flexDirection: "row",
		alignItems: "center",
	},
	rowSpaceBetween: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	padding: {
		padding: Spacing.lg,
	},
	paddingHorizontal: {
		paddingHorizontal: Spacing.lg,
	},
	paddingVertical: {
		paddingVertical: Spacing.lg,
	},
	margin: {
		margin: Spacing.lg,
	},
	marginHorizontal: {
		marginHorizontal: Spacing.lg,
	},
	marginVertical: {
		marginVertical: Spacing.lg,
	},
});
