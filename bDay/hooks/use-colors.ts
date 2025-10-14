import { useColorScheme } from "react-native";
import { Colors } from "@/constants/theme";

// Functions returning colors defined in constants/theme.ts depending on the system theme

// Colors set
export function useColors() {
  const scheme = useColorScheme() || "light";
  return Colors[scheme];
}

// Only one color
export function useColor(key: keyof typeof Colors["light"]) {
  const scheme = useColorScheme() || "light";
  return Colors[scheme][key];
}
