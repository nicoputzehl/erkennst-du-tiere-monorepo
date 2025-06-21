import { ColorsValues } from "@/common/constants/Colors.values";
import { BorderRadius, Shadows } from "@/common/constants/Styles";
import { useColorScheme } from "@/common/hooks/useColorScheme";
import { useThemeColor } from "@/common/hooks/useThemeColor";
import { ImageType, useImageDisplay } from "@/quiz/hooks/useImageDisplay";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Question, QuestionStatus } from "@quiz-app/shared";
import { Image } from "expo-image";
import { memo, useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface QuestionListTileProps {
	item: Question;
	itemWidth: number;
	onClick: (questionId: string) => void;
}

export const QuestionListTile: React.FC<QuestionListTileProps> = memo(
	({ item, itemWidth, onClick }) => {
		const colorScheme = useColorScheme();
		const { getImageUrl } = useImageDisplay(item.images, item.status);
		const isSolved = item.status === QuestionStatus.SOLVED;
		const isInactive = item.status === "inactive";

		// Theme-basierte Farben
		const iconColor = useThemeColor({}, "icon");

		const cardStyle = useMemo(() => {
			return {
				width: itemWidth,
				height: itemWidth,
				backgroundColor: isSolved
					? colorScheme === "dark"
						? "rgba(76, 175, 80, 0.2)"
						: "rgba(76, 175, 80, 0.1)"
					: isInactive
						? colorScheme === "dark"
							? "rgba(158, 158, 158, 0.2)"
							: "hsla(0, 3.80%, 20.40%, 0.16)"
						: colorScheme === "dark"
							? "rgba(255, 255, 255, 0.1)"
							: "rgba(0, 0, 0, 0.05)",
				shadowColor: colorScheme === "dark" ? "#000" : "#000",
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: colorScheme === "dark" ? 0.3 : 0.1,
				shadowRadius: 4,
				elevation: 3,
			};
		}, [isSolved, isInactive, itemWidth, colorScheme]);

		const imageStyle = useMemo(
			() => ({
				width: itemWidth - 4, // Account for border
				height: itemWidth - 4,
				borderRadius: 6,
			}),
			[itemWidth],
		);

		const handleClick = useCallback(() => {
			onClick(item.id.toString());
		}, [onClick, item.id]);

		const renderInactiveCard = () => (
			<View style={[styles.questionCard, cardStyle]}>
				<View style={styles.container}>
					<FontAwesome6
						name="lock"
						size={48}
						color={typeof iconColor === "string" ? iconColor : "gray"}
					/>
				</View>
			</View>
		);

		const renderActiveCard = () => (
			<TouchableOpacity
				style={[styles.questionCard, cardStyle]}
				onPress={handleClick}
				activeOpacity={0.8}
				accessibilityRole="button"
				accessibilityLabel={`Quiz-Frage ${item.id}${
					isSolved ? ", bereits gelöst" : ""
				}`}
			>
				<Image
					source={getImageUrl(ImageType.THUMBNAIL)}
					style={imageStyle}
					contentFit="cover"
					cachePolicy="memory-disk"
					transition={200}
					placeholder={{ blurhash: "LGF5]+Yk^37c.8x]M{s-00?b%NWB" }}
				/>
				{isSolved && (
					<View style={styles.iconOverlay}>
						<View style={styles.triangle} />
						<View style={styles.checkmarkBackground}>
							<MaterialCommunityIcons
								name="trophy-award"
								size={24}
								color="gold"
							/>
						</View>
					</View>
				)}
			</TouchableOpacity>
		);

		return isInactive ? renderInactiveCard() : renderActiveCard();
	},
	(prevProps, nextProps) => {
		return (
			prevProps.item.id === nextProps.item.id &&
			prevProps.item.status === nextProps.item.status &&
			prevProps.item.images.imageUrl === nextProps.item.images.imageUrl &&
			prevProps.item.images.thumbnailUrl ===
				nextProps.item.images.thumbnailUrl &&
			prevProps.item.images.unsolvedImageUrl ===
				nextProps.item.images.unsolvedImageUrl &&
			prevProps.item.images.unsolvedThumbnailUrl ===
				nextProps.item.images.unsolvedThumbnailUrl &&
			prevProps.itemWidth === nextProps.itemWidth &&
			prevProps.onClick === nextProps.onClick
		);
	},
);

QuestionListTile.displayName = "QuestionListTile";
const TRIANGLE_SIZE = 60;
const styles = StyleSheet.create({
	questionCard: {
		borderRadius: BorderRadius.md,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		boxShadow: Shadows.boxShadow,
	},
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	iconOverlay: {
		position: "absolute",
		bottom: 0,
		right: 0,
		justifyContent: "flex-end",
		alignItems: "flex-end",
	},
	checkmarkBackground: {
		backgroundColor: "transparent",
		padding: 6,
		justifyContent: "flex-end",
		alignItems: "flex-end",
	},
	triangle: {
		width: 0,
		height: 0,
		backgroundColor: "transparent",
		borderStyle: "solid",
		borderRightWidth: TRIANGLE_SIZE,
		borderTopWidth: TRIANGLE_SIZE,
		borderRightColor: "transparent",
		borderTopColor: ColorsValues.strawberry,
		transform: [{ rotate: "180deg" }],
		position: "absolute",
	},
});
