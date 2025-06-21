import { Image } from "expo-image";
import { memo } from "react";
import { styles } from "../../QuizCard.styles";
import type { QuizImageProps } from "../../QuizCard.types";

const DEFAULT_TITLE_IMAGE = require("../../../../../../../../assets/images/test-title.jpg");
const PLACEHOLDER_IMAGE = require("../../../../../../../../assets/images/placeholder.jpg");

export const CardImage = memo(({ quiz }: QuizImageProps) => {
	const imageSource = quiz.titleImage ? quiz.titleImage : DEFAULT_TITLE_IMAGE;
	return (
		<Image
			source={imageSource}
			contentFit="cover"
			cachePolicy="memory-disk"
			priority="high"
			placeholder={PLACEHOLDER_IMAGE}
			placeholderContentFit="cover"
			onError={(error) => {
				console.warn(`Failed to load quiz image for ${quiz.id}:`, error);
			}}
			allowDownscaling
			style={styles.image}
		/>
	);
});

CardImage.displayName = "QuizImage";
