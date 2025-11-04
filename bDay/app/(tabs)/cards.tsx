import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useColor } from "@/hooks/use-colors";
import { AddBdayButton } from "@/components/ui/add-bday-button";
import {CalendarRecord} from "@/constants/types";
import {useFirebaseData} from "@/context/FirebaseDataContex";


export default function CardsScreen() {
  const router = useRouter();
  const bgColor = useColor("background");
  const cardColor = useColor("card");
  const textColor = useColor("text");
  const { calendarData, loading, refresh } = useFirebaseData();

  const renderItem = ({ item }: { item: CalendarRecord }) => (
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
        🎂 {item.date}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <FlatList
        data={calendarData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      <AddBdayButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
