import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";

export const Lottie = () => {
	const animation = useRef<LottieView>(null);
	useEffect(() => {
		// You can control the ref programmatically, rather than using autoPlay
		// animation.current?.play();
	}, []);

	return (
		<View style={styles.animationContainer}>
			<LottieView
				autoPlay
				loop={false}
				ref={animation}
				style={{
					width: "100%",
					height: "100%",
				}}
				// TODO lokal ablegen
				// Find more Lottie files at https://lottiefiles.com/featured
				source={require("../../../../../assets/animations//celebration.json")}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	animationContainer: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: "100%",
		height: "100%",
		zIndex: -1,
	},
	buttonContainer: {
		paddingTop: 20,
	},
});
