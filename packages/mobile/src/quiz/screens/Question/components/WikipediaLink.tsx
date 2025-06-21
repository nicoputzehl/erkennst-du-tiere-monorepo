import { useThemeColor } from "@/common/hooks/useThemeColor";
import { FontAwesome6 } from "@expo/vector-icons";
import { type ExternalPathString, Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { Platform } from "react-native";

const WIKIPEDIA_URL = "https://de.wikipedia.org/wiki/";

interface WikipediaLinkProps {
	slug: string;
}

export const WikipediaLink = ({ slug }: WikipediaLinkProps) => {
	// Sicherstellen dass nur ein String zurückgegeben wird
	const iconColor = useThemeColor({}, "icon");
	const link = (WIKIPEDIA_URL + slug) as ExternalPathString;

	return (
		<Link
			target="_blank"
			href={link}
			onPress={async (event) => {
				if (Platform.OS !== "web") {
					event.preventDefault();
					await openBrowserAsync(link);
				}
			}}
		>
			<FontAwesome6 name="wikipedia-w" size={48} color={iconColor} />
		</Link>
	);
};
