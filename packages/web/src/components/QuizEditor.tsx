import type React from 'react';
import { useState } from 'react';
import { Plus, Settings, HelpCircle } from 'lucide-react';

import { QuestionList } from './QuestionList';
import { QuestionForm } from './QuestionForm';
import type { QuizConfig } from '@quiz-app/shared';

interface QuizEditorProps {
  quiz: QuizConfig;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({ quiz }) => {

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

  const handleAddQuestion = () => {
    setEditingQuestionId(null);
    setShowQuestionForm(true);
  };

  const handleEditQuestion = (questionId: number) => {
    setEditingQuestionId(questionId);
    setShowQuestionForm(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Quiz Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {quiz.title}
            </h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{quiz.questions.length} Fragen</span>
              <span>•</span>
              <span>ID: {quiz.id}</span>
              {quiz.initiallyLocked && (
                <>
                  <span>•</span>
                  <span className="flex items-center">
                    <Settings size={14} className="mr-1" />
                    Gesperrt
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
              <HelpCircle size={14} className="inline mr-1" />
              Letter Count und First Letter Hints werden automatisch generiert
            </div>
            <button
            type='button'
              onClick={handleAddQuestion}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <Plus size={16} />
              <span>Neue Frage</span>
            </button>
          </div>
        </div>

        {quiz.unlockCondition && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <Settings size={14} className="inline mr-1" />
              {quiz.unlockCondition.description}
            </p>
          </div>
        )}
      </div>

      {/* Questions Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {quiz.questions.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Noch keine Fragen vorhanden
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Erstellen Sie die erste Frage für dieses Quiz
            </p>
            <button
            type='button'
              onClick={handleAddQuestion}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <Plus size={16} />
              <span>Erste Frage erstellen</span>
            </button>
          </div>
        ) : (
          <QuestionList 
            quiz={quiz} 
            onEditQuestion={handleEditQuestion}
          />
        )}
      </div>

      {/* Question Form Modal */}
      {showQuestionForm && (
        <QuestionForm
          quizId={quiz.id}
          questionId={editingQuestionId}
          onClose={() => {
            setShowQuestionForm(false);
            setEditingQuestionId(null);
          }}
        />
      )}
    </div>
  );
};