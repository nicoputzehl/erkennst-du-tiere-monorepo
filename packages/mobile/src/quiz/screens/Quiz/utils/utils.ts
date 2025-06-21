import { Dimensions } from "react-native";
import { QUIZ_LAYOUT } from "../constants/constants";

export const calculateItemWidth = () => {
	const { width: screenWidth } = Dimensions.get("window");
	const { numColumns, padding, listPadding, gap } = QUIZ_LAYOUT;
	const availableWidth = screenWidth - padding * 2 - listPadding * 2;
	return (availableWidth - gap * (numColumns - 1)) / numColumns;
};
