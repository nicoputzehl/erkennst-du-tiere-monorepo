// src/quiz/screens/Question/components/DelayedLottie.tsx - NEW COMPONENT
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

interface DelayedLottieProps {
	delay?: number;
	shouldPlay: boolean;
}

export const DelayedLottie: React.FC<DelayedLottieProps> = ({
	delay = 800,
	shouldPlay,
}) => {
	const animation = useRef<LottieView>(null);
	const [showAnimation, setShowAnimation] = useState(false);

	useEffect(() => {
		if (shouldPlay) {
			const timer = setTimeout(() => {
				setShowAnimation(true);
			}, delay);

			return () => clearTimeout(timer);
		}
		setShowAnimation(false);
	}, [shouldPlay, delay]);

	useEffect(() => {
		if (showAnimation) {
			animation.current?.play();
		}
	}, [showAnimation]);

	if (!showAnimation) {
		return null;
	}

	return (
		<View style={styles.animationContainer}>
			<LottieView
				ref={animation}
				style={styles.animation}
				// TODO lokal ablegen
				source={require("../../../../../assets/animations/celebration.json")}
				autoPlay={false}
				loop={false}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	animationContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		zIndex: -1,
		pointerEvents: "none",
	},
	animation: {
		width: "100%",
		height: "100%",
	},
});
