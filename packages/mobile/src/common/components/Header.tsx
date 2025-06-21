import { StyleSheet, type TextStyle, View, type ViewStyle } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";
import NavigateBack from "./NavigateBack";
import { ThemedText } from "./ThemedText";

type TitleType = "title" | "link" | "defaultSemiBold" | "default" | "subtitle";

type HeaderProps = {
	title?: string;
	leftSlot?: React.ReactNode;
	rightSlot?: React.ReactNode;
	showBackButton?: boolean;
	onBackPress?: () => void;
	backButtonText?: string;
	titleType?: TitleType;
	titleStyle?: TextStyle;
};

const Header = ({
	title,
	leftSlot,
	rightSlot,
	showBackButton = false,
	onBackPress,
	backButtonText = "Zurück",
	titleType = "subtitle",
	titleStyle,
}: HeaderProps) => {
	const textColor = useThemeColor({}, "tintOnGradient");
	const iconColor = useThemeColor({}, "tintOnGradient");

	// Bestimme das Layout basierend auf den vorhandenen Props
	const getLayoutConfig = () => {
		const hasTitle = !!title;
		const hasLeftSlot = !!leftSlot || showBackButton;
		const hasRightSlot = !!rightSlot;

		if (hasTitle && hasLeftSlot && hasRightSlot) {
			// title, rightSlot und leftSlot vorhanden: 20%, 60%, 20% - justify center
			return {
				justifyContent: "center" as const,
				leftWidth: "20%" as const,
				titleWidth: "60%" as const,
				rightWidth: "20%" as const,
			};
		}
		if (!hasTitle && hasLeftSlot && hasRightSlot) {
			// kein title, beide slots: 40%, 40% - space-between
			return {
				justifyContent: "space-between" as const,
				leftWidth: "40%" as const,
				titleWidth: undefined,
				rightWidth: "40%" as const,
			};
		}
		if (hasLeftSlot && hasTitle && !hasRightSlot) {
			// nur leftSlot und title: 20%, 60% - flex-start
			return {
				justifyContent: "flex-start" as const,
				leftWidth: "20%" as const,
				titleWidth: "60%" as const,
				rightWidth: undefined,
			};
		}
		if (!hasLeftSlot && hasTitle && hasRightSlot) {
			// nur rightSlot und title: 60%, 20% - flex-end
			return {
				justifyContent: "flex-end" as const,
				leftWidth: undefined,
				titleWidth: "60%" as const,
				rightWidth: "20%" as const,
			};
		}
		if (hasLeftSlot && !hasTitle && !hasRightSlot) {
			// nur leftSlot: 40% - flex-start
			return {
				justifyContent: "flex-start" as const,
				leftWidth: "40%" as const,
				titleWidth: undefined,
				rightWidth: undefined,
			};
		}
		if (!hasLeftSlot && !hasTitle && hasRightSlot) {
			// nur rightSlot: 40% - flex-end
			return {
				justifyContent: "flex-end" as const,
				leftWidth: undefined,
				titleWidth: undefined,
				rightWidth: "40%" as const,
			};
		}
		if (!hasLeftSlot && hasTitle && !hasRightSlot) {
			// nur title: center
			return {
				justifyContent: "center" as const,
				leftWidth: undefined,
				titleWidth: "100%" as const,
				rightWidth: undefined,
			};
		}

		// Fallback
		return {
			justifyContent: "center" as const,
			leftWidth: undefined,
			titleWidth: "100%" as const,
			rightWidth: undefined,
		};
	};

	const layoutConfig = getLayoutConfig();

	const createDynamicStyles = (): {
		header: ViewStyle;
		leftSlot?: ViewStyle;
		titleContainer?: ViewStyle;
		rightSlot?: ViewStyle;
	} => ({
		header: {
			justifyContent: layoutConfig.justifyContent,
		},
		...(layoutConfig.leftWidth && {
			leftSlot: {
				width: layoutConfig.leftWidth,
			},
		}),
		...(layoutConfig.titleWidth && {
			titleContainer: {
				width: layoutConfig.titleWidth,
			},
		}),
		...(layoutConfig.rightWidth && {
			rightSlot: {
				width: layoutConfig.rightWidth,
			},
		}),
	});

	const dynamicStyles = createDynamicStyles();

	// Bestimme den Inhalt des linken Slots
	const getLeftSlotContent = () => {
		if (showBackButton && onBackPress) {
			return (
				<NavigateBack
					onPress={onBackPress}
					text={backButtonText}
					iconColor={iconColor}
					textColor={textColor}
				/>
			);
		}
		return leftSlot;
	};

	const hasLeftContent = !!(leftSlot || showBackButton);
	const hasRightContent = !!rightSlot;

	return (
		<View style={[styles.header, dynamicStyles.header]}>
			{hasLeftContent && (
				<View style={[styles.slot, dynamicStyles.leftSlot]}>
					{getLeftSlotContent()}
				</View>
			)}
			{title && (
				<View style={[styles.titleContainer, dynamicStyles.titleContainer]}>
					<ThemedText
						type={titleType}
						numberOfLines={1}
						style={[styles.headerTitle, { color: textColor }, titleStyle]}
					>
						{title}
					</ThemedText>
				</View>
			)}
			{hasRightContent && (
				<View style={[styles.slot, dynamicStyles.rightSlot]}>{rightSlot}</View>
			)}
		</View>
	);
};

export default Header;

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 8,
	},
	titleContainer: {
		alignItems: "center",
	},
	headerTitle: {
		textAlign: "center",
	},
	slot: {
		justifyContent: "center",
	},
});
