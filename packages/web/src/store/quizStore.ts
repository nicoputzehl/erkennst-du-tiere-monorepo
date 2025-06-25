// packages/web/src/store/quizStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {  HintUtils } from '@quiz-app/shared';
import type { AppState, WebQuestion, WebQuizConfig } from '../types';


interface QuizStore extends AppState {
  // Quiz Actions
  addQuiz: (quiz: Omit<WebQuizConfig, 'id'>) => void;
  updateQuiz: (id: string, updates: Partial<WebQuizConfig>) => void;
  deleteQuiz: (id: string) => void;
  duplicateQuiz: (id: string) => void;
  reorderQuizzes: (quizzes: WebQuizConfig[]) => void;
  
  // Question Actions
  addQuestion: (quizId: string, question: Omit<WebQuestion, 'id'>) => void;
  updateQuestion: (quizId: string, questionId: number, updates: Partial<WebQuestion>) => void;
  deleteQuestion: (quizId: string, questionId: number) => void;
  duplicateQuestion: (quizId: string, questionId: number) => void;
  
  // App Actions
  setSelectedQuiz: (quizId: string | null) => void;
  toggleDarkMode: () => void;

  // Utility Functions
  getQuizById: (id: string) => WebQuizConfig | undefined;
  getNextQuestionId: (quizId: string) => number;
  generateQuizId: (title: string) => string;
}

// Utility function to generate clean IDs
const generateId = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD') // Decompose characters into base form and combining characters
    // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
    .replace(/[\u0300-\u036f]/gu, '') // Remove combining characters (accents)
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

// Generate automatic hints for questions
const generateAutomaticHints = (questionId: number) => [
  HintUtils.createLetterCountHint(questionId),
  HintUtils.createFirstLetterHint(questionId)
];

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

        const newQuiz: WebQuizConfig = {
          ...quizData,
          id: uniqueId,
          order: quizData.order ?? quizzes.length + 1,
          questions: quizData.questions || [],
          initiallyLocked: quizData.initiallyLocked ?? false,
          initialUnlockedQuestions: quizData.initialUnlockedQuestions ?? 2
        };

        set({ 
          quizzes: [...quizzes, newQuiz],
          selectedQuizId: uniqueId // Auto-select new quiz
        });
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
        const duplicatedQuiz: WebQuizConfig = {
          ...quiz,
          id: `${quiz.id}_copy`,
          title: `${quiz.title} (Kopie)`,
          order: quizzes.length + 1,
          questions: quiz.questions.map(q => ({
            ...q,
            id: get().getNextQuestionId(`${quiz.id}_copy`), // Generate new IDs for questions
            hints: q.hints ? [...q.hints] : undefined // Deep copy hints
          }))
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
          order: index + 1
        }));
        set({ quizzes: quizzesWithOrder });
      },

      // Question Actions
      addQuestion: (quizId, questionData) => {
        const nextId = get().getNextQuestionId(quizId);
        
        // Generate automatic hints for the question
        const automaticHints = generateAutomaticHints(nextId);
        
        const newQuestion: WebQuestion = {
          ...questionData,
          id: nextId,
          images: questionData.images || { imageUrl: '' },
          hints: [
            ...automaticHints,
            ...(questionData.hints || [])
          ]
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

      duplicateQuestion: (quizId, questionId) => {
        const quiz = get().getQuizById(quizId);
        if (!quiz) return;

        const question = quiz.questions.find(q => q.id === questionId);
        if (!question) return;

        const nextId = get().getNextQuestionId(quizId);
        const automaticHints = generateAutomaticHints(nextId);
        
        const duplicatedQuestion: WebQuestion = {
          ...question,
          id: nextId,
          title: question.title ? `${question.title} (Kopie)` : undefined,
          hints: [
            ...automaticHints,
            ...(question.hints?.filter(h => 
              h.type !== 'letter_count' && h.type !== 'first_letter'
            ) || [])
          ]
        };

        set({
          quizzes: get().quizzes.map(quiz =>
            quiz.id === quizId
              ? { ...quiz, questions: [...quiz.questions, duplicatedQuestion] }
              : quiz
          )
        });
      },

      // App Actions
      setSelectedQuiz: (quizId) => {
        set({ selectedQuizId: quizId });
      },

      toggleDarkMode: () => {
        set({ darkMode: !get().darkMode });
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
      name: 'quiz-editor-storage-v2',
      version: 2,
      // Migration function for version updates

            migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          // Migration logic for old data if needed
          return {
            ...persistedState,
            darkMode: false
          };
        }
        return persistedState;
      }
    }
  )
);