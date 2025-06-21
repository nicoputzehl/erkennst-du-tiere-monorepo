
import { QuestionBase } from "@quiz-app/shared";
import { HintUtils } from "@quiz-app/shared";

export const emojiAnimals: QuestionBase[] = [
	{
		id: 1,
		answer: "Stachelschwein",
		funFact: "Stachelschweine, wenn sie sich bedroht fühlen, ihre Stacheln aufstellen und mit ihnen rasselnde Geräusche erzeugen können, um Fressfeinde abzuschrecken? Sie tun dies, indem sie spezielle, hohle Rasselstacheln am Schwanz vibrieren lassen!",
		title: "Nicht anfassen.",
		images: {
			imageUrl: require("./img/stachelschwein.png"),
			thumbnailUrl: require("./img/thumbnails/stachelschwein.png"),
		},
		wikipediaName: "Stachelschweine",
		hints: [
			HintUtils.createLetterCountHint(1),
			HintUtils.createFirstLetterHint(1),
			HintUtils.createContextualHint(
				1,
				["igel"],
				"Richtung stimmt.", { title: "ja, aber nein." }
			),
		]
	},
	{
		id: 2,
		answer: "Kaiserpinguin",
		funFact: "Kaiserpinguine bis zu 20 Minuten lang unter Wasser bleiben und dabei Tiefen von über 500 Metern erreichen können, um Nahrung zu jagen? Das macht sie zu wahren Tauchmeistern unter den Vögeln!",
		title: "Royal",
		images: {
			imageUrl: require("./img/kaiserpinguin.png"),
			thumbnailUrl: require("./img/thumbnails/kaiserpinguin.png"),
		},
		hints: [
			HintUtils.createLetterCountHint(2),
			HintUtils.createFirstLetterHint(2),
			HintUtils.createContextualHint(
				2,
				["pinguin"],
				"Ich weiß, dass kannst du besser.", { title: "Ernsthaft?!" }
			),
			HintUtils.createContextualHint(
				2,
				["königspinguin", "königs-pinguin"],
				"Guter Versuch! Aber denk mal nach: Der berühmte römische Herrscher Augustus. War der ein König?", { title: "Ganz kanpp..." }
			),
		]
	},
	{
		id: 3,
		title: "Giftig",
		answer: "Klapperschlange",
		funFact: "das charakteristische Rasseln einer Klapperschlange nicht durch das Schütteln des Schwanzes selbst, sondern durch trockene, hohle Hornringe am Schwanzende erzeugt wird? Bei jeder Häutung kommt ein neuer Ring hinzu, aber alte Ringe können abbrechen, sodass man ihr Alter nicht einfach an der Anzahl der Ringe ablesen kann.",
		images: {
			imageUrl: require("./img/klapperschlange.png"),
			thumbnailUrl: require("./img/thumbnails/klapperschlange.png"),
		},
		wikipediaName: "Klapperschlangen",
		hints: [
			HintUtils.createLetterCountHint(3),
			HintUtils.createFirstLetterHint(3),
		]
	},
	{
		id: 4,
		answer: "Buntspecht",
		title: "Klopf, klopf.",
		funFact: "Buntspechte bis zu 12.000 Mal pro Tag mit dem Kopf gegen Baumstämme hämmern können, ohne dabei Gehirnerschütterungen zu bekommen? Ihr Schädel ist speziell gebaut, um diese enormen Kräfte abzufedern!",
		alternativeAnswers: ["Specht"],
		images: {
			imageUrl: require("./img/buntspecht.png"),
			thumbnailUrl: require("./img/thumbnails/buntspecht.png"),
		},
	},
	{
		id: 5,
		answer: "Narwal",
		title: "Meersebewohner",
		funFact: "der charakteristische 'Stoßzahn' des Narwals eigentlich ein extrem langer, aus dem Kiefer herauswachsender Zahn ist, der bis zu 3 Meter lang werden kann? Er ist nicht nur ein beeindruckendes Merkmal, sondern auch ein hochsensibles Organ, das dem Narwal hilft, sich in seiner eisigen Umgebung zu orientieren und Nahrung zu finden.",
		images: {
			imageUrl: require("./img/narwal.png"),
			thumbnailUrl: require("./img/thumbnails/narwal.png"),
		},
		hints: [
			HintUtils.createLetterCountHint(5),
			HintUtils.createFirstLetterHint(5),
			HintUtils.createContextualHint(
				1,
				["igel"],
				"Aber auch ein Säugetier", { title: "Leider nicht." }
			),
			HintUtils.createAutoFreeHint(5, "KEIN Fisch", 5, "Leider nicht.")
		]
	},
	{
		id: 6,
		answer: "Zitteraal",
		title: "Erdung ist wichtig.",
		funFact: "der Zitteraal elektrische Schläge von bis zu 600 Volt und 1 Ampere erzeugen kann, was ausreicht, um ein Pferd bewusstlos zu machen oder einen Menschen zu betäuben? Er nutzt diese Fähigkeit nicht nur zur Verteidigung, sondern auch, um Beute zu jagen, indem er sie lähmt.",
		images: {
			imageUrl: require("./img/zitteraal.png"),
			thumbnailUrl: require("./img/thumbnails/zitteraal.png"),
		},
		wikipediaName: "Zitteraale",
		hints: [
			HintUtils.createLetterCountHint(6),
			HintUtils.createFirstLetterHint(6),
			HintUtils.createAutoFreeHint(6, "EIN Fisch", 3, "Rate weiter."),
			HintUtils.createAutoFreeHint(6, "Der Wurm soll an die Körperform erinnern.", 5, "Ok, noch ein Tipp.")
		]
	},
	{
		id: 7,
		title: "'Arschschnell!'",
		answer: "Wüstenrennmaus",

		funFact: "Wüstenrennmäuse ihren Wasserbedarf fast ausschließlich über die Nahrung decken und kaum trinken müssen? Sie sind perfekt an das Leben in trockenen Gebieten angepasst und produzieren extrem wenig Urin, um Wasser zu sparen.",
		images: {
			imageUrl: require("./img/wuestenrennmaus.png"),
			thumbnailUrl: require("./img/thumbnails/wuestenrennmaus.png"),
		},
		wikipediaName: "Rennmäuse",
		hints: [
			HintUtils.createLetterCountHint(7),
			HintUtils.createFirstLetterHint(7),
			HintUtils.createContextualHint(7, ["rennmaus"], "Aber WO rennt sie?", { title: "Gleich gelöst." }),
			HintUtils.createContextualHint(7, ["maus"], "Aber WO und WIE?", { title: "Obvious." }),

		]
	},
	{
		id: 8,
		title: "Regenwaldbewohner:in",
		answer: "Okapi",
		funFact: "die Zunge eines Okapis so lang ist, dass es sich damit sogar die Ohren putzen kann? Sie ist bis zu 30 Zentimeter lang und auch perfekt dafür geeignet, Blätter und Knospen von Bäumen zu zupfen.",
		alternativeAnswers: ["Waldgiraffe", "Kurzhalsgiraffe"],
		images: {
			imageUrl: require("./img/okapi.png"),
			thumbnailUrl: require("./img/thumbnails/okapi.png"),
		},
		hints: [
			HintUtils.createLetterCountHint(8),
			HintUtils.createFirstLetterHint(8),
		]
	},
	{
		id: 9,
		answer: "Beutelteufel",
		title: "Taz",
		funFact: "dass der Beutelteufel ein so starkes Gebiss hat, dass er Knochen mit Leichtigkeit zermahlen kann? Im Verhältnis zu seiner Körpergröße hat er sogar die stärkste Beißkraft aller Säugetiere!",
		alternativeAnswers: ["Tasmanischer Teufel"],
		images: {
			imageUrl: require("./img/tasmanischer_teufel.png"),
			thumbnailUrl: require("./img/thumbnails/tasmanischer_teufel.png"),
		},
	},
];
