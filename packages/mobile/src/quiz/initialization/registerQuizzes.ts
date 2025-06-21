import { QuizConfig } from "@quiz-app/shared";
import { useQuizStore } from "../store/Store";

/**
 * Simplified quiz registration - replaces the complex utils/index.ts approach
 */
export function registerQuizzes(configs: QuizConfig[]) {
	const store = useQuizStore.getState();

	console.log(`[QuizInit] Registering ${configs.length} quiz configs`);

	for (const config of configs) {
		console.log(`[QuizInit] Registering quiz: ${config.id}`);
		store.registerQuiz(config);
	}

	console.log(
		`[QuizInit] All ${configs.length} quizzes registered successfully`,
	);
}

/**
 * Initialize all quiz states - call this once on app start
 */
export async function initializeAllQuizzes() {
	const store = useQuizStore.getState();
	const quizIds = Object.keys(store.quizzes);

	console.log(`[QuizInit] Initializing ${quizIds.length} quiz states`);

	for (const quizId of quizIds) {
		store.initializeQuizState(quizId);
	}

	console.log(`[QuizInit] All quiz states initialized`);
}
