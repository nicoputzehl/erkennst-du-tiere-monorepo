import { QuestionScreen } from "@/quiz/screens/Question/QuestionScreen";
import { useLocalSearchParams } from "expo-router";

export default function QuestionRoute() {
	const { quizId, questionId } = useLocalSearchParams<{
		quizId: string;
		questionId: string;
	}>();

	return (
		<QuestionScreen quizId={quizId || null} questionId={questionId || null} />
	);
}
