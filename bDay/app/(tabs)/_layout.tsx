import { Tabs, useRouter } from "expo-router";
import React, { use } from "react";
import { TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { HapticTab } from "@/components/haptic-tab";
import { useColor } from "@/hooks/use-colors";
import Toast from "react-native-toast-message";
import {OpenInGoogleCalendar} from "@/components/open-in-google-calendar";

export default function TabLayout() {
  const tintColor = useColor("tint");
  const bgColor = useColor("background");
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: bgColor,
        },
        tabBarActiveTintColor: tintColor,
        tabBarButton: HapticTab,

        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.push("/(screens)/userScreen")}
            style={{ marginLeft: 16 }}
          >
            <Feather name="user" size={24} color={tintColor} />
          </TouchableOpacity>
        ),

          headerRight: () => (
              <TouchableOpacity>
              </TouchableOpacity>
          ),
      }}
    >
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <Feather name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: "Nearest",
          tabBarIcon: ({ color }) => (
            <Feather name="clock" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
