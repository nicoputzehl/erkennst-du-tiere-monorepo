import { useState, useEffect } from "react";
import { useQuizValidation, type QuizValidationErrors } from "../hooks/useQuizValidation";
import { useQuizStore } from "../store/quizStore";
import type { WebQuizConfig } from "../types";

interface QuizFormProps {
  quiz?: WebQuizConfig;
  onSave?: (quiz: WebQuizConfig) => void;
  onCancel?: () => void;
}

export const QuizForm: React.FC<QuizFormProps> = ({ quiz, onSave, onCancel }) => {
  const { addQuiz, updateQuiz } = useQuizStore();
  const { validateQuizForm, isQuizValid, generateAutomaticHints } = useQuizValidation();
  
  const [formData, setFormData] = useState<Partial<WebQuizConfig>>({
    title: quiz?.title || '',
    order: quiz?.order || 1,
    initiallyLocked: quiz?.initiallyLocked || false,
    initialUnlockedQuestions: quiz?.initialUnlockedQuestions || 2,
    questions: quiz?.questions || [],
    titleImage: quiz?.titleImage || undefined,
  });

  const [errors, setErrors] = useState<QuizValidationErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof QuizValidationErrors, boolean>>>({});

  // Real-time validation
  useEffect(() => {
    const validationErrors = validateQuizForm(formData);
    setErrors(validationErrors);
  }, [formData, validateQuizForm]);

  const handleInputChange = (field: keyof WebQuizConfig, value: string | number | boolean | string[] | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields: (keyof QuizValidationErrors)[] = ['title', 'order', 'initialUnlockedQuestions'];
    setTouched(Object.fromEntries(allFields.map(field => [field, true])));

    if (!isQuizValid(formData)) {
      return;
    }

    const quizData = formData as Omit<WebQuizConfig, 'id'>;

    // Add automatic hints to all questions using shared domain logic
    if (quizData.questions && quizData.questions.length > 0) {
      quizData.questions = quizData.questions.map(question => ({
        ...question,
        hints: [
          ...generateAutomaticHints(question.id),
          ...(question.hints || [])
        ]
      }));
    }

    if (quiz?.id) {
      // Update existing quiz
      updateQuiz(quiz.id, quizData);
      onSave?.(quiz);
    } else {
      // Create new quiz
      addQuiz(quizData);
      onSave?.(formData as WebQuizConfig);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        handleInputChange('titleImage', base64);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const showError = (field: keyof QuizValidationErrors) => touched[field] && errors[field];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {quiz ? 'Quiz bearbeiten' : 'Neues Quiz erstellen'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title (required field from Quiz interface) */}
        <div>
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Titel *
          </p>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              showError('title') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Z.B. Tiere Namibias"
          />
          {showError('title') && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
        </div>

        {/* Title Image Upload (titleImage from Quiz interface) */}
        <div>
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Titelbild
          </p>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500">
            <div className="space-y-1 text-center">
              {formData.titleImage ? (
                <div className="relative">
                  <img
                    src={formData.titleImage}
                    alt="Quiz Titelbild"
                    className="mx-auto h-32 w-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange('titleImage', undefined)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <title>Hochladen</title>
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <div className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Datei hochladen</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="sr-only"
                      />
                    </div>
                    <p className="pl-1">oder ziehen und ablegen</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF bis 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Order and Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order (from QuizConfig) */}
          <div>
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reihenfolge
            </p>
            <input
              type="number"
              min="1"
              value={formData.order || 1}
              onChange={(e) => handleInputChange('order', Number.parseInt(e.target.value))}
              onBlur={() => setTouched(prev => ({ ...prev, order: true }))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                showError('order') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {showError('order') && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.order}</p>
            )}
          </div>

          {/* initialUnlockedQuestions (from QuizConfig) */}
          <div>
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Initial freigeschaltete Fragen
            </p>
            <input
              type="number"
              min="1"
              value={formData.initialUnlockedQuestions || 2}
              onChange={(e) => handleInputChange('initialUnlockedQuestions', Number.parseInt(e.target.value))}
              onBlur={() => setTouched(prev => ({ ...prev, initialUnlockedQuestions: true }))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                showError('initialUnlockedQuestions') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {showError('initialUnlockedQuestions') && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.initialUnlockedQuestions}</p>
            )}
          </div>
        </div>

        {/* initiallyLocked Checkbox (from QuizConfig) */}
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.initiallyLocked || false}
              onChange={(e) => handleInputChange('initiallyLocked', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Quiz initial gesperrt (muss erst freigeschaltet werden)
            </span>
          </div>
        </div>

        {/* Questions Summary (questions from Quiz interface) */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fragen ({formData.questions?.length || 0})
          </h3>
          {formData.questions && formData.questions.length > 0 ? (
            <ul className="space-y-1">
              {formData.questions.slice(0, 3).map((question, index) => (
                <li key={question.id} className="text-sm text-gray-600 dark:text-gray-400">
                  {index + 1}. {question.answer?.substring(0, 50)}...
                </li>
              ))}
              {formData.questions.length > 3 && (
                <li className="text-sm text-gray-500 dark:text-gray-500">
                  ... und {formData.questions.length - 3} weitere
                </li>
              )}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Noch keine Fragen hinzugefügt. Fragen können nach dem Speichern hinzugefügt werden.
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700"
            >
              Abbrechen
            </button>
          )}
          <button
            type="submit"
            disabled={!isQuizValid(formData)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
          >
            {quiz ? 'Quiz aktualisieren' : 'Quiz erstellen'}
          </button>
        </div>
      </form>
    </div>
  );
};