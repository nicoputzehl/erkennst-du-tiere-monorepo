// packages/web/src/hooks/useQuizValidation.ts
import { QuizUtils, HintUtils } from '@quiz-app/shared';
import type { WebQuizConfig, WebQuestion } from '../types';

export interface QuizValidationErrors {
  title?: string;
  description?: string;
  order?: string;
  initialUnlockedQuestions?: string;
  titleImage?: string;
  questions?: string;
  unlockCondition?: string;
}

export interface QuestionValidationErrors {
  answer?: string;
  alternativeAnswers?: string;
  images?: string;
  hints?: string;
  funFact?: string;
  wikipediaName?: string;
  title?: string;
}

export const useQuizValidation = () => {
  const validateQuizForm = (quiz: Partial<WebQuizConfig>): QuizValidationErrors => {
    const errors: QuizValidationErrors = {};

    // Title validation (required field from shared Quiz interface)
    if (!quiz.title || quiz.title.trim().length === 0) {
      errors.title = 'Titel ist erforderlich';
    } else if (quiz.title.trim().length < 3) {
      errors.title = 'Titel muss mindestens 3 Zeichen lang sein';
    } else if (quiz.title.trim().length > 100) {
      errors.title = 'Titel darf maximal 100 Zeichen lang sein';
    }

    // Order validation (optional field from QuizConfig)
    if (quiz.order !== undefined && (quiz.order < 1 || quiz.order > 1000)) {
      errors.order = 'Reihenfolge muss zwischen 1 und 1000 liegen';
    }

    // initialUnlockedQuestions validation (from QuizConfig)
    if (quiz.initialUnlockedQuestions !== undefined) {
      if (quiz.initialUnlockedQuestions < 1) {
        errors.initialUnlockedQuestions = 'Mindestens 1 Frage muss initial freigeschaltet sein';
      } else if (quiz.initialUnlockedQuestions > 50) {
        errors.initialUnlockedQuestions = 'Maximal 50 Fragen können initial freigeschaltet werden';
      } else if (quiz.questions && quiz.initialUnlockedQuestions > quiz.questions.length) {
        errors.initialUnlockedQuestions = 'Kann nicht mehr Fragen freischalten als vorhanden sind';
      }
    }

    // Questions validation (QuestionBase[] from shared types)
    if (quiz.questions) {
      if (quiz.questions.length === 0) {
        errors.questions = 'Mindestens eine Frage ist erforderlich';
      } else if (quiz.questions.length > 100) {
        errors.questions = 'Maximal 100 Fragen pro Quiz erlaubt';
      }
      
      // Validate individual questions using shared domain logic
      const invalidQuestions = quiz.questions.filter(q => !isQuestionValid(q));
      if (invalidQuestions.length > 0) {
        errors.questions = `${invalidQuestions.length} Frage(n) enthalten Fehler`;
      }
    }

    // unlockCondition validation (UnlockCondition from shared types)
    if (quiz.unlockCondition) {
      if (!quiz.unlockCondition.type || !quiz.unlockCondition.description) {
        errors.unlockCondition = 'Freischaltbedingung ist unvollständig';
      }
    }

    return errors;
  };

  const validateQuestion = (question: Partial<WebQuestion>): QuestionValidationErrors => {
    const errors: QuestionValidationErrors = {};

    // answer validation (required field from QuestionBase)
    if (!question.answer || question.answer.trim().length === 0) {
      errors.answer = 'Antwort ist erforderlich';
    } else if (question.answer.trim().length < 1) {
      errors.answer = 'Antwort muss mindestens 1 Zeichen lang sein';
    } else if (question.answer.trim().length > 100) {
      errors.answer = 'Antwort darf maximal 100 Zeichen lang sein';
    }

    // alternativeAnswers validation (string[] from QuestionBase)
    if (question.alternativeAnswers && question.alternativeAnswers.length > 0) {
      const hasInvalidAlternative = question.alternativeAnswers.some(alt => 
        !alt || alt.trim().length === 0 || alt.trim().length > 100
      );
      if (hasInvalidAlternative) {
        errors.alternativeAnswers = 'Alternative Antworten dürfen nicht leer und maximal 100 Zeichen lang sein';
      }

      // Check for duplicates using shared QuizUtils
      if (question.answer) {
        const allAnswers = [question.answer, ...question.alternativeAnswers];
        const hasDuplicates = allAnswers.some((answer, index) => 
          allAnswers.slice(index + 1).some(otherAnswer => 
            QuizUtils.isAnswerCorrect(answer, otherAnswer)
          )
        );
        if (hasDuplicates) {
          errors.alternativeAnswers = 'Antworten dürfen sich nicht doppeln (auch phonetisch ähnliche)';
        }
      }
    }

    // images validation (QuizImages from shared types, but WebQuizImages here)
    if (!question.images?.imageUrl) {
      errors.images = 'Hauptbild ist erforderlich';
    }

    // funFact validation (optional field from QuestionBase)
    if (question.funFact && question.funFact.length > 1000) {
      errors.funFact = 'Fun Fact darf maximal 1000 Zeichen lang sein';
    }

    // wikipediaName validation (optional field from QuestionBase)
    if (question.wikipediaName && question.wikipediaName.length > 200) {
      errors.wikipediaName = 'Wikipedia Name darf maximal 200 Zeichen lang sein';
    }

    // title validation (optional field from QuestionBase)
    if (question.title && question.title.length > 200) {
      errors.title = 'Titel darf maximal 200 Zeichen lang sein';
    }

    // hints validation (Hint[] from QuestionBase)
    if (question.hints && question.hints.length > 0) {
      const hasInvalidHint = question.hints.some(hint => {
        // Basic hint structure validation
        if (!hint.id || !hint.type) return true;
        
        // Type-specific validation using HintUtils type guards
        if (HintUtils.isAutoFreeHint(hint) && hint.triggerAfterAttempts === undefined) return true;
        if (HintUtils.isContextualHint(hint) && (!hint.triggers || hint.triggers.length === 0)) return true;
        
        return false;
      });
      
      if (hasInvalidHint) {
        errors.hints = 'Ein oder mehrere Hints sind ungültig konfiguriert';
      }
    }

    return errors;
  };

  const isQuizValid = (quiz: Partial<WebQuizConfig>): boolean => {
    const errors = validateQuizForm(quiz);
    return Object.keys(errors).length === 0;
  };

  const isQuestionValid = (question: Partial<WebQuestion>): boolean => {
    const errors = validateQuestion(question);
    return Object.keys(errors).length === 0;
  };

  // Test answer correctness using shared domain logic
  const testAnswer = (userAnswer: string, correctAnswer: string, alternatives?: string[]): boolean => {
    return QuizUtils.isAnswerCorrect(userAnswer, correctAnswer, alternatives);
  };

  // Generate automatic hints using shared domain logic
  const generateAutomaticHints = (questionId: number) => [
    HintUtils.createLetterCountHint(questionId),
    HintUtils.createFirstLetterHint(questionId)
  ];

  return {
    validateQuizForm,
    validateQuestion,
    isQuizValid,
    isQuestionValid,
    testAnswer,
    generateAutomaticHints,
  };
};
