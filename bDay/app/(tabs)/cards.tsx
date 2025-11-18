import { AddBdayButton } from "@/components/ui/add-bday-button";
import { useFirebaseData } from "@/context/FirebaseDataContex";
import { useColor } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { BdayCard } from "@/components/ui/BdayCard";

import { CalendarRecord } from "@/constants/types";
import { useMemo } from "react";
import { SectionList } from "react-native";



export default function CardsScreen() {
  const router = useRouter();
    const { colors } = useTheme(); // Pobieramy kolory z ThemeContext
  const { calendarData, loading, refresh } = useFirebaseData();

  

 

const daysUntilBirthday = (birthday: string): number => {

  const [dayStr, monthStr, yearStr] = birthday.split("-");
  if (!dayStr || !monthStr || !yearStr) return Infinity; 

  const today = new Date();
  const currentYear = today.getFullYear();
  const day = Number(dayStr);
  const month = Number(monthStr);

  const todayMidnight = new Date(currentYear, today.getMonth(), today.getDate());
  const thisYearBday = new Date(currentYear, month - 1, day);

  if (thisYearBday < todayMidnight) thisYearBday.setFullYear(currentYear + 1);

  return Math.ceil((thisYearBday.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
};


const sections = useMemo(() => {
  const todayList: CalendarRecord[] = [];
  const incomingList: CalendarRecord[] = [];

  calendarData.forEach((item) => {
  if (item.date) { 
    const daysLeft = daysUntilBirthday(item.date);
    if (daysLeft === 0) {
      todayList.push(item);
    } else {
      incomingList.push(item);
    }
  }
});


 incomingList.sort((a, b) => {
  const daysA = a.date ? daysUntilBirthday(a.date) : Infinity;
  const daysB = b.date ? daysUntilBirthday(b.date) : Infinity;
  return daysA - daysB;
});


  return [
    { title: "TODAY", data: todayList },
    { title: "INCOMING", data: incomingList },
  ].filter((section) => section.data.length > 0);
}, [calendarData]);


 

  const handlePress = (id: string) => {
    router.push({
      pathname: "/(screens)/detailsScreen",
      params: { id, mode: "view" },
    });
  };

 return (
    <View style={[styles.container, { backgroundColor:  colors.background }]}>
        <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, flexGrow: 1 }}
            renderItem={({ item }) => (
                <BdayCard
                    id={item.id}
                    name={item.name}
                    birthday={item.date}
                    avatar={item.avatar}
                    showDaysLeft={true}
                    isBirthdayToday={daysUntilBirthday(item.date ?? "") === 0}
                    backgroundColor={colors.card}
                    textColor={colors.text}
                    onPress={() => handlePress(item.id)}
                />
            )}
            renderSectionHeader={({ section: { title } }) => (
                <Text style={[styles.header, { color: colors.text }]}>{title}</Text>
            )}

            //test
            ListEmptyComponent={
                <View style={{ alignItems: "center", marginTop: 40 }}>
                    <Text style={[styles.header, { color: colors.text }]}>
                        No birthdays yet
                    </Text>
                </View>
            }
        />


        <AddBdayButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    textTransform: "uppercase",
    textAlign: "center"
  },
});
