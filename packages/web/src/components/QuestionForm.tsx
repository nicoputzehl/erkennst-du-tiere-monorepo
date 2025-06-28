import  { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';

import { ImageUpload } from './ImageUpload';

interface QuestionFormProps {
  quizId: string;
  questionId?: number | null;
  onClose: () => void;
}

interface FormData {
  answer: string;
  title?: string;
  alternativeAnswers: string;
  funFact?: string;
  wikipediaName?: string;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  quizId,
  questionId,
  onClose
}) => {
  const {
    addQuestion,
    updateQuestion,
    getQuizById
  } = useQuizStore();

  const isEditing = Boolean(questionId);
  const quiz = getQuizById(quizId);
  const existingQuestion = questionId
    ? quiz?.questions.find(q => q.id === questionId)
    : null;

  // Image states
  const [mainImage, setMainImage] = useState<File | string | null>(
    existingQuestion?.images.imageUrl || null
  );
  const [thumbnailImage, setThumbnailImage] = useState<File | string | null>(
    existingQuestion?.images.thumbnailUrl || null
  );
  const [unsolvedImage, setUnsolvedImage] = useState<File | string | null>(
    existingQuestion?.images.unsolvedImageUrl || null
  );
  const [unsolvedThumbnailImage, setUnsolvedThumbnailImage] = useState<File | string | null>(
    existingQuestion?.images.unsolvedThumbnailUrl || null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      answer: existingQuestion?.answer || '',
      title: existingQuestion?.title || '',
      alternativeAnswers: existingQuestion?.alternativeAnswers?.join(', ') || '',
      funFact: existingQuestion?.funFact || '',
      wikipediaName: existingQuestion?.wikipediaName || ''
    }
  });

  useEffect(() => {
    if (existingQuestion) {
      reset({
        answer: existingQuestion.answer,
        title: existingQuestion.title || '',
        alternativeAnswers: existingQuestion.alternativeAnswers?.join(', ') || '',
        funFact: existingQuestion.funFact || '',
        wikipediaName: existingQuestion.wikipediaName || ''
      });

      // Update image states
      setMainImage(existingQuestion.images.imageUrl || null);
      setThumbnailImage(existingQuestion.images.thumbnailUrl || null);
      setUnsolvedImage(existingQuestion.images.unsolvedImageUrl || null);
      setUnsolvedThumbnailImage(existingQuestion.images.unsolvedThumbnailUrl || null);
    }
  }, [existingQuestion, reset]);

  const onSubmit = (data: FormData) => {
    const alternativeAnswersArray = data.alternativeAnswers
      ? data.alternativeAnswers.split(',').map(s => s.trim()).filter(s => s)
      : [];

    const questionData = {
      answer: data.answer,
      title: data.title || undefined,
      alternativeAnswers: alternativeAnswersArray.length > 0 ? alternativeAnswersArray : undefined,
      funFact: data.funFact || undefined,
      wikipediaName: data.wikipediaName || undefined,
      images: {
        imageUrl: mainImage || '',
        thumbnailUrl: thumbnailImage || undefined,
        unsolvedImageUrl: unsolvedImage || undefined,
        unsolvedThumbnailUrl: unsolvedThumbnailImage || undefined
      }
    };

    if (isEditing && questionId) {
      updateQuestion(quizId, questionId, questionData);
    } else {
      addQuestion(quizId, questionData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Frage bearbeiten' : 'Neue Frage erstellen'}
          </h2>
          <button
type='button'
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Antwort *
            </p>
            <input
              {...register('answer', { required: 'Antwort ist erforderlich' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Die richtige Antwort eingeben"
            />
            {errors.answer && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.answer.message}
              </p>
            )}
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titel (optional)
            </p>
            <input
              {...register('title')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Titel für die Frage"
            />
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alternative Antworten
            </p>
            <input
              {...register('alternativeAnswers')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Alternative Antworten (mit Komma getrennt)"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Mehrere Antworten mit Komma trennen, z.B.: "Lion, Löwe, King of Animals"
            </p>
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fun Fact (optional)
            </p>
            <textarea
              {...register('funFact')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Interessante Fakten zur Antwort"
            />
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wikipedia Name (optional)
            </p>
            <input
              {...register('wikipediaName')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Name des Wikipedia-Artikels"
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Bilder
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ImageUpload
                label="Hauptbild *"
                currentImage={mainImage || undefined}
                onImageChange={(file) => setMainImage(file)}
                placeholder="Hauptbild für die Frage"
              />

              <ImageUpload
                label="Thumbnail (optional)"
                currentImage={thumbnailImage || undefined}
                onImageChange={(file) => setThumbnailImage(file)}
                placeholder="Kleines Vorschaubild"
              />

              <ImageUpload
                label="Ungelöst-Bild (optional)"
                currentImage={unsolvedImage || undefined}
                onImageChange={(file) => setUnsolvedImage(file)}
                placeholder="Bild für ungelöste Frage"

              />

              <ImageUpload
                label="Ungelöst-Thumbnail (optional)"
                currentImage={unsolvedThumbnailImage || undefined}
                onImageChange={(file) => setUnsolvedThumbnailImage(file)}
                placeholder="Thumbnail für ungelöste Frage"


                maxSize={5}
              />
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Tipp:</strong> Das Hauptbild ist erforderlich. Bilder werden automatisch komprimiert und optimiert.
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 Letter Count und First Letter Hints werden automatisch beim Export generiert
            </p>
          </div>

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
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Aktualisieren' : 'Erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};