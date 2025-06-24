import type { QuizConfig } from "@quiz-app/shared";

// App State Types
export interface AppState {
  quizzes: QuizConfig[];
  selectedQuizId: string | null;
}

