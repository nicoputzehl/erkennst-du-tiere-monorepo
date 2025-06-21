import { FontAwesome6 } from "@expo/vector-icons";
import { memo } from "react";
import { View } from "react-native";
import { styles } from "../../QuizCard.styles";

export const LockIcon = memo(() => (
	<View style={styles.iconContainer}>
		<FontAwesome6 name="lock" size={48} color="#6c757d" />
	</View>
));

LockIcon.displayName = "QuizCardLockIcon";
