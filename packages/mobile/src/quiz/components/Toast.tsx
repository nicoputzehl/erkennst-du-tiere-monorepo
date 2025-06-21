import { ThemedText } from "@/common/components/ThemedText";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

export interface ToastProps {
	visible: boolean;
	message: string;
	type?: "success" | "info" | "warning" | "error";
	duration?: number;
	onHide: () => void;
	position?: "top" | "bottom";
}

export const Toast: React.FC<ToastProps> = ({
	visible,
	message,
	type = "info",
	duration = 3000,
	onHide,
	position = "top",
}) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(-100)).current;
	const hideTimeoutRef = useRef<number | undefined>(undefined);

	const hideToast = useCallback(() => {
		console.log("[Toast] Hiding toast");
		onHide();
	}, [onHide]);

	useEffect(() => {
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current);
		}

		if (visible) {
			console.log(`[Toast] Showing toast: "${message}"`);

			// Show animation
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(slideAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();

			// Auto-hide after duration
			hideTimeoutRef.current = setTimeout(() => {
				hideToast();
			}, duration) as unknown as number;
		} else {
			// Hide animation
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(slideAnim, {
					toValue: position === "top" ? -100 : 100,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		}

		// Cleanup timeout on unmount
		return () => {
			if (hideTimeoutRef.current) {
				clearTimeout(hideTimeoutRef.current);
			}
		};
	}, [visible, message, duration, position, fadeAnim, slideAnim, hideToast]); // Alle Dependencies

	if (!visible) {
		return null;
	}

	const getBackgroundColor = () => {
		switch (type) {
			case "success":
				return "#4CAF50";
			case "error":
				return "#F44336";
			case "warning":
				return "#FF9800";
			default:
				return "#2196F3";
		}
	};

	return (
		<Animated.View
			style={[
				styles.toastContainer,
				position === "top" ? styles.topPosition : styles.bottomPosition,
				{
					opacity: fadeAnim,
					transform: [{ translateY: slideAnim }],
					backgroundColor: getBackgroundColor(),
				},
			]}
		>
			<TouchableOpacity style={styles.toastContent} onPress={hideToast}>
				<ThemedText style={styles.toastText}>{message}</ThemedText>
			</TouchableOpacity>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	toastContainer: {
		position: "absolute",
		left: 16,
		right: 16,
		borderRadius: 8,
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		zIndex: 9999,
	},
	topPosition: {
		top: 50,
	},
	bottomPosition: {
		bottom: 100,
	},
	toastContent: {
		padding: 16,
	},
	toastText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
	},
});
