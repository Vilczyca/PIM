import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useColor } from "@/hooks/use-colors";
import { AddBdayButton } from "@/components/ui/add-bday-button";
import {signInWithPopup, auth, provider} from "@/constants/firebase";

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

const handleGoogleLogin = async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (err:any) {
        alert("Błąd logowania Google: " + err.message);
    }
};

export default function CardsScreen() {
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
        <button
            className="mt-4 custom-button bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleGoogleLogin}
        >
            Zaloguj przez Google
        </button>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <FlatList
        data={DATA}
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
