import { Ubuntu_400Regular } from "@expo-google-fonts/ubuntu/400Regular";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/common/hooks/useColorScheme";
import { ToastContainer } from "@/quiz/components/ToastContainer";
import { QuizProvider } from "@/quiz/contexts/QuizProvider";

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({ Ubuntu_400Regular });

	if (!loaded) {
		return null;
	}

	return (
		<QuizProvider>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="index" options={{ headerShown: false }} />
					<Stack.Screen
						name="quiz/[quizId]/[questionId]/hints-modal"
						options={{
							presentation: "modal",
							headerShown: false,
							gestureEnabled: true,
							animationDuration: 300,
						}}
					/>
					<Stack.Screen name="+not-found" />
				</Stack>
				<StatusBar style="auto" />
				<ToastContainer />
			</ThemeProvider>
		</QuizProvider>
	);
}
