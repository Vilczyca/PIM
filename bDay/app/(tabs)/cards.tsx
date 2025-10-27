import { AddBdayButton } from "@/components/ui/add-bday-button";
import { BdayCard } from "@/components/ui/BdayCard"; // Twój komponent
import { useColor } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";

type CardItem = {
  id: string;
  name: string;
  birthday: string;
  avatar?: string;
};

const DATA: CardItem[] = [
  { id: "1", name: "Julia Kowalska", birthday: "2001-05-20" },
  { id: "2", name: "Michał Nowak", birthday: "1998-10-27" },
  { id: "3", name: "Kasia Zielińska", birthday: "2000-02-14" },
];

export default function CardsScreen() {
  const router = useRouter();
  const bgColor = useColor("background");

  const todayMD = new Date().toISOString().split("T")[0].slice(5);


  const daysUntilBirthday = (birthday: string): number => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const [year, month, day] = birthday.split("-").map(Number);
    const thisYearBday = new Date(currentYear, month , day);

    if (thisYearBday < today) thisYearBday.setFullYear(currentYear + 1);

    return Math.ceil((thisYearBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const sortedData = useMemo(() => {
    return [...DATA].sort(
      (a, b) => daysUntilBirthday(a.birthday) - daysUntilBirthday(b.birthday)
    );
  }, []);

  const handlePress = (id: string) => {
    router.push({
      pathname: "/(screens)/detailsScreen",
      params: { id, mode: "view" },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <FlatList
        data={sortedData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const itemMD = item.birthday.slice(5);
          const isBirthdayToday = itemMD === todayMD;

          return (
            <BdayCard
              id={item.id}
              name={item.name}
              birthday={item.birthday}
              avatar={item.avatar}
              showDaysLeft={true}
              isBirthdayToday={isBirthdayToday} 
              onPress={() => handlePress(item.id)}
            />
          );
        }}
      />

      <AddBdayButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
