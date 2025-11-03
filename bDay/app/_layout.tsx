import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useColors } from "@/hooks/use-colors";
import Toast from "react-native-toast-message";
import { NetworkProvider } from "@/context/NetworkContext";
import { OfflineIcon } from "@/components/offline-icon";

export default function RootLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();


  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <NetworkProvider>
            <OfflineIcon />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(screens)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(modals)"
                  options={{ headerShown: false, presentation: "modal" }}
                />
              </Stack>
              <StatusBar style="auto" />
              <Toast />
        </NetworkProvider>
    </ThemeProvider>
  );
}
