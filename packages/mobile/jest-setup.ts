/* eslint-disable @typescript-eslint/no-require-imports */

const originalConsole = { ...console }; // Eine Kopie des originalen Konsolenobjekts

beforeAll(() => {
	// Direkte Zuweisung der Mock-Funktionen
	console.log = jest.fn();
	console.warn = jest.fn();
	console.error = jest.fn();
	console.info = jest.fn();
	console.debug = jest.fn();
});

afterAll(() => {
	// Stellen Sie die ursprünglichen Konsolen-Methoden wieder her
	console.log = originalConsole.log;
	console.warn = originalConsole.warn;
	console.error = originalConsole.error;
	console.info = originalConsole.info;
	console.debug = originalConsole.debug;
});

// Mock für AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
	require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mock für React Native Reanimated
jest.mock("react-native-reanimated", () => {
	const Reanimated = require("react-native-reanimated/mock");
	Reanimated.default.call = () => {};
	return Reanimated;
});

// Mock für Expo modules
jest.mock("expo-constants", () => ({
	default: {
		manifest: {},
	},
}));

// Mock für React Native Gesture Handler
jest.mock("react-native-gesture-handler", () => {
	const View = require("react-native/Libraries/Components/View/View");
	return {
		Swipeable: View,
		DrawerLayout: View,
		State: {},
		ScrollView: View,
		Slider: View,
		Switch: View,
		TextInput: View,
		ToolbarAndroid: View,
		ViewPagerAndroid: View,
		DrawerLayoutAndroid: View,
		WebView: View,
		NativeViewGestureHandler: View,
		TapGestureHandler: View,
		FlingGestureHandler: View,
		ForceTouchGestureHandler: View,
		LongPressGestureHandler: View,
		PanGestureHandler: View,
		PinchGestureHandler: View,
		RotationGestureHandler: View,
		RawButton: View,
		BaseButton: View,
		RectButton: View,
		BorderlessButton: View,
		FlatList: View,
		gestureHandlerRootHOC: jest.fn(() => (Component: any) => Component),
		Directions: {},
	};
});

// Globale Mocks
(global as any).__DEV__ = true;

// React Native Mock für Testing
jest.mock("react-native", () => {
	const RN = jest.requireActual("react-native");

	// Mock für problematische Komponenten
	RN.NativeModules = {
		...RN.NativeModules,
		RNCNetInfo: {
			getCurrentState: jest.fn(() => Promise.resolve()),
			addListener: jest.fn(),
			removeListeners: jest.fn(),
		},
	};

	return RN;
});
