import { AddBdayButton } from "@/components/ui/add-bday-button";
import { BdayCard } from "@/components/ui/BdayCard";
import { useColor } from "@/hooks/use-colors";
import {useFirebaseData} from "@/context/FirebaseDataContex";
import {CalendarRecord} from "@/constants/types";

import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

type CardItem = {
  id: string;
  name: string;
  birthday: string;
  image?: string;
};

const DATA: CardItem[] = [
  { id: "1", name: "Julia Kowalska", birthday: "2001-11-01" },
  { id: "2", name: "Michał Nowak", birthday: "1998-10-27" },
  { id: "3", name: "Kasia Zielińska", birthday: "2000-02-14" },
];

export default function CalendarScreen() {
  const router = useRouter();
  const bgColor = useColor("background");
  const cardColor = useColor("card");
  const textColor = useColor("text");
  const currentDayColor = useColor("calendarToday");

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<CardItem[]>([]);

  const calendarTheme = {
    arrowColor: textColor,
    backgroundColor: bgColor,
    calendarBackground: bgColor,
    textSectionTitleColor: textColor,
    todayTextColor: currentDayColor,
    dayTextColor: textColor,
    monthTextColor: textColor,
  };




  const getMarkedDates = useMemo(() => {
    const marks: any = {};
    DATA.forEach((person) => {
      const birthday = person.birthday.slice(5);
      const thisYearBday = `${new Date().getFullYear()}-${birthday}`;
      marks[thisYearBday] = { marked: true, dotColor: currentDayColor };
    });
    marks[today] = { ...marks[today], selected: true, selectedColor: currentDayColor };
    if (selectedDate) {
      marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: "#d3d3d3" };
    }
    return marks;
  }, [today, selectedDate, DATA, currentDayColor]);


  const handleDayPress = (day: any) => {
    const clickedDate = day.dateString;

    if (selectedDate === clickedDate) {
      setSelectedDate(null);
      const todayMD = today.slice(5);
      const birthdayPeople = DATA.filter(
        (person) => person.birthday.slice(5) === todayMD
      );
      setFilteredData(birthdayPeople);
      return;
    }

    setSelectedDate(clickedDate);
    const selectedMD = clickedDate.slice(5);
    const birthdayPeople = DATA.filter(
      (person) => person.birthday.slice(5) === selectedMD
    );
    setFilteredData(birthdayPeople);
  };


  useEffect(() => {
    const todayMD = today.slice(5);
    const todayBdays = DATA.filter(
      (person) => person.birthday.slice(5) === todayMD
    );
    setFilteredData(todayBdays);
  }, [today]);
const daysUntilBirthday = (birthday: string): number => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [, month, day] = birthday.split("-").map(Number);

  
  const todayMidnight = new Date(currentYear, today.getMonth(), today.getDate());
  const thisYearBday = new Date(currentYear, month - 1, day);

  if (thisYearBday < todayMidnight) thisYearBday.setFullYear(currentYear + 1);

 

  return Math.ceil((thisYearBday.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24))
}

  const renderItem = ({ item }: { item: CardItem }) => {
    const itemMD = item.birthday.slice(5);
    const todayMD = today.slice(5);
    const selectedMD = selectedDate ? selectedDate.slice(5) : null;
    

    return (
      <BdayCard
        id={item.id}
        name={item.name}
        birthday={item.birthday}
        isBirthdayToday={daysUntilBirthday(item.birthday) === 0}
        showDaysLeft={!selectedDate}
        onPress={() =>
          router.push({
            pathname: "/(screens)/detailsScreen",
            params: { id: item.id, mode: "view" },
          })
        }
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.topContainer, { backgroundColor: cardColor }]}>
        <Calendar
          style={{ width: "100%", borderWidth: 1, borderColor: bgColor, height: 350, backgroundColor: bgColor }}
          theme={calendarTheme}
          onDayPress={handleDayPress}
          hideExtraDays={false}
          enableSwipeMonths
          firstDay={1}
          markedDates={getMarkedDates}
        />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {filteredData.length > 0
            ? `🎉 There are ${filteredData.length} birthdays today!`
            : "No birthdays today 😢"}
        </Text>
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        style={styles.bottomContainer}
        ListEmptyComponent={
          <Text style={[styles.noData, { color: textColor }]}>
            No birthdays on {selectedDate || today} 🎈
          </Text>
        }
      />

      <AddBdayButton />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  },
  topContainer: {
    height: "50%",
    justifyContent: "flex-start",
    alignItems: "stretch"
  },
  bottomContainer: {
    flex: 1
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20
  },
  infoBox: {
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});