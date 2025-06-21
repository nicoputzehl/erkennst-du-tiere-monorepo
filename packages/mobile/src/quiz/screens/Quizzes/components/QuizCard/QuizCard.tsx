import { useQuiz } from "@/quiz/store/hooks/useQuiz";
import { useQuizzes } from "../../hooks/useQuizzes";
import { QuizCardContent } from "./QuizCardContent";
import { Quiz } from "@quiz-app/shared";

export const QuizCard = ({ quiz }: { quiz: Quiz }) => {
	const { isLoading, navigateToQuiz, getQuizProgress, getQuizProgressString } =
		useQuizzes();

	const { getUnlockProgress, isQuizUnlocked } = useQuiz();

	const isLocked = !isQuizUnlocked(quiz.id);
	const unlockInfo = isLocked ? getUnlockProgress(quiz.id) : undefined;

	return (
		<QuizCardContent
			quiz={quiz}
			variant={isLocked ? "locked" : "active"}
			onPress={!isLocked ? navigateToQuiz : undefined}
			isLoading={!isLocked ? isLoading : false}
			quizCardProgress={!isLocked ? getQuizProgress(quiz.id) : null}
			quizCardProgressString={!isLocked ? getQuizProgressString(quiz.id) : null}
			unlockProgress={unlockInfo}
		/>
	);
};
