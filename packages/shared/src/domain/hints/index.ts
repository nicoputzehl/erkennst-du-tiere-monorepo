import { generateHintContent } from "./generation";
import {
	calculatePointsForCorrectAnswer,
	createPointTransaction,
	getInitialUserPoints,
} from "./points";
import {
	checkForContextualHints,
	checkTriggeredHints,
	getTriggeredContent,
} from "./triggering";
import {
	canUseHint,
	isAutoFreeHint,
	isContextualHint,
	isDynamicHint,
	isStaticHint,
} from "./validation";

import {
	createAutoFreeHint,
	createContextualHint,
	createCustomHint,
	createEscalatingAutoFreeHint,
	createFirstLetterHint,
	createLetterCountHint,
} from "./factories";

export const HintUtils = {
	// Validation
	canUseHint,

	// Generation
	generateHintContent,
	getTriggeredContent,

	// Triggering
	checkForContextualHints,
	checkTriggeredHints,

	// Points
	calculatePointsForCorrectAnswer,
	createPointTransaction,
	getInitialUserPoints,

	// Type Guards
	isStaticHint,
	isDynamicHint,
	isContextualHint,
	isAutoFreeHint,

	// Factories
	createAutoFreeHint,
	createCustomHint,
	createContextualHint,
	createEscalatingAutoFreeHint,
	createFirstLetterHint,
	createLetterCountHint,
} as const;
