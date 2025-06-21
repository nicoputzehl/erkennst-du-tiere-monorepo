import { useHints } from "@/quiz/store/hooks/useHints";
import { ScrollView, StyleSheet } from "react-native";
import { HintsAvailable } from "./HintsAvailable";
import { HintsReceived }from "./HintsReceived";

interface HintsContentProps {
	quizId: string;
	questionId: string;
}

export const HintsContent: React.FC<HintsContentProps> = ({
	quizId,
	questionId,
}) => {
	const { usedHints } = useHints(quizId, Number.parseInt(questionId));

	return (
		<ScrollView style={styles.container}>
			<HintsReceived hints={usedHints} />
			<HintsAvailable
				quizId={quizId}
				questionId={Number.parseInt(questionId)}
				onHintPurchased={() => {}}
			/>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
});
