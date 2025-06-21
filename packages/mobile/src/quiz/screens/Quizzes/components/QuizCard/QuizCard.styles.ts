import {
	BorderRadius,
	CommonStyles,
	FontSizes,
	FontWeights,
	Shadows,
	Spacing,
} from "@/common/constants/Styles";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	quizTitle: {
		fontSize: FontSizes.lg,
		fontWeight: FontWeights.semibold,
		zIndex: 1,
		// TODO Color aus constanten
		color: "#666",
	},
	quizCardOuter: {
		// TODO Color aus constanten
		backgroundColor: "#f8f9fa",
		borderRadius: BorderRadius.md,
		flex: 1,
		height: 100,
		maxWidth: "100%",
		minWidth: "100%",
		overflow: "hidden",
		boxShadow: Shadows.boxShadow,
	},
	quizCardInner: {
		flex: 1,
		flexDirection: "row",
	},
	quizCardContent: {
		flex: 1,
		padding: Spacing.md,
		justifyContent: "space-between",
	},
	quizCardStartItem: {
		width: 105,
		height: 100,
		...CommonStyles.centered,
	},
	image: {
		width: 105,
		height: 100,
	},
	iconContainer: {
		width: "100%",
		height: "100%",
		...CommonStyles.centered,
	},
	unlockDescription: {
		fontSize: FontSizes.xs,
		// TODO Color aus constanten
		color: "#6c757d",
		lineHeight: FontSizes.md,
	},
	locked: {
		// TODO Color aus constanten
		backgroundColor: "#f8f9fa",

		// TODO Color aus constanten
		// borderColor: "#dee2e6",
	},
	new: {
		borderStyle: "dotted",
		// TODO Color und Type evtl anpassen
		borderColor: "orange",
		borderWidth: 4,
	},
	loadingCard: {
		opacity: 0.7,
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		// TODO Color aus constanten
		backgroundColor: "rgba(0, 0, 0, 0.15)",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
	},

	// Progress

	activeProgressContainer: {
		...CommonStyles.rowSpaceBetween,
	},
	progressSection: {},
	progressContainer: {
		flexDirection: "row",
		width: "100%",
		gap: Spacing.sm,
		...CommonStyles.centered,
	},
	progressIndicatorContainer: {
		flex: 1,
	},
	progressText: {
		fontSize: FontSizes.sm,
		// TODO Color aus constanten
		color: "#666",
		zIndex: 1,
		textAlign: "right",
	},
	newText: {
		fontSize: FontSizes.sm,
		// TODO Color aus constanten
		color: "#ff9800",
		fontWeight: FontWeights.medium,
	},
});
