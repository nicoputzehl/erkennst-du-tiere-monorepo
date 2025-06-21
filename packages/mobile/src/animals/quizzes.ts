import { QuizUtils } from "../quiz/domain/quiz/";
import { emojiAnimals, namibia, weirdAnimals } from "./data/quizzes";

const namibiaQuiz = {
	id: "namibia",
	title: "Tiere Namibias",
	questions: namibia,
	titleImage: require("./data/quizzes/namibia/img/namibia_title.jpg"),
};

const emojiAnimalsQuiz = {
	id: "emoji_animals",
	title: "Emojis",
	questions: emojiAnimals,
	titleImage: require("./data/quizzes/emoji_animals/img/emoji_title.png"),
};

const weirdAnimalsQuiz = {
	id: "weird_animals",
	title: "Weird Animals",
	questions: weirdAnimals,
	titleImage: require("./data/quizzes/weird_animals/img/weird_animals_title.jpg"),
};

export const animalQuizConfigs = [
	QuizUtils.createQuizConfig(namibiaQuiz, {
		order: 1,
		initiallyLocked: false,
	}),

	QuizUtils.createQuizConfig(emojiAnimalsQuiz, {
		order: 2,
		initiallyLocked: false,
		unlockCondition: QuizUtils.createProgressUnlockCondition(
			"namibia",
			7,
			'Beantworte mindestens 7 Fragen aus dem Quiz "Tiere Namibias" ab, um dieses Quiz freizuschalten.',
		),
	}),
	QuizUtils.createQuizConfig(weirdAnimalsQuiz, {
		order: 3,
		initiallyLocked: true,
		unlockCondition: QuizUtils.createPlaythroughUnlockCondition(
			"emoji_animals",
			'Schließe das Quiz "Emojis" ab, um dieses Quiz freizuschalten.',
		),
	}),
];
