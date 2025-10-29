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
      }}
    >
      <Stack.Screen
        name="userScreen"
        options={{
          title: "Profil użytkownika",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color={tintColor} />
            </TouchableOpacity>
          ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => {
                        //logout: wyczysc nawigacje do loginu
                        router.replace("./loginScreen");
                    }}
                    style={{ marginRight: 16 }}
                >
                    <Feather name="log-out" size={22} color={tintColor} />
                </TouchableOpacity>
            ),
        }}
      />

      <Stack.Screen
        name="detailsScreen"
        // options jest ustawione w detailsScreen bo jest dynamiczne

        // options={{
        //   title: "Szczegóły",
        //   headerLeft: () => (
        //     <TouchableOpacity
        //       onPress={() => router.back()}
        //       style={{ marginLeft: 16 }}
        //     >
        //       <Ionicons name="arrow-back" size={24} color={tintColor} />
        //     </TouchableOpacity>
        //   ),
        //   headerRight: () => (
        //     <TouchableOpacity
        //       onPress={() => console.log("Edytuj kliknięte")}
        //       style={{ marginRight: 16 }}
        //     >
        //       <Feather name="edit" size={22} color={tintColor} />
        //     </TouchableOpacity>
        //   ),
        // }}
      />

    <Stack.Screen
        name="loginScreen"
        options={{
            title: "",
            headerLeft: () => null,
        }}
    />

    </Stack>
  );
}
