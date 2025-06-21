import Header from "@/common/components/Header";
import { useThemeColor } from "@/common/hooks/useThemeColor";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface HeaderAction {
	key: string;
	icon: React.ReactNode;
	onPress: () => void;
	accessibilityHint: string;
	visible?: boolean;
}

interface QuestionHeaderProps {
	title: string;
	hasHints: boolean;
	onHintsPress: () => void;
	onClose: () => void;
	isSolved: boolean;
}

// OCP: Open for extension, closed for modification
const createHeaderActions = (
	hasHints: boolean,
	onHintsPress: () => void,
	onClose: () => void,
	iconColor: string,
): HeaderAction[] => {
	return [
		{
			key: "hints",
			icon: <FontAwesome6 name="lightbulb" size={24} color="gold" />,
			onPress: onHintsPress,
			accessibilityHint: "Öffnet die Seite mit den Hinweisen",
			visible: hasHints,
		},
		{
			key: "close",
			icon: <MaterialCommunityIcons name="close" size={32} color={iconColor} />,
			onPress: onClose,
			accessibilityHint: "Schließt die Frage",
			visible: true,
		},
	].filter((action) => action.visible !== false);
};

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
	title,
	hasHints,
	onHintsPress,
	onClose,
	isSolved = false,
}) => {
	const iconColor = useThemeColor({}, "tintOnGradient");

	// TODO warum wird header Style nicht richtig übergeben
	const titleType = useMemo(
		() => (isSolved ? "title" : "subtitle"),
		[isSolved],
	);

	const actions = useMemo(
		() => createHeaderActions(hasHints, onHintsPress, onClose, iconColor),
		[hasHints, onHintsPress, onClose, iconColor],
	);

	return (
		<Header
			title={title}

			rightSlot={<HeaderActionsRenderer actions={actions} />}

			titleType={titleType}
		/>
	);
};

const HeaderActionsRenderer: React.FC<{ actions: HeaderAction[] }> = ({
	actions,
}) => (
	<View style={styles.headerActions}>
		{actions.map((action) => (
			<TouchableOpacity
				key={action.key}
				onPress={action.onPress}
				style={styles.actionButton}
				accessibilityHint={action.accessibilityHint}
			>
				{action.icon}
			</TouchableOpacity>
		))}
	</View>
);

const styles = StyleSheet.create({
	headerActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	actionButton: {
		padding: 8,
		borderRadius: 20,
	},
});
