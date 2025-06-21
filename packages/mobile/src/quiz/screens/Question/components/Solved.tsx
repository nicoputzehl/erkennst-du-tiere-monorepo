import { ThemedText } from "@/common/components/ThemedText";
import { useThemeColor } from "@/common/hooks/useThemeColor";
import { WikipediaLink } from "@/quiz/screens/Question/components/WikipediaLink";
import { StyleSheet, View } from "react-native";
import { DelayedLottie } from "./DelayedLottie";
import { Question } from "@quiz-app/shared";

export interface SolvedProps {
	question: Question;
	justSolved: boolean;
}

const Solved = ({ question, justSolved: statusChanged }: SolvedProps) => {
	const wikipediaSlug = question.wikipediaName || question.answer;

	return (
		<View style={styles.container}>
			<DelayedLottie shouldPlay={statusChanged} delay={500} />
			<View style={styles.content}>
				{question.funFact && <FunFactSection funFact={question.funFact} />}
				<WikipediaSection slug={wikipediaSlug} />
			</View>
		</View>
	);
};

const FunFactSection = ({ funFact }: { funFact: string }) => {
	const textColor = useThemeColor({}, "tintOnGradient");
	return (
		<View>
			<ThemedText
				style={[styles.funFactHeader, { color: textColor }]}
				type="title"
			>
				Wusstest du das ...
			</ThemedText>
			<ThemedText style={[styles.funFact, { color: textColor }]}>
				{funFact}
			</ThemedText>
		</View>
	);
};

const WikipediaSection = ({ slug }: { slug: string }) => (
	<View style={styles.wikipediaLinkContainer}>
		<WikipediaLink slug={slug} />
	</View>
);

export default Solved;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		position: "relative",
	},
	content: {
		flex: 1,
	},
	funFact: {
		fontSize: 20,
		marginBottom: 20,
		lineHeight: 24,
	},
	funFactHeader: {
		marginBottom: 10,
	},
	wikipediaLinkContainer: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "flex-end",
	},
});
