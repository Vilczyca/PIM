import { AddBdayButton } from "@/components/ui/add-bday-button";
import { BdayCard } from "@/components/ui/BdayCard";
import { CalendarRecord } from "@/constants/types";
import { useFirebaseData } from "@/context/FirebaseDataContex";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { calendarData } = useFirebaseData();

  const [key, setKey] = useState(0);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<CalendarRecord[]>([]);

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [colors.background, colors.text, colors.tint, colors.card]);

  const calendarTheme = useMemo(() => ({
    arrowColor: colors.tint,
    backgroundColor: colors.background,
    calendarBackground: colors.background,
    textSectionTitleColor: colors.text,
    todayTextColor: colors.text,
    dayTextColor: colors.text,
    monthTextColor: colors.text,
    textDisabledColor: colors.text + '80',
    selectedDayBackgroundColor: colors.tint,
    selectedDayTextColor: colors.background,
  }), [colors]);

  const getMarkedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    calendarData.forEach(person => {
      if (!person.date) return;
      const [dayStr, monthStr] = person.date.split("-");
      const thisYearBday = `${new Date().getFullYear()}-${monthStr.padStart(2,"0")}-${dayStr.padStart(2,"0")}`;
      marks[thisYearBday] = { marked: true, dotColor: colors.tint };
    });

    // Zaznaczenie dzisiejszej daty lub wybranej
    const markDate = selectedDate || today;
    marks[markDate] = {
      ...marks[markDate],
      selected: true,
      selectedColor: selectedDate ? colors.tint : colors.card,
      selectedTextColor: selectedDate ? colors.background : colors.text
    };

    return marks;
  }, [calendarData, colors, selectedDate, today]);

  const getDayMonth = (dateStr: string, format: "yyyy-mm-dd" | "dd-mm-yyyy") => {
    if (!dateStr) return { day: "", month: "" };
    const parts = dateStr.split("-");
    if (format === "yyyy-mm-dd") return { day: parts[2], month: parts[1] };
    return { day: parts[0], month: parts[1] };
  };

  const handleDayPress = (day: any) => {
    const clickedDate = day.dateString;
    if (selectedDate === clickedDate) {
      setSelectedDate(null);
      filterBirthdays(today);
    } else {
      setSelectedDate(clickedDate);
      filterBirthdays(clickedDate);
    }
  };

  const filterBirthdays = (date: string) => {
    const dm = getDayMonth(date, "yyyy-mm-dd");
    const birthdays = calendarData.filter(person => {
      if (!person.date) return false;
      const personDM = getDayMonth(person.date, "dd-mm-yyyy");
      return personDM.day === dm.day && personDM.month === dm.month;
    });
    setFilteredData(birthdays);
  };

  useEffect(() => {
    filterBirthdays(today);
  }, [calendarData, today]);

  const daysUntilBirthday = (birthday: string): number => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const [day, month] = birthday.split("-").map(Number);
    let nextBday = new Date(currentYear, month - 1, day);
    today.setHours(0, 0, 0, 0);
    nextBday.setHours(0, 0, 0, 0);
    if (nextBday < today) nextBday.setFullYear(currentYear + 1);
    return Math.ceil((nextBday.getTime() - today.getTime()) / (1000*60*60*24));
  };

  const renderItem = ({ item }: { item: CalendarRecord }) => {
    if (!item.date) return null;
    return (
      <BdayCard
        id={item.id}
        name={item.name}
        birthday={item.date}
        isBirthdayToday={daysUntilBirthday(item.date) === 0}
        showDaysLeft={!selectedDate}
        // colors={colors} 
        onPress={() => router.push({
          pathname: "/(screens)/detailsScreen",
          params: { id: item.id, mode: "view" },
        })}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topContainer, { backgroundColor: colors.background }]}>
        <Calendar
          key={key}
          style={{
            width: "100%",
            borderWidth: 1,
            borderColor: colors.card,
            height: 350,
            backgroundColor: colors.background,
          }}
          theme={calendarTheme}
          onDayPress={handleDayPress}
          hideExtraDays={false}
          enableSwipeMonths
          firstDay={1}
          markedDates={getMarkedDates}
        />
      </View>

      <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.infoText, { color: colors.text }]}>
          {filteredData.length > 0
            ? `🎉 There ${filteredData.length === 1 ? "is" : "are"} ${filteredData.length} birthday${filteredData.length === 1 ? "" : "s"}!`
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
          <Text style={[styles.noData, { color: colors.text }]}>
            No birthdays on {selectedDate || today} 🎈
          </Text>
        }
      />

      <AddBdayButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
  topContainer: { height: "50%", justifyContent: "flex-start", alignItems: "stretch" },
  bottomContainer: { flex: 1 },
  noData: { textAlign: "center", fontSize: 16, marginTop: 20 },
  infoBox: { padding: 12, marginHorizontal: 16, marginVertical: 8, borderRadius: 12, alignItems: "center", elevation: 2 },
  infoText: { fontSize: 16, fontWeight: "600" },
});
