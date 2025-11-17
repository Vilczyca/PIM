import { useTheme } from "@/context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export const unstable_settings = {
  initialRouteName: "details",
};

export default function ModalsLayout() {
  const router = useRouter();
     const { colors } = useTheme();

  return (
    <Stack>
      <Stack.Screen
        name="details"
        options={{
          presentation: "modal",
          headerShown: true,
          animation: "slide_from_bottom",

          headerTitle: "Add birthday",
          headerTitleStyle: {
                      color: colors.text, 
                      
                    },
                     headerStyle: {
                     backgroundColor: colors.background, 
                    },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 16 }}
            >
              <Feather name="x" size={22} color={colors.tint} />
            </TouchableOpacity>
          ),
          headerLeft: () => null, // brak back
        }}
      />
    </Stack>
  );
}
