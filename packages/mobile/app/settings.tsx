import { SettingsScreen } from "@/settings/screens/SettingsScreen";
import { Stack } from "expo-router";

export default function SettingsRoute() {
	return (
		<>
			<Stack.Screen
				options={{
					title: "Einstellungen",
					headerShown: false,
				}}
			/>
			<SettingsScreen />
		</>
	);
}
