import { type PropsWithChildren, memo } from "react";
import {
	Animated,
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
} from "react-native";
import { ImageType, useImageDisplay } from "../../../hooks/useImageDisplay";
import { useKeyboardHandling } from "../hooks/useKeyboardHandling";
import { QuestionImage } from "./QuestionImage";
import { Question } from "@quiz-app/shared";

interface QuestionContentContainerProps extends PropsWithChildren {
	question: Question;
}

export const QuestionContentContainer: React.FC<QuestionContentContainerProps> =
	memo(({ question, children }) => {
		// Ermittle die initiale Breite des Bildschirms für das Bild
		const initialImageWidth =
			Dimensions.get("window").width -
			(styles.imageWrapper.paddingHorizontal || 0) * 2; // Berücksichtige das horizontale Padding
		const { imageSize } = useKeyboardHandling({
			initialImageSize: initialImageWidth,
		});
		const { getImageUrl } = useImageDisplay(question.images, question.status);

		return (
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<View style={{ flex: 1, justifyContent: "space-between" }}>
					<View style={styles.imageWrapper}>
						<Animated.View
							style={[
								styles.imageContainer,
								{ height: imageSize, width: imageSize }, // Breite und Höhe auf imageSize setzen für 1:1 Ratio
							]}
						>
							<QuestionImage
								imageUrl={getImageUrl(ImageType.IMG)}
								thumbnailUrl={getImageUrl(ImageType.THUMBNAIL)}
								animatedHeight={imageSize} // animatedHeight anpassen
							/>
						</Animated.View>
					</View>
					{children}
				</View>
			</KeyboardAvoidingView>
		);
	});

QuestionContentContainer.displayName = "QuestionContentContainer";

const styles = StyleSheet.create({
	imageWrapper: {
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 16,
		width: "100%",
	},
	imageContainer: {
		overflow: "hidden",
		borderRadius: 16,
	},
});
