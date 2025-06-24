import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';

import { ImageUpload } from './ImageUpload';


interface QuizFormProps {
  quizId?: string | null;
  onClose: () => void;
}

interface FormData {
  title: string;
  initiallyLocked: boolean;
  initialUnlockedQuestions: number;
  unlockCondition?: {
    type: 'playthrough' | 'progress';
    requiredQuizId: string;
    requiredQuestionsSolved?: number;
    description: string;
  };
}

export const QuizForm: React.FC<QuizFormProps> = ({ quizId, onClose }) => {
  const {
    quizzes,
    addQuiz,
    updateQuiz,
    getQuizById,

  } = useQuizStore();


  const isEditing = Boolean(quizId);
  const existingQuiz = quizId ? getQuizById(quizId) : null;

  // Title image state
  const [titleImage, setTitleImage] = useState<File | string | null>(
    existingQuiz?.titleImage || null
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: existingQuiz?.title || '',
      initiallyLocked: existingQuiz?.initiallyLocked || false,
      initialUnlockedQuestions: existingQuiz?.initialUnlockedQuestions || 1,
      unlockCondition: existingQuiz?.unlockCondition
    }
  });

  const watchInitiallyLocked = watch('initiallyLocked');
  const availableQuizzes = quizzes.filter(q => q.id !== quizId);

  useEffect(() => {
    if (existingQuiz) {
      reset({
        title: existingQuiz.title,
        initiallyLocked: existingQuiz.initiallyLocked,
        initialUnlockedQuestions: existingQuiz.initialUnlockedQuestions,
        unlockCondition: existingQuiz.unlockCondition
      });
      setTitleImage(existingQuiz.titleImage || null);
    }
  }, [existingQuiz, reset]);

  const onSubmit = (data: FormData) => {
    const quizData = {
      title: data.title,
      titleImage: titleImage || undefined,
      initiallyLocked: data.initiallyLocked,
      initialUnlockedQuestions: data.initialUnlockedQuestions,
      unlockCondition: data.unlockCondition
    };

    if (isEditing && quizId) {
      updateQuiz(quizId, quizData);
    } else {
      addQuiz({
        ...quizData,
        questions: []
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Quiz bearbeiten' : 'Neues Quiz erstellen'}
          </h2>
          <button
            type='button'
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quiz-Titel *
            </p>
            <input
              {...register('title', { required: 'Titel ist erforderlich' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Quiz-Titel eingeben"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Anfangs freigeschaltete Fragen
            </p>
            <input
              {...register('initialUnlockedQuestions', {
                required: 'Anzahl ist erforderlich',
                min: { value: 1, message: 'Mindestens 1 Frage muss freigeschaltet sein' }
              })}
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.initialUnlockedQuestions && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.initialUnlockedQuestions.message}
              </p>
            )}
          </div>

          <ImageUpload
            label="Quiz-Titelbild (optional)"
            currentImage={titleImage || undefined}
            onImageChange={(file) => setTitleImage(file)}
            placeholder="Titelbild für das Quiz"
            maxSize={5}
          />

          <div className="flex items-center">
            <input
              {...register('initiallyLocked')}
              type="checkbox"
              id="initiallyLocked"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="initiallyLocked" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Quiz ist anfangs gesperrt
            </label>
          </div>

          {watchInitiallyLocked && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Freischaltbedingungen
              </h3>

              <div>
                <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Freischaltungstyp
                </p>
                <select
                  {...register('unlockCondition.type')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Typ wählen</option>
                  <option value="playthrough">Komplettes Quiz absolvieren</option>
                  <option value="progress">Bestimmte Anzahl Fragen lösen</option>
                </select>
              </div>

              <div>
                <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Benötigtes Quiz
                </p>
                <select
                  {...register('unlockCondition.requiredQuizId')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Quiz wählen</option>
                  {availableQuizzes.map(quiz => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Beschreibung
                </p>
                <input
                  {...register('unlockCondition.description')}
                  type="text"
                  placeholder="z.B. 'Löse erst das Tier-Quiz'"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              Abbrechen
            </button>
            <button

              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
            >
              {isEditing ? 'Aktualisieren' : 'Erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};