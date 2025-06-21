import type { Hint } from "./hint";
import type { QuizImages } from "./image";

export enum QuestionStatus {
	INACTIVE = "inactive",
	ACTIVE = "active",
	SOLVED = "solved",
}

export interface QuestionBase {
	id: number;
	images: QuizImages;
	answer: string;
	alternativeAnswers?: string[];
	funFact?: string;
	wikipediaName?: string;
	title?: string;
	hints?: Hint[];
}

export interface Question extends QuestionBase {
	status: QuestionStatus;
}
