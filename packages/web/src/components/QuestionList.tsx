import type React from 'react';
import { Edit3, Trash2, Copy, Image } from 'lucide-react';

import { useQuizStore } from '../store/quizStore';

import type { WebQuizConfig } from '../types';

interface QuestionListProps {
  quiz: WebQuizConfig;
  onEditQuestion: (questionId: number) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({ quiz, onEditQuestion }) => {
  const { deleteQuestion, duplicateQuestion } = useQuizStore();

  const handleDeleteQuestion = (questionId: number) => {
    if (confirm('Sind Sie sicher, dass Sie diese Frage löschen möchten?')) {
      deleteQuestion(quiz.id, questionId);
    }
  };

  const handleDuplicateQuestion = (questionId: number) => {
    duplicateQuestion(quiz.id, questionId);
  };

  const getImagePreview = (imageUrl: File | string) => {
    if (imageUrl instanceof File) {
      return URL.createObjectURL(imageUrl);
    }
    return imageUrl;
  };

  return (
    <div className="space-y-4">
      {quiz.questions.map((question, index) => (
        <div
          key={question.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  {index + 1}
                </span>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {question.title || `Frage ${question.id}`}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Question Details */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Antwort
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {question.answer}
                    </p>
                  </div>

                  {question.alternativeAnswers && question.alternativeAnswers.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Alternative Antworten
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {question.alternativeAnswers.map((alt) => (
                          <span
                            key={alt}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                          >
                            {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.funFact && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Fun Fact
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {question.funFact}
                      </p>
                    </div>
                  )}

                  {question.wikipediaName && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Wikipedia Name
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {question.wikipediaName}
                      </p>
                    </div>
                  )}

                  {/* Hints Section */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Manuelle Hints ({question.hints?.length || 0})
                    </p>
                    {question.hints && question.hints.length > 0 ? (
                      <div className="space-y-2 mt-1">
                        {question.hints.map((hint) => (
                          <div
                            key={hint.id}
                            className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {hint.title}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded">
                                {hint.type}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                              {hint.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Keine manuellen Hints vorhanden
                      </p>
                    )}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                    Bilder
                  </p>
                  <div className="space-y-3">
                    {question.images.imageUrl ? (
                      <div className="relative">
                        <img
                          src={getImagePreview(question.images.imageUrl)}
                          alt="Frage Bild"
                          className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                        />
                        <span className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                          Hauptbild
                        </span>
                      </div>
                    ) : (
                      <div className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center">
                        <div className="text-center text-gray-400 dark:text-gray-500">
                          <Image size={24} className="mx-auto mb-1" />
                          <span className="text-sm">Kein Hauptbild</span>
                        </div>
                      </div>
                    )}

                    {/* Additional Images Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {question.images.thumbnailUrl && (
                        <div className="relative">
                          <img
                            src={getImagePreview(question.images.thumbnailUrl)}
                            alt="Thumbnail"
                            className="w-full h-20 object-cover rounded border border-gray-200 dark:border-gray-600"
                          />
                          <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black bg-opacity-50 text-white text-xs rounded">
                            Thumb
                          </span>
                        </div>
                      )}
                      {question.images.unsolvedImageUrl && (
                        <div className="relative">
                          <img
                            src={getImagePreview(question.images.unsolvedImageUrl)}
                            alt="Ungelöst"
                            className="w-full h-20 object-cover rounded border border-gray-200 dark:border-gray-600"
                          />
                          <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black bg-opacity-50 text-white text-xs rounded">
                            Ungelöst
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                type='button'
                onClick={() => onEditQuestion(question.id)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Bearbeiten"
              >
                <Edit3 size={16} />
              </button>
              <button
                type='button'
                onClick={() => handleDuplicateQuestion(question.id)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Duplizieren"
              >
                <Copy size={16} />
              </button>
              <button
                type='button'
                onClick={() => handleDeleteQuestion(question.id)}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                title="Löschen"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};