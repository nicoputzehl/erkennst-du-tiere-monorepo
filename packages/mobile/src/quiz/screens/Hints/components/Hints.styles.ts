import { StyleSheet } from "react-native";

const sharedHintstyles = StyleSheet.create({
	title: {
		marginBottom: 16,
	},
	hint: {
		padding: 16,
		borderRadius: 8,
		marginBottom: 8,
	},
	card: {
		backgroundColor: "#f8f9fa",
		borderWidth: 1,
		borderColor: "#dee2e6",
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 16,
		elevation: 2,
	},
	receivedHint: {
		backgroundColor: "rgba(248, 249, 250, .7)",
		borderWidth: 4,
	},
	hintTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#212529",
		flex: 1,
	},
	hintDescription: {
		fontSize: 14,
		color: "#6c757d",
		marginBottom: 8,
		lineHeight: 18,
	},
});

export default sharedHintstyles;
