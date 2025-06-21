import { ThemedText } from "@/common/components/ThemedText";
import { useThemeColor } from "@/common/hooks/useThemeColor";
import { View } from "react-native";
import sharedHintstyles from "./Hints.styles";
import { UsedHint } from "@quiz-app/shared";

type HintsReceivedProps = {
	hints: UsedHint[];
};

export const HintsReceived = ({ hints }: HintsReceivedProps) => {
	const borderColor = useThemeColor({}, "success");
	if (hints.length === 0) {
		return null;
	}
	return (
		<View>
			{hints.map((hint) => (
				<View
					key={hint.id}
					style={[
						sharedHintstyles.card,
						sharedHintstyles.receivedHint,
						{ borderColor },
					]}
				>
					<ThemedText type="subtitle" style={sharedHintstyles.hintTitle}>
						{hint.title}
					</ThemedText>
					<ThemedText style={sharedHintstyles.hintDescription}>
						{hint.content}
					</ThemedText>
				</View>
			))}
		</View>
	);
};

