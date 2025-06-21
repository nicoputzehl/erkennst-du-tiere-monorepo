import { ErrorComponent } from "@/common/components/ErrorComponent";
import { LoadingComponent } from "@/common/components/LoadingComponent";
import QuizzesScreen from "@/quiz/screens/Quizzes/QuizzesScreen";
import { useLoading } from "@/quiz/store"; // Assuming this provides app-wide loading status
import { useQuiz } from "@/quiz/store/hooks/useQuiz";

export default function QuizzesRoute() {
	const { quizzes } = useQuiz();
	const { isLoading } = useLoading("initialization"); // Still relevant for specific async ops

	console.log(
		`[QuizzesRoute] Rendering. Quizzes count: ${quizzes.length}, IsLoading (from useLoading): ${isLoading}`,
	);

	if (isLoading) {
		return <LoadingComponent message="Zusätzliche Daten werden geladen..." />;
	}

	if (quizzes.length === 0) {
		return (
			<ErrorComponent message="Keine Quizzes gefunden. Bitte App neu starten oder prüfen Sie Ihre Konfiguration." />
		);
	}

	return <QuizzesScreen quizzes={quizzes} />;
}
