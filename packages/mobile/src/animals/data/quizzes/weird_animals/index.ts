import type { QuestionBase } from "@/quiz";

export const weirdAnimals: QuestionBase[] = [
	{
		id: 1,
		answer: "Nacktmull",
		images: {
			imageUrl: require("./img/weird_animals-nacktmull.jpg"),
			thumbnailUrl: require("./img/thumbnails/weird_animals-nacktmull.jpg"),
		},
		funFact:
			"Obwohl sie wie winzige Würstchen mit Zähnen aussehen, sind Nacktmulle die einzigen eusoziale Säugetiere - sie leben wie Ameisen in Kolonien mit einer Königin und Arbeitern, die nie fortpflanzen.",
	},
	{
		id: 2,
		answer: "Axolotl",
		images: {
			imageUrl: require("./img/weird_animals-axolotl.jpg"),
			thumbnailUrl: require("./img/thumbnails/weird_animals-axolotl.jpg"),
		},
	},
	{
		id: 3,
		answer: "Fingertier",
		alternativeAnswers: ["Aye-Aye"],
		funFact:
			"Die Aye-Ayes leben in der Dschungel und sind sehr gefragt, weil sie ihre Fäden mit ihren Fingern anziehen und damit ihre Beine bewegen.",
		images: {
			imageUrl: require("./img/weird_animals-aye-aye.jpg"),
			thumbnailUrl: require("./img/thumbnails/weird_animals-aye-aye.jpg"),
		},
	},
	{
		id: 4,
		answer: "Quokka",
		funFact:
			"Die Quokkas leben in Australien und sind einzigartig, weil sie ihre Beine in der Lage haben, sich zu bewegen, indem sie ihre Fäden mit ihren Fingern anziehen.",
		images: {
			imageUrl: require("./img/weird_animals-quokka.jpg"),
			thumbnailUrl: require("./img/thumbnails/weird_animals-quokka.jpg"),
		},
	},
	{
		id: 6,
		answer: "Gottesanbeterin",
		alternativeAnswers: ["Mantis"],
		images: {
			imageUrl: require("./img/weird_animals-gottesanbeterin.jpg"),
			thumbnailUrl: require("./img/thumbnails/weird_animals-gottesanbeterin.jpg"),
		},
	},
	{
		id: 7,
		answer: "Schuppentier",
		alternativeAnswers: ["Pangolin"],
		wikipediaName: "Schuppentiere",
		images: {
			imageUrl: require("./img/weird_animals-schuppentier.jpg"),
			thumbnailUrl: require("./img/thumbnails/weird_animals-schuppentier.jpg"),
		},
	},
	{
		id: 8,
		answer: "Schnabeltier",
		alternativeAnswers: ["Playpus"],
		images: {
			imageUrl: require("./img/weird_animals-schnabeltier.jpg"),
			thumbnailUrl: require("./img/thumbnails/weird_animals-schnabeltier.jpg"),
		},
	},
	{
		id: 9,
		answer: "Dumbo-Oktopuss",
		wikipediaName: "Dumbo-Oktopusse",
		images: {
			imageUrl: require("./img/weird_animals-dumbo_oktopuss.jpg"),
			thumbnailUrl: require("./img/thumbnails/weird_animals-dumbo_oktopuss.jpg"),
		},
	},
	{
		id: 10,
		answer: "Seepferdchen",
		images: {
			imageUrl: require("./img/weird_animals-seepferdchen.jpg"),
			thumbnailUrl: require("./img/thumbnails/weird_animals-seepferdchen.jpg"),
		},
	},
];
