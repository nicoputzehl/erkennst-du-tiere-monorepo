import { ErrorComponent } from "@/common/components/ErrorComponent";
import { HintsScreen } from "@/quiz/screens/Hints/HintsScreen";
import { useLocalSearchParams } from "expo-router";

export default function HintsModalRoute() {
	const { quizId, questionId } = useLocalSearchParams<{
		quizId: string;
		questionId: string;
	}>();

	if (!quizId || !questionId) {
		return <ErrorComponent message="Quiz oder Frage-ID fehlt" />;
	}

	return <HintsScreen quizId={quizId} questionId={questionId} />;
}
