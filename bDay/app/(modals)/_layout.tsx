import { useColor } from "@/hooks/use-colors";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export const unstable_settings = {
  initialRouteName: "details",
};

export default function ModalsLayout() {
  const router = useRouter();
  const tintColor = useColor("tint");

  return (
    <Stack>
      <Stack.Screen
        name="details"
        options={{
          presentation: "modal",
          headerShown: true,
          animation: "slide_from_bottom",

          headerTitle: "Dodaj urodziny",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
            >
              <Feather name="x" size={22} color={tintColor} />
            </TouchableOpacity>
          ),
          headerLeft: () => null, // brak back
        }}
      />
    </Stack>
  );
}
