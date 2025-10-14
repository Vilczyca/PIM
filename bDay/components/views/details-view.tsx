// components/views/DetailsView.tsx
import { View, Text, StyleSheet } from "react-native";

interface DetailsViewProps {
  id?: number;
  mode?: "add" | "edit" | "view";
}

export function DetailsView({ id, mode }: DetailsViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Szczegóły osoby</Text>
      <Text style={styles.subtitle}>ID: {id}</Text>
      <Text style={styles.info}>Typ: {mode}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { marginTop: 8, fontSize: 18, color: "#555" },
  info: { marginTop: 12, fontSize: 16, color: "#666", textAlign: "center" },
});
