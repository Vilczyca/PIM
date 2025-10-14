import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useRouter } from "expo-router";

import { HelloWave } from "@/components/hello-wave";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AddBdayButton } from "@/components/ui/add-bday-button";
import { useColor } from "@/hooks/use-colors";

type CardItem = {
  id: string;
  name: string;
  birthday: string;
};

const DATA: CardItem[] = [
  { id: "1", name: "Julia Kowalska", birthday: "2001-05-20" },
  { id: "2", name: "Michał Nowak", birthday: "1998-11-10" },
  { id: "3", name: "Kasia Zielińska", birthday: "2000-02-14" },
];

export default function CalendarScreen() {
  const router = useRouter();
  const bgColor = useColor("background");
  const cardColor = useColor("card");
  const textColor = useColor("text");

  const renderItem = ({ item }: { item: CardItem }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardColor }]}
      onPress={() =>
        router.push({
          pathname: "/(screens)/detailsScreen",
          params: { id: item.id, mode: "view" },
        })
      }
    >
      <Text style={[styles.name, { color: textColor }]}>{item.name}</Text>
      <Text style={[styles.date, { color: textColor }]}>
        🎂 {item.birthday}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Top container - zajmuje połowę ekranu */}
      <View style={[styles.topContainer, { backgroundColor: cardColor }]}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>
      </View>

      {/* FlatList automatycznie scrolluje */}
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        style={styles.bottomContainer}
      />

      <AddBdayButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    height: "50%", // dokładnie połowa ekranu
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    marginTop: 4,
    fontSize: 14,
  },
});
