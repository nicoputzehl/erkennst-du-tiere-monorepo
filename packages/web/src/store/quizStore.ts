import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';
import type { Question, QuizConfig } from '@quiz-app/shared';


interface QuizStore extends AppState {
  // Quiz Actions
  addQuiz: (quiz: Omit<QuizConfig, 'id' | 'order'>) => void;
  updateQuiz: (id: string, updates: Partial<QuizConfig>) => void;
  deleteQuiz: (id: string) => void;
  duplicateQuiz: (id: string) => void;
  reorderQuizzes: (quizzes: QuizConfig[]) => void;
  
  // Question Actions
  addQuestion: (quizId: string, question: Omit<Question, 'id'>) => void;
  updateQuestion: (quizId: string, questionId: number, updates: Partial<Question>) => void;
  deleteQuestion: (quizId: string, questionId: number) => void;
  
  // App Actions
  setSelectedQuiz: (quizId: string | null) => void;

  // Utility Functions
  getQuizById: (id: string) => QuizConfig | undefined;
  getNextQuestionId: (quizId: string) => number;
  generateQuizId: (title: string) => string;
}

const generateId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      // Initial State
      quizzes: [],
      selectedQuizId: null,
      darkMode: false,

      // Quiz Actions
      addQuiz: (quizData) => {
        const quizzes = get().quizzes;
        const id = generateId(quizData.title);
        
        // Ensure unique ID
        let uniqueId = id;
        let counter = 1;
        while (quizzes.some(q => q.id === uniqueId)) {
          uniqueId = `${id}_${counter}`;
          counter++;
        }

        const newQuiz: QuizConfig = {
          ...quizData,
          id: uniqueId,
          order: quizzes.length,
          questions: quizData.questions || []
        };

        set({ quizzes: [...quizzes, newQuiz] });
      },

      updateQuiz: (id, updates) => {
        set({
          quizzes: get().quizzes.map(quiz =>
            quiz.id === id ? { ...quiz, ...updates } : quiz
          )
        });
      },

      deleteQuiz: (id) => {
        const quizzes = get().quizzes.filter(quiz => quiz.id !== id);
        const selectedQuizId = get().selectedQuizId === id ? null : get().selectedQuizId;
        set({ quizzes, selectedQuizId });
      },

      duplicateQuiz: (id) => {
        const quiz = get().getQuizById(id);
        if (!quiz) return;

        const quizzes = get().quizzes;
        const duplicatedQuiz: QuizConfig = {
          ...quiz,
          id: `${quiz.id}_copy`,
          title: `${quiz.title} (Kopie)`,
          order: quizzes.length
        };

        // Ensure unique ID
        let uniqueId = duplicatedQuiz.id;
        let counter = 1;
        while (quizzes.some(q => q.id === uniqueId)) {
          uniqueId = `${quiz.id}_copy_${counter}`;
          counter++;
        }
        duplicatedQuiz.id = uniqueId;

        set({ quizzes: [...quizzes, duplicatedQuiz] });
      },

      reorderQuizzes: (reorderedQuizzes) => {
        const quizzesWithOrder = reorderedQuizzes.map((quiz, index) => ({
          ...quiz,
          order: index
        }));
        set({ quizzes: quizzesWithOrder });
      },

      // Question Actions
      addQuestion: (quizId, questionData) => {
        const nextId = get().getNextQuestionId(quizId);
        const newQuestion: Question = {
          ...questionData,
          id: nextId,
          images: questionData.images || { imageUrl: '' }
        };

        set({
          quizzes: get().quizzes.map(quiz =>
            quiz.id === quizId
              ? { ...quiz, questions: [...quiz.questions, newQuestion] }
              : quiz
          )
        });
      },

      updateQuestion: (quizId, questionId, updates) => {
        set({
          quizzes: get().quizzes.map(quiz =>
            quiz.id === quizId
              ? {
                  ...quiz,
                  questions: quiz.questions.map(question =>
                    question.id === questionId ? { ...question, ...updates } : question
                  )
                }
              : quiz
          )
        });
      },

      deleteQuestion: (quizId, questionId) => {
        set({
          quizzes: get().quizzes.map(quiz =>
            quiz.id === quizId
              ? {
                  ...quiz,
                  questions: quiz.questions.filter(question => question.id !== questionId)
                }
              : quiz
          )
        });
      },

      // App Actions
      setSelectedQuiz: (quizId) => {
        set({ selectedQuizId: quizId });
      },


      // Utility Functions
      getQuizById: (id) => {
        return get().quizzes.find(quiz => quiz.id === id);
      },

      getNextQuestionId: (quizId) => {
        const quiz = get().getQuizById(quizId);
        if (!quiz || quiz.questions.length === 0) return 1;
        return Math.max(...quiz.questions.map(q => q.id)) + 1;
      },

      generateQuizId: (title) => {
        return generateId(title);
      }
    }),
    {
      name: 'quiz-editor-storage',
      version: 1
    }
  )
);