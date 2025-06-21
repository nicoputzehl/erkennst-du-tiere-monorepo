import { usePulsingAnimation } from "@/quiz/hooks/usePulsingAnimation";
import type { PropsWithChildren } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { getQuizCardStyles } from "../getQuizCardStyle";
type QuizCardContentWrapperProps = PropsWithChildren & {
	isNewCard: boolean;
	isLoading: boolean;
};
export const ContentWrapper = ({
	isLoading,
	isNewCard,
	children,
}: QuizCardContentWrapperProps) => {
	const { animatedStyle } = usePulsingAnimation(isNewCard);
	const quizCardStyle = getQuizCardStyles({ variant: "active", isLoading });

	const CardWrapper = isNewCard ? Animated.View : View;
	const wrapperStyle = isNewCard
		? [quizCardStyle, animatedStyle]
		: quizCardStyle;

	return <CardWrapper style={wrapperStyle}>{children}</CardWrapper>;
};
