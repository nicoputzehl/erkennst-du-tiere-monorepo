import { memo } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export const LoadingComponent = memo(
	({ message }: { message: string }) => {
		return (
			<ThemedView style={styles.container}>
				<ActivityIndicator size="large" color="#0a7ea4" />
				<ThemedText style={styles.loadingText}>{message}</ThemedText>
			</ThemedView>
		);
	},
	(prevProps, nextProps) => {
		return prevProps.message === nextProps.message;
	},
);
LoadingComponent.displayName = "ErrorComponent";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: "#0a7ea4",
		textAlign: "center",
	},
});
