import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useColor } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

export default function ModalsLayout() {
  const router = useRouter();
  const tintColor = useColor("tint");

  return (
    <Stack
      screenOptions={{
        headerShown: true,
          headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="userScreen"
          // options jest ustawione w userScreen bo jest dynamiczne
      />

      <Stack.Screen
        name="detailsScreen"
        // options jest ustawione w detailsScreen bo jest dynamiczne
      />

    <Stack.Screen
        name="loginScreen"
        options={{
            title: "",
            headerLeft: () => null,
            headerRight: () => null,
        }}
    />

    </Stack>
  );
}
