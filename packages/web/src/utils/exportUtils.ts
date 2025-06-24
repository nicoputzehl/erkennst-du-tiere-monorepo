import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { QuizConfig, Question, Hint } from '../types';
// Die ursprüngliche HintUtils-Klasse wurde bereits in ein Objekt umgewandelt.
// Hier importieren wir sie als solches.
import { HintUtils } from './hintUtils';


interface ExportImage {
  file: File;
  path: string;
  id: number;
}

interface ExportData {
  quizzes: QuizConfig[];
  images: ExportImage[];
}

// Private "Zustand" für die Export-Funktionen
let imageCounter = 1;
const imageMap = new Map<string, number>();

/**
 * Gets or creates an image ID.
 * This is now a private helper function.
 */
function getImageId(file: File): number {
  const fileKey = `${file.name}_${file.size}_${file.lastModified}`;

  if (imageMap.has(fileKey)) {
    return imageMap.get(fileKey)!;
  }

  const id = imageCounter++;
  imageMap.set(fileKey, id);
  return id;
}

/**
 * Sanitizes filename for use in paths.
 * This is now a private helper function.
 */
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
}

/**
 * Gets file extension from filename.
 * This is now a private helper function.
 */
function getFileExtension(filename: string): string {
  return filename.substring(filename.lastIndexOf('.'));
}

/**
 * Processes a single question and its images.
 * This is now a private helper function.
 */
async function processQuestion(
  question: Question,
  quizId: string,
  exportImages: ExportImage[]
): Promise<Question> {
  const processedQuestion = { ...question };

  // Process question images
  const images = { ...question.images };

  if (question.images.imageUrl instanceof File) {
    const imageId = getImageId(question.images.imageUrl);
    const imagePath = `images/${sanitizeFilename(quizId)}/question_${question.id}${getFileExtension(question.images.imageUrl.name)}`;
    exportImages.push({
      file: question.images.imageUrl,
      path: imagePath,
      id: imageId
    });
    images.imageUrl = imageId.toString();
  }

  if (question.images.thumbnailUrl instanceof File) {
    const imageId = getImageId(question.images.thumbnailUrl);
    const imagePath = `images/${sanitizeFilename(quizId)}/question_${question.id}_thumb${getFileExtension(question.images.thumbnailUrl.name)}`;
    exportImages.push({
      file: question.images.thumbnailUrl,
      path: imagePath,
      id: imageId
    });
    images.thumbnailUrl = imageId.toString();
  }

  if (question.images.unsolvedImageUrl instanceof File) {
    const imageId = getImageId(question.images.unsolvedImageUrl);
    const imagePath = `images/${sanitizeFilename(quizId)}/question_${question.id}_unsolved${getFileExtension(question.images.unsolvedImageUrl.name)}`;
    exportImages.push({
      file: question.images.unsolvedImageUrl,
      path: imagePath,
      id: imageId
    });
    images.unsolvedImageUrl = imageId.toString();
  }

  if (question.images.unsolvedThumbnailUrl instanceof File) {
    const imageId = getImageId(question.images.unsolvedThumbnailUrl);
    const imagePath = `images/${sanitizeFilename(quizId)}/question_${question.id}_unsolved_thumb${getFileExtension(question.images.unsolvedThumbnailUrl.name)}`;
    exportImages.push({
      file: question.images.unsolvedThumbnailUrl,
      path: imagePath,
      id: imageId
    });
    images.unsolvedThumbnailUrl = imageId.toString();
  }

  processedQuestion.images = images;

  // Add automatic hints
  const automaticHints = [
    HintUtils.createLetterCountHint(question.id),
    HintUtils.createFirstLetterHint(question.id)
  ] as Hint[];

  processedQuestion.hints = [
    ...automaticHints,
    ...(question.hints || [])
  ];

  return processedQuestion;
}

/**
 * Prepares export data by processing all quizzes and images.
 * This is now a private helper function.
 */
async function prepareExportData(quizzes: QuizConfig[]): Promise<ExportData> {
  const exportImages: ExportImage[] = [];
  const processedQuizzes: QuizConfig[] = [];

  for (const quiz of quizzes) {
    const processedQuiz = { ...quiz };

    // Process quiz title image
    if (quiz.titleImage instanceof File) {
      const imageId = getImageId(quiz.titleImage);
      const imagePath = `images/${sanitizeFilename(quiz.id)}/title${getFileExtension(quiz.titleImage.name)}`;
      exportImages.push({
        file: quiz.titleImage,
        path: imagePath,
        id: imageId
      });
      processedQuiz.titleImage = imageId.toString();
    }

    // Process questions
    processedQuiz.questions = await Promise.all(
      quiz.questions.map(async (question) => processQuestion(question, quiz.id, exportImages))
    );

    processedQuizzes.push(processedQuiz);
  }

  return {
    quizzes: processedQuizzes,
    images: exportImages
  };
}

/**
 * Generates configuration for a single question.
 * This is now a private helper function.
 */
function generateQuestionConfig(question: Question): string {
  const hintsConfig = question.hints?.map(hint => {
    // Hier verwenden wir den vollen Pfad, da HintUtils nun ein importiertes Objekt ist.
    // Achte darauf, dass dies mit dem String-Format des Generators übereinstimmt,
    // das in createLetterCountHint/createFirstLetterHint definiert ist.
    if (hint.type === "dynamic") {
      // Wenn der 'generator' String exakt 'HintUtils.recreateGenerator(HintType.LETTER_COUNT)'
      // sein muss, dann bleibt der String so.
      // Wenn es eine direkte Referenz auf die Funktion sein könnte,
      // müsste hier eine andere Logik greifen.
      return `      ${hint.generator}(${question.id})`;
    }
    return `      ${JSON.stringify(hint, null, 8)}`;
  }).join(',\n') || '';

  const alternativeAnswers = question.alternativeAnswers
    ? `\n      alternativeAnswers: ${JSON.stringify(question.alternativeAnswers)},`
    : '';

  const title = question.title ? `\n      title: "${question.title}",` : '';
  const funFact = question.funFact ? `\n      funFact: "${question.funFact}",` : '';
  const wikipediaName = question.wikipediaName ? `\n      wikipediaName: "${question.wikipediaName}",` : '';

  return `    {
    id: ${question.id},
    answer: "${question.answer}",${alternativeAnswers}${title}${funFact}${wikipediaName}
    images: {
      imageUrl: quizImages[${question.images.imageUrl}],${question.images.thumbnailUrl ? `\n      thumbnailUrl: quizImages[${question.images.thumbnailUrl}],` : ''}${question.images.unsolvedImageUrl ? `\n      unsolvedImageUrl: quizImages[${question.images.unsolvedImageUrl}],` : ''}${question.images.unsolvedThumbnailUrl ? `\n      unsolvedThumbnailUrl: quizImages[${question.images.unsolvedThumbnailUrl}],` : ''}
    },
    hints: [
${hintsConfig}
    ]
  }`;
}

/**
 * Generates configuration for a single quiz.
 * This is now a private helper function.
 */
function generateQuizConfig(quiz: QuizConfig): string {
  // Verwendet die neue Funktion
  const questionsConfig = quiz.questions.map(question => generateQuestionConfig(question)).join(',\n    ');

  return `  {
  id: "${quiz.id}",
  title: "${quiz.title}",
  order: ${quiz.order},
  initiallyLocked: ${quiz.initiallyLocked},
  initialUnlockedQuestions: ${quiz.initialUnlockedQuestions},${quiz.titleImage ? `\n  titleImage: quizImages[${quiz.titleImage}],` : ''}${quiz.unlockCondition ? `\n  unlockCondition: ${JSON.stringify(quiz.unlockCondition, null, 6)},` : ''}
  questions: [
  ${questionsConfig}
  ]
  }`;
}

/**
 * Generates the main TypeScript export file.
 * This is now a private helper function.
 */
function generateTypeScriptFile(exportData: ExportData): string {
  const { quizzes, images } = exportData;

  // Generate image imports
  const imageImports = images.map(img =>
    `  ${img.id}: require('./${img.path}'),`
  ).join('\n');

  // Generate quiz configurations
  const quizConfigs = quizzes.map(quiz => generateQuizConfig(quiz)).join(',\n\n');

  return `// Generated Quiz Export - ${new Date().toISOString()}
// Import this file in your React Native app

import { HintUtils } from './hint-utils';

// Image references for React Native
export const quizImages = {
${imageImports}
};

// Quiz configurations
export const exportedQuizConfigs = [
${quizConfigs}
];

// Export metadata
export const exportMetadata = {
  generatedAt: '${new Date().toISOString()}',
  quizCount: ${quizzes.length},
  questionCount: ${quizzes.reduce((sum, quiz) => sum + sum + quiz.questions.length, 0)},
  imageCount: ${images.length}
};`;
}

/**
 * Generates the hint-utils.ts file for React Native.
 * This is now a private helper function.
 */
function generateHintUtilsFile(): string {
  return `// Hint Utilities for React Native App
// Auto-generated - do not modify

export enum HintType {
  LETTER_COUNT = 'LETTER_COUNT',
  FIRST_LETTER = 'FIRST_LETTER'
}

export interface QuestionBase {
  answer: string;
}

export class HintUtils { // HIER: Die Klasse wird beibehalten, da sie exportiert wird!
  static recreateGenerator = (
    hintType: HintType,
  ): ((question: QuestionBase) => string) => {
    switch (hintType) {
      case HintType.LETTER_COUNT:
        return (question: QuestionBase) =>
          \`Das gesuchte Tier hat \${question.answer.length} Buchstaben\`;
      case HintType.FIRST_LETTER:
        return (question: QuestionBase) =>
          \`Das gesuchte Tier beginnt mit "\${question.answer[0].toUpperCase()}"\`;
      default:
        return () => "Hint nicht verfügbar";
    }
  };
}`;
}

/**
 * Adds all images to the ZIP file.
 * This is now a private helper function.
 */
async function addImagesToZip(zip: JSZip, images: ExportImage[]): Promise<void> {
  for (const image of images) {
    zip.file(image.path, image.file);
  }
}




// Main export function - creates ZIP with TypeScript file and images
async function exportQuizzes(quizzes: QuizConfig[]): Promise<void> {
  if (quizzes.length === 0) {
    alert('Keine Quizzes zum Exportieren vorhanden.');
    return;
  }

  try {
    // Reset counters - direkter Zugriff auf die "privaten" Variablen
    imageCounter = 1;
    imageMap.clear();

    // Prepare export data
    const exportData = await prepareExportData(quizzes);

    // Create ZIP file
    const zip = new JSZip();

    // Add TypeScript configuration file
    const tsContent = generateTypeScriptFile(exportData);
    zip.file('quiz-export.ts', tsContent);

    // Add hint utilities file
    const hintUtilsContent = generateHintUtilsFile(); // Aufrufen der lokalen Funktion
    zip.file('hint-utils.ts', hintUtilsContent);

    // Add images to ZIP
    await addImagesToZip(zip, exportData.images);

    // Generate and download ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `quiz-export-${new Date().toISOString().split('T')[0]}.zip`);

    console.log('Export completed successfully!');
  } catch (error) {
    console.error('Export failed:', error);
    alert('Export fehlgeschlagen. Bitte versuchen Sie es erneut.');
  }
}

// Exportiere die Hauptfunktion und alle internen Helfer als Teil eines Objekts
export const ExportUtils = {
  exportQuizzes,
  // Die anderen Funktionen werden nicht direkt exportiert, da sie "private" Helfer sind.
  // Wenn du sie doch direkt exportieren möchtest, kannst du sie hier hinzufügen:
  // prepareExportData,
  // processQuestion,
  // generateTypeScriptFile,
  // generateQuizConfig,
  // generateQuestionConfig,
  // generateHintUtilsFile,
  // addImagesToZip,
  // getImageId,
  // sanitizeFilename,
  // getFileExtension,
} as const;