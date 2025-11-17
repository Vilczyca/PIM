// app/_layout.tsx
import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { NetworkProvider } from "@/context/NetworkContext";
import { FirebaseDataProvider } from "@/context/FirebaseDataContex";
import { OfflineIcon } from "@/components/offline-icon";
import { useAuth } from "@/hooks/use-auth";
import { SplashScreen } from "@/components/views/splash-screen";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";

export default function RootLayoutWrapper() {
  // Opakowujemy całą aplikację w Twój ThemeProvider
  return (
    <ThemeProvider>
      <RootLayout />
    </ThemeProvider>
  );
}

function RootLayout() {
  const { themePreference } = useTheme(); // Pobieramy motyw z ThemeContext
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Logika routingu
  useEffect(() => {
    if (isLoading) return;

    const isOnLoginScreen =
      segments[0] === "(screens)" && segments[1] === "loginScreen";

    if (!user && !isOnLoginScreen) {
      router.replace("/(screens)/loginScreen");
    } else if (user && isOnLoginScreen) {
      router.replace("/(tabs)/calendar");
    }
  }, [user, isLoading, segments]);

  // Pokaż SplashScreen podczas ładowania
  if (isLoading) return <SplashScreen />;

  return (
    <NavigationThemeProvider
      value={themePreference === "dark" ? DarkTheme : DefaultTheme}
    >
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
    </NavigationThemeProvider>
  );
}
