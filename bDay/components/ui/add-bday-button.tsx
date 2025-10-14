// components/views/DetailsView.tsx
import { useColor } from "@/hooks/use-colors";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export function AddBdayButton() {
  const router = useRouter();

  const fabColor = useColor("buttonColor");
  const fabIconColor = useColor("buttonTextColor");

  const handleFabPress = () => {
    console.log("FAB clicked!");
    router.push("/(modals)/details");
  };

  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: fabColor }]}
      onPress={handleFabPress}
    >
      <Feather name="plus" size={28} color={fabIconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});
