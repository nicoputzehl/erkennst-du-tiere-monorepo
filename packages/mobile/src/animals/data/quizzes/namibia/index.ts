import {
	createAutoFreeHint,
	createContextualHint,
	createCustomHint,
	createFirstLetterHint,
	createLetterCountHint,
} from "@/quiz/domain/hints/factories";
import { QuestionBase } from "@quiz-app/shared";

export const namibia: QuestionBase[] = [
	{
		id: 1,
		answer: "Leopard",
		title: "Ein sehr beliebtes Muster",
		funFact:
			"Leoparden Beute hochziehen können, die doppelt so schwer ist wie sie selbst - eine 90kg-Antilope 6 Meter hoch auf einen Baum!",
		images: {
			imageUrl: require("./img/leopard.jpg"),
			thumbnailUrl: require("./img/thumbnails/leopard.jpg"),
			unsolvedImageUrl: require("./img/leopard_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/leopard_unsolved.jpg"),
		},
		hints: [
			createLetterCountHint(1),
			createFirstLetterHint(1),
			createCustomHint(
				1,
				"Lebensraum",
				"Dieses Tier ist ein hervorragender Kletterer.",
				15,
			),
			createCustomHint(
				1,
				"Aussehen",
				"Hat ein goldgelbes Fell mit schwarzen Rosetten.",
				12,
			),
			createContextualHint(
				1,
				["jaguar"],
				"Richtige Richtung! Aber lebt in Afrika, nicht Südamerika.",
			),
			createContextualHint(
				1,
				["gepard", "cheetah"],
				"Auch gefleckt, aber diese Katze kann sehr gut klettern!",
				{
					title: "Nicht ganz so schnell!",
				}
			),
			createContextualHint(
				1,
				["löwe", "loewe", "lion"],
				"Falsche Großkatze - das gesuchte Tier hat Flecken!",
			),
			createContextualHint(
				1,
				["tiger"],
				"Falsche Großkatze - das gesuchte Tier lebt in Afrika!",
			),
			createAutoFreeHint(
				1,
				"Diese gefleckte Großkatze ist für ihre Kletterfähigkeiten bekannt.",
			),
		],
	},
	{
		id: 2,
		answer: "Flusspferd",
		title: "Schau mir ins Auge, kleines",
		alternativeAnswers: ["Nilpferd", "Hippopotamus"],
		funFact:
			"Flusspferde näher mit Walen  als mit anderen Landtieren verwandt sind - beide stammen von denselben urzeitlichen Meeresvorfahren ab.",
		images: {
			imageUrl: require("./img/nilpferd.jpg"),
			thumbnailUrl: require("./img/thumbnails/nilpferd.jpg"),
			unsolvedImageUrl: require("./img/nilpferd_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/nilpferd_unsolved.jpg"),
		},
		hints: [
			createLetterCountHint(2),
			createFirstLetterHint(2),
			createAutoFreeHint(2, "Ich bin ein großes Säugetier, das viel Zeit im Wasser verbringt und dessen Name 'Pferd des Flusses' Flussbedeutet.", 7)
		],
	},

	{
		id: 3,
		answer: "Flamingo",
		title: "Kein Stock.",
		funFact:
			"Flamingos werden nur durch bestimmte Algen und Krebstiere rosa - in Gefangenschaft verblassen sie ohne spezielle Nahrung wieder zu grau-weiß!",
		images: {
			imageUrl: require("./img/flamingo.jpg"),
			thumbnailUrl: require("./img/thumbnails/flamingo.jpg"),
			unsolvedImageUrl: require("./img/flamingo_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/flamingo_unsolved.jpg"),
		},
		hints: [
			createLetterCountHint(3),
			createFirstLetterHint(3),
			createAutoFreeHint(2, "Ich bin ein Stelzvogel, bekannt für meine leuchtende Farbe und dass ich oft auf einem Bein stehe.", 4)
		],
	},
	{
		id: 4,
		answer: "Löwe",
		title: "Erstmal strecken...",
		funFact:
			"Löwen die einzigen Katzen sind, die in Rudeln leben - alle anderen Großkatzen sind Einzelgänger!",
		images: {
			imageUrl: require("./img/loewe.jpg"),
			thumbnailUrl: require("./img/thumbnails/loewe.jpg"),
			unsolvedImageUrl: require("./img/loewe_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/loewe_unsolved.jpg"),
		},
		hints: [
			createLetterCountHint(4),
			createFirstLetterHint(4),
			createAutoFreeHint(4, "Man nennt mich auch den König der Tiere.")
		],
	},
	// TODO: evtl später wieder hinzufügen
	// {
	// 	id: 5,
	// 	answer: "Oryxantilope",
	// 	alternativeAnswers: ["Oryx"],
	// 	funFact:
	// 		"Oryxantilopen können monatelang ohne Wasser überleben und ihren Wasserbedarf komplett aus der Nahrung decken, selbst in der Sahara.",
	// 	images: {
	// 		imageUrl: require("./img/oryxantilope.jpg"),
	// 		thumbnailUrl: require("./img/thumbnails/oryxantilope.jpg"),
	// 		unsolvedImageUrl: require("./img/oryxantilope_unsolved.jpg"),
	// 		unsolvedThumbnailUrl: require("./img/thumbnails/oryxantilope_unsolved.jpg"),
	// 	},
	// },
	{
		id: 6,
		answer: "Nashorn",
		title: "Ein Dickhäuter.",
		funFact:
			"Nashörner trotz ihrer massigen Erscheinung überraschend schlechte Augen haben, können aber dafür auf 50 km/h beschleunigen!",
		images: {
			imageUrl: require("./img/nashorn.jpg"),
			thumbnailUrl: require("./img/thumbnails/nashorn.jpg"),
			unsolvedImageUrl: require("./img/nashorn_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/nashorn_unsolved.jpg"),
		},
		hints: [
			createLetterCountHint(6),
			createFirstLetterHint(6),
			createAutoFreeHint(6, "Den Namensgebenden Teil meines Gesichts kann man nicht sehen.")
		],
	},
	{
		id: 7,
		answer: "Zebra",
		title: "Das ist leicht",
		funFact:
			"alle Zebras ein einzigartiges Streifenmuster haben - wie ein Fingerabdruck ist kein Zebra dem anderen gleich!",
		images: {
			imageUrl: require("./img/zebra.jpg"),
			thumbnailUrl: require("./img/thumbnails/zebra.jpg"),
			unsolvedImageUrl: require("./img/zebra_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/zebra_unsolved.jpg"),
		},
		hints: [
			createLetterCountHint(7),
			createFirstLetterHint(7),
			createAutoFreeHint(6, "Ich bin mit Pferden verwandt.")
		],
	},
	{
		id: 8,
		answer: "Strauss",
		title: "Ein Vogel.",
		funFact:
			"Strauße nicht fliegen können, aber dafür mit bis zu 70 km/h rennen und dabei 4 Meter weite Schritte machen.",
		images: {
			imageUrl: require("./img/strauss.jpg"),
			thumbnailUrl: require("./img/thumbnails/strauss.jpg"),
			unsolvedImageUrl: require("./img/strauss_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/strauss_unsolved.jpg"),
		},
		hints: [
			createLetterCountHint(8),
			createFirstLetterHint(8),
			createAutoFreeHint(8, "Steck mal nicht den Kopf in den Sand.")
		],
	},
	// {
	// 	id: 9,
	// 	answer: "Südafrikanischer-Seebär",
	// 	alternativeAnswers: ["Seebär"],
	// 	funFact:
	// 		"Südafrikanische Seebären können ihre Hinterflossen nach vorne drehen und dadurch als einzige Robbenart richtig 'laufen' statt nur robben.",
	// 	images: {
	// 		imageUrl: require("./img/suedafrikanischer-seebaer.jpg"),
	// 		thumbnailUrl: require("./img/thumbnails/suedafrikanischer-seebaer.jpg"),
	// 		unsolvedImageUrl: require("./img/suedafrikanischer-seebaer_unsolved.jpg"),
	// 		unsolvedThumbnailUrl: require("./img/thumbnails/suedafrikanischer-seebaer_unsolved.jpg"),
	// 	},
	// },
	{
		id: 10,
		answer: "Elefant",
		title: "Nicht die Zebras im Hintergrund!",
		funFact:
			"Afrikanische Elefanten mit ihren Füßen Erdbeben spüren können, die hunderte Kilometer entfernt stattfinden - so kommunizieren Herden über weite Distanzen.",
		images: {
			imageUrl: require("./img/elefant.jpg"),
			thumbnailUrl: require("./img/thumbnails/elefant.jpg"),
			unsolvedImageUrl: require("./img/elefant_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/elefant_unsolved.jpg"),
		},
		hints: [
			createLetterCountHint(10),
			createFirstLetterHint(10),
			createAutoFreeHint(10, "Tööröö", 3)
		],
	},
	// {
	// 	id: 11,
	// 	answer: "Steenbock",
	// 	alternativeAnswers: ["Steinböckchen", "Steinbock"],
	// 	funFact:
	// 		"Steinböcke sind so kleine Antilopen, dass sie sich bei Gefahr regungslos hinlegen und dank ihrer braunen Farbe praktisch unsichtbar werden.",
	// 	images: {
	// 		imageUrl: require("./img/steenbock.jpg"),
	// 		thumbnailUrl: require("./img/thumbnails/steenbock.jpg"),
	// 		unsolvedImageUrl: require("./img/steenbock_unsolved.jpg"),
	// 		unsolvedThumbnailUrl: require("./img/thumbnails/steenbock_unsolved.jpg"),
	// 	},
	// },
	{
		id: 12,
		answer: "Kap-Borstenhörnchen",
		title: "Wer könnte ich sein.",
		alternativeAnswers: ["Borstenhörnchen"],
		funFact:
			"Kap-Borstenhörnchen mit ihrem buschigen Schwanz wie mit einem Sonnenschirm wedeln, um sich vor der afrikanischen Hitze zu schützen!",
		images: {
			imageUrl: require("./img/kap-borstenhoernchen.jpg"),
			thumbnailUrl: require("./img/thumbnails/kap-borstenhoernchen.jpg"),
			unsolvedImageUrl: require("./img/kap-borstenhoernchen_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/kap-borstenhoernchen_unsolved.jpg"),
		},
		hints: [
			createLetterCountHint(12),
			createFirstLetterHint(12),
			createContextualHint(12, ["Erdmännchend"], "Die gesuchten Tieren bilden sogar manchmal WGs mit Erdmännchen.", { title: "Könnte man meinen" }),
			createContextualHint(12, ["Eichhörnchen", "Streifenhörnchen", "Hörnchen"], "Hönrchen ist schonmal nicht schlecht.", { title: "Fast...." })
		],
	},
	{
		id: 13,
		answer: "Giraffe",
		title: "Hallo da unten",
		funFact:
			"Giraffen nur 7 Halswirbel haben - genau so viele wie Menschen, obwohl ihr Hals 2 Meter lang ist!",
		images: {
			imageUrl: require("./img/giraffe.jpg"),
			thumbnailUrl: require("./img/thumbnails/giraffe.jpg"),
			unsolvedImageUrl: require("./img/giraffe_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/giraffe_unsolved.jpg"),
		},
		hints: [
			createLetterCountHint(13),
			createFirstLetterHint(13),
			createAutoFreeHint(13, "Schwer zu erkennen. Aber versuch mal das Muster zu erkennen.", 3),
			createAutoFreeHint(13, "Die Zunge des gesuchten Tieres kann 45-50 Zentimeter lang werden und ist oft bläulich-violett gefärbt", 6)
		],
	},
	{
		id: 14,
		answer: "Warzenschwein",
		title: "Hakuna Matata!",
		funFact:
			"Warzenschweine bei Gefahr rückwärts in ihre Höhlen laufen, um mit den scharfen Hauern voran jeden Angreifer abzuwehren.",
		images: {
			imageUrl: require("./img/warzenschwein.jpg"),
			thumbnailUrl: require("./img/thumbnails/warzenschwein.jpg"),
			unsolvedImageUrl: require("./img/warzenschwein_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/warzenschwein_unsolved.jpg"),
		},

		hints: [
			createLetterCountHint(14),
			createFirstLetterHint(14),
			createAutoFreeHint(14, "Nicht Timon!", 3)
		],
	},
	{
		id: 15,
		answer: "Gelbschnabeltoko",
		title:"Nashornvogel.",
		funFact:
			"der Gelbschnabeltoko eine clevere Partnerschaft mit Zwergmangusten eingeht? Der Vogel warnt die Mangusten vor Gefahren, während diese bei der Jagd Insekten und Beute für ihn aufscheuchen. Eine echte Teamarbeit in der Wildnis!",
		images: {
			imageUrl: require("./img/gelbschnabeltoko.jpg"),
			thumbnailUrl: require("./img/thumbnails/gelbschnabeltoko.jpg"),
			unsolvedImageUrl: require("./img/gelbschnabeltoko_unsolved.jpg"),
			unsolvedThumbnailUrl: require("./img/thumbnails/gelbschnabeltoko_unsolved.jpg"),
		},

		hints: [
			createLetterCountHint(15),
			createFirstLetterHint(15),
			createAutoFreeHint(15, "Denk mal an die Farbe des Schnabels.", 4),
			createAutoFreeHint(15, "Sein Name verrät schon einiges über sein markantestes Merkmal.", 8)
		],
	},
];
