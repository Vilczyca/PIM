// app/(tabs)/_layout.tsx
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { HapticTab } from "@/components/haptic-tab";
import { useColor } from "@/hooks/use-colors";
import { useTheme } from "@/context/ThemeContext";

export default function TabLayout() {
  
  const router = useRouter();

  const { themePreference, setThemePreference, colors } = useTheme();

  // Funkcja przełączania motywu (light → dark → auto)
  const toggleTheme = () => {
    if (themePreference === "light") setThemePreference("dark");
    else if (themePreference === "dark") setThemePreference("auto");
    else setThemePreference("light");
  };

  // Wybór ikony w zależności od aktualnego motywu
  const icon =
    themePreference === "light"
      ? "sunny"
      : themePreference === "dark"
      ? "moon"
      : "sync";

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: colors.background,
        },
        tabBarActiveTintColor: colors.tint,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.background, 
            borderTopWidth: 0,
        },

        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.push("/(screens)/userScreen")}
            style={{ marginLeft: 16 }}
          >
            <Feather name="user" size={24} color={colors.tint} />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity
            onPress={toggleTheme}
            style={{ marginRight: 16 }}
          >
            <Ionicons name={icon} size={24} color={colors.text} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          headerTitleStyle: {
            color: colors.text, 
            
          },
           headerStyle: {
           backgroundColor: colors.background, 
          },
          tabBarIcon: ({ color }) => (
            <Feather name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: "Nearest",
          headerTitleStyle: {
            color: colors.text, 
            
          },
           headerStyle: {
           backgroundColor: colors.background, 
          },
          tabBarIcon: ({ color }) => (
            <Feather name="clock" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
