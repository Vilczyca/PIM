// app/_layout.tsx
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useColors } from "@/hooks/use-colors";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { NetworkProvider } from "@/context/NetworkContext";
import { OfflineIcon } from "@/components/offline-icon";
import { FirebaseDataProvider } from "@/context/FirebaseDataContex";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { SplashScreen } from "@/components/views/splash-screen"; // Import splash screen

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const colors = useColors();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const isOnLoginScreen =
      segments[0] === "(screens)" && segments[1] === "loginScreen";

    if (!user && !isOnLoginScreen) {
      router.replace("/(screens)/loginScreen");
    } else if (user && isOnLoginScreen) {
      router.replace("/(tabs)/calendar");
    }
  }, [user, isLoading, segments]);

  // Pokaż Splash Screen podczas ładowania
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NetworkProvider>
        <FirebaseDataProvider>
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
        </FirebaseDataProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
}
