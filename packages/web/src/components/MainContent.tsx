import { useQuizStore } from '../store/quizStore';
import { QuizEditor } from './QuizEditor';
import { EmptyState } from './EmptyState';

export const MainContent: React.FC = () => {
  const { selectedQuizId, getQuizById } = useQuizStore();

  if (!selectedQuizId) {
    return <EmptyState />;
  }

  const selectedQuiz = getQuizById(selectedQuizId);

  if (!selectedQuiz) {
    return <EmptyState message="Quiz nicht gefunden" />;
  }

  return (
    <main className="flex-1 overflow-hidden">
      <QuizEditor quiz={selectedQuiz} />
    </main>
  );
};