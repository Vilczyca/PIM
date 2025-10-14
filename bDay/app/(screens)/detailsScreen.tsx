import { useState, useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useColor } from "@/hooks/use-colors";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { DetailsView } from "@/components/views/details-view";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const parsedId =
    typeof id === "string"
      ? Number(id)
      : Array.isArray(id)
      ? Number(id[0])
      : undefined;

  const [mode, setMode] = useState<"view" | "edit">("view");
  const tintColor = useColor("tint");
  const navigation = useNavigation();

  // Dynamiczny header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: mode === "view" ? "Szczegóły" : "Edytuj urodziny",
      // headerRight: edit / cancel
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setMode((prev) => (prev === "view" ? "edit" : "view"))}
          style={{ marginRight: 16 }}
        >
          {mode === "view" ? (
            <Feather name="edit" size={22} color={tintColor} />
          ) : (
            <Feather name="x" size={22} color={tintColor} />
          )}
        </TouchableOpacity>
      ),
      // headerLeft: back lub brak w trybie edit
      headerLeft: () =>
        mode === "view" ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="arrow-back" size={24} color={tintColor} />
          </TouchableOpacity>
        ) : null,
      // opcjonalnie można też zablokować gest swipe back w trybie edit
      gestureEnabled: mode === "view",
    });
  }, [mode, navigation, tintColor]);

  return <DetailsView id={parsedId} mode={mode} />;
}
