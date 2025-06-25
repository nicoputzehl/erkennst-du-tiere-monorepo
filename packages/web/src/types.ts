import type { 
  QuizConfig as SharedQuizConfig, 
  Quiz as SharedQuiz,
  Question as SharedQuestion,
  QuestionBase as SharedQuestionBase,
  QuizImages as SharedQuizImages
} from '@quiz-app/shared';

// Web-specific Image interface with base64 strings
export interface WebQuizImages {
  imageUrl: string; // base64 string
  thumbnailUrl?: string; // base64 string
  unsolvedImageUrl?: string; // base64 string  
  unsolvedThumbnailUrl?: string; // base64 string
}

// Web-specific Question types
export interface WebQuestionBase extends Omit<SharedQuestionBase, 'images'> {
  images: WebQuizImages;
}

export interface WebQuestion extends Omit<SharedQuestion, 'images'> {
  images: WebQuizImages;
}

// Web-specific Quiz types  
export interface WebQuiz extends Omit<SharedQuiz, 'questions' | 'titleImage'> {
  questions: WebQuestionBase[];
  titleImage?: string; // base64 string
}

export interface WebQuizConfig extends Omit<SharedQuizConfig, 'questions' | 'titleImage'> {
  questions: WebQuestion[];
  titleImage?: string; // base64 string
}

// App State Types
export interface AppState {
  quizzes: WebQuizConfig[];
  selectedQuizId: string | null;
  darkMode?: boolean;
}

// Utility type for converting between File and base64
export interface ImageFile {
  file: File;
  base64?: string;
}

// Conversion utilities type
export interface WebToSharedConversion {
  quiz: (webQuiz: WebQuizConfig) => SharedQuizConfig;
  question: (webQuestion: WebQuestion) => SharedQuestion;
  images: (webImages: WebQuizImages) => SharedQuizImages;
}

// App State Types
export interface AppState {
  quizzes: WebQuizConfig[];
  selectedQuizId: string | null;
}

