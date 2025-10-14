import { Tabs, useRouter } from "expo-router";
import React, { use } from "react";
import { TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { HapticTab } from "@/components/haptic-tab";
import { useColor } from "@/hooks/use-colors";
import Toast from "react-native-toast-message";

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
          <TouchableOpacity
            onPress={() => {
              console.log("Export pressed");
              Toast.show({
                type: "info", // 'success' | 'error' | 'info'
                text1: "Export",
                text2: "Tu kiedyś będzie eksportowanie do kalendarza",
                position: "bottom",
                visibilityTime: 3000,
              });
            }}
            style={{ marginRight: 16 }}
          >
            <Feather name="share" size={24} color={tintColor} />
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
