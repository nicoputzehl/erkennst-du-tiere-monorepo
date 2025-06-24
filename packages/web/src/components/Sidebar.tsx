import { useState } from 'react';
import { Plus, Settings, Trash2, Copy, Edit3 } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';
import { QuizForm } from './QuizForm';


export const Sidebar: React.FC = () => {
  const { 
    quizzes, 
    selectedQuizId, 
    setSelectedQuiz, 
    deleteQuiz, 
    duplicateQuiz 
  } = useQuizStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<string | null>(null);

  const handleNewQuiz = () => {
    setEditingQuiz(null);
    setShowForm(true);
  };

  const handleEditQuiz = (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingQuiz(quizId);
    setShowForm(true);
  };

  const handleDeleteQuiz = (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Sind Sie sicher, dass Sie dieses Quiz löschen möchten?')) {
      deleteQuiz(quizId);
    }
  };

  const handleDuplicateQuiz = (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateQuiz(quizId);
  };

  const sortedQuizzes = [...quizzes].sort((a, b) => a.order - b.order);

  const getImagePreview = (image: File | string) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image;
  };

  return (
    <>
      <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
          type='button'
            onClick={handleNewQuiz}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus size={16} />
            <span>Neues Quiz</span>
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Quizzes ({quizzes.length})
          </h2>

          <div className="space-y-2">
            {sortedQuizzes.map((quiz) => (
              <button
              type="button"
                key={quiz.id}
                onClick={() => setSelectedQuiz(quiz.id)}
                className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedQuizId === quiz.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {quiz.titleImage && (
                      <img
                        src={getImagePreview(quiz.titleImage)}
                        alt={quiz.title}
                        className="w-12 h-12 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {quiz.questions.length} Fragen
                        {quiz.initiallyLocked && ' • Gesperrt'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                    type='button'
                      onClick={(e) => handleEditQuiz(quiz.id, e)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Bearbeiten"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                    type='button'
                      onClick={(e) => handleDuplicateQuiz(quiz.id, e)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Duplizieren"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                    type='button'
                      onClick={(e) => handleDeleteQuiz(quiz.id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Löschen"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {quiz.unlockCondition && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Settings size={12} className="inline mr-1" />
                    {quiz.unlockCondition.description}
                  </div>
                )}
              </button>
            ))}

            {quizzes.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm">Noch keine Quizzes vorhanden</p>
                <p className="text-xs mt-1">Klicken Sie auf "Neues Quiz" um zu starten</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {showForm && (
        <QuizForm
          quizId={editingQuiz}
          onClose={() => {
            setShowForm(false);
            setEditingQuiz(null);
          }}
        />
      )}
    </>
  );
};