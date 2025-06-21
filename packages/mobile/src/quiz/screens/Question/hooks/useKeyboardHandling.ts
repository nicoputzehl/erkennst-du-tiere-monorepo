import { useEffect, useRef } from "react";
import { Animated, Keyboard, Platform } from "react-native";

export const useKeyboardHandling = ({
	initialImageSize, // Annahme einer initialen Größe (Breite/Höhe für 1:1 Ratio)
}: { initialImageSize: number }) => {
	const imageSize = useRef(new Animated.Value(initialImageSize)).current;

	useEffect(() => {
		const keyboardWillShowListener = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
			(event) => {
				const duration = Platform.OS === "ios" ? event.duration : 250;
				const targetSize = 300; // Feste Größe für das Bild, wenn die Tastatur sichtbar ist

				Animated.timing(imageSize, {
					toValue: targetSize, // Animiert auf die kleinere feste Größe
					duration: duration,
					useNativeDriver: false,
				}).start();
			},
		);

		const keyboardWillHideListener = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
			(event) => {
				const duration = Platform.OS === "ios" ? event.duration : 250;

				Animated.timing(imageSize, {
					toValue: initialImageSize, // Animiert zurück zur initialen Größe
					duration: duration,
					useNativeDriver: false,
				}).start();
			},
		);

		return () => {
			keyboardWillShowListener.remove();
			keyboardWillHideListener.remove();
		};
	}, [imageSize, initialImageSize]); // initialImageSize als Abhängigkeit hinzufügen

	return { imageSize };
};
