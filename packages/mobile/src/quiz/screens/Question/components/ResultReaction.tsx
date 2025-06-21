import { AntDesign } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withSequence,
	withTiming,
} from "react-native-reanimated";

const ResultReaction = ({ correctAnswer }: { correctAnswer: boolean }) => {
	const scale = useSharedValue(0);
	const rotation = useSharedValue(0);
	const color = correctAnswer ? "#ffa826" : "#E04F5F";

	useEffect(() => {
		// Bounce-in Animation beim Mount
		const timer = setTimeout(() => {
			scale.value = withSequence(
				withSpring(1.2, { damping: 8, stiffness: 100 }),
				withSpring(1, { damping: 12, stiffness: 150 }),
			);

			// Optionale leichte Rotation für mehr Dynamik
			rotation.value = withSequence(
				withTiming(-5, { duration: 100 }),
				withTiming(5, { duration: 200 }),
				withTiming(0, { duration: 100 }),
			);
		}, 300);

		return () => clearTimeout(timer);
	}, [rotation, scale]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
		};
	});

	const name = correctAnswer ? "smileo" : "frowno";
	return (
		<Animated.View style={[styles.container, animatedStyle]}>
			<AntDesign name={name} size={40} color={color} />
		</Animated.View>
	);
};

export default ResultReaction;

const styles = StyleSheet.create({
	container: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		alignSelf: "center",
		bottom: "15%",
	},
});
