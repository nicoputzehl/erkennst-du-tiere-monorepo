import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

export const ProgressIndicator = ({ progress }: { progress: number }) => {
	return (
		<View style={styles.progressBarBackground}>
			<LinearGradient
				colors={[
					getProgressColor(progress),
					getProgressColor(progress),
					"transparent",
				]}
				style={styles.progressGradient}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				locations={[0, progress / 100, progress / 100]}
			/>
		</View>
	);
};

const getProgressColor = (percentage: number): string => {
	if (percentage <= 25) return "#FFF2A1";
	if (percentage <= 50) return "#FFD100";
	if (percentage <= 75) return "#FFBF40";
	if (percentage < 100) return "#FFA826";
	return "#131E2D";
};

const styles = StyleSheet.create({
	progressBarBackground: {
		height: 8,
		backgroundColor: "#e9ecef",
		borderRadius: 4,
		overflow: "hidden",
		width: "100%",
	},
	progressGradient: {
		width: "100%",
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 0.6,
	},
});
