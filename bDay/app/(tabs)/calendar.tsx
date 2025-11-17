import { AddBdayButton } from "@/components/ui/add-bday-button";
import { BdayCard } from "@/components/ui/BdayCard";
import { CalendarRecord } from "@/constants/types";
import { useFirebaseData } from "@/context/FirebaseDataContex";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarScreen() {
  const router = useRouter();
  const colors = useColors();
  const { calendarData, loading, refresh } = useFirebaseData();
  const [key, setKey] = useState(0); // Klucz do wymuszenia przerenderowania

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<CalendarRecord[]>([]);

  // Resetuj klucz gdy zmienią się kolory
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [colors.background, colors.text, colors.tint]);

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
    const marks: any = {};

    calendarData.forEach((person) => {
      if (!person.date) return;

      const [dayStr, monthStr, yearStr] = person.date.split("-");
      if (!dayStr || !monthStr || !yearStr) return;

      const thisYearBday = `${new Date().getFullYear()}-${monthStr.padStart(
        2,
        "0"
      )}-${dayStr.padStart(2, "0")}`;
      marks[thisYearBday] = { marked: true, dotColor: colors.tint };
    });

    // Jeśli dzisiejsza data NIE jest zaznaczona
    if (!selectedDate || selectedDate !== today) {
      marks[today] = {
        ...marks[today],
        selected: true,
        selectedColor: colors.card,
        selectedTextColor: colors.text,
      };
    }

    // Jeśli jest zaznaczona data (może być dzisiaj lub inny dzień)
    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: colors.tint,
        selectedTextColor: colors.background,
      };
    }

    return marks;
  }, [today, selectedDate, calendarData, colors]);

  const getDayMonth = (
    dateStr: string,
    format: "yyyy-mm-dd" | "dd-mm-yyyy"
  ) => {
    if (!dateStr) return { day: "", month: "" };
    if (format === "yyyy-mm-dd") {
      const [y, m, d] = dateStr.split("-");
      return { day: d, month: m };
    } else {
      const [d, m, y] = dateStr.split("-");
      return { day: d, month: m };
    }
  };

  const handleDayPress = (day: any) => {
    const clickedDate = day.dateString;

    const clickedDM = getDayMonth(clickedDate, "yyyy-mm-dd");

    if (selectedDate === clickedDate) {
      setSelectedDate(null);

      const todayDM = getDayMonth(today, "yyyy-mm-dd");

      const birthdayPeople = calendarData.filter((person) => {
        if (!person.date) return false;
        const personDM = getDayMonth(person.date, "dd-mm-yyyy");
        return personDM.day === todayDM.day && personDM.month === todayDM.month;
      });

      setFilteredData(birthdayPeople);
      return;
    }

    setSelectedDate(clickedDate);

    const birthdayPeople = calendarData.filter((person) => {
      if (!person.date) return false;
      const personDM = getDayMonth(person.date, "dd-mm-yyyy");
      return (
        personDM.day === clickedDM.day && personDM.month === clickedDM.month
      );
    });

    setFilteredData(birthdayPeople);
  };

  useEffect(() => {
    if (!calendarData) return;

    const todayDM = getDayMonth(today, "yyyy-mm-dd");

    const todayBdays = calendarData.filter((person: CalendarRecord) => {
      const personDM = getDayMonth(
        person.date ? person.date : "",
        "dd-mm-yyyy"
      );
      return personDM.day === todayDM.day && personDM.month === todayDM.month;
    });

    setFilteredData(todayBdays);
  }, [today, calendarData]);

  const daysUntilBirthday = (birthday: string): number => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const [day, month, year] = birthday.split("-").map(Number);

    const todayMidnight = new Date(
      currentYear,
      today.getMonth(),
      today.getDate()
    );
    const thisYearBday = new Date(currentYear, month - 1, day);

    if (thisYearBday < todayMidnight) thisYearBday.setFullYear(currentYear + 1);

    return Math.ceil(
      (thisYearBday.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const renderItem = ({ item }: { item: CalendarRecord }) => {
    if (!item.date) return null;

    const itemMD = item.date.slice(5);
    const todayMD = today.slice(5);
    const selectedMD = selectedDate ? selectedDate.slice(5) : null;

    return (
      <BdayCard
        id={item.id}
        name={item.name}
        birthday={item.date}
        isBirthdayToday={daysUntilBirthday(item.date) === 0}
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topContainer, { backgroundColor: colors.background }]}>
        <Calendar
          key={key} // Wymusza przerenderowanie przy zmianie motywu
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
            ? `🎉 There ${filteredData.length === 1 ? "is" : "are"} ${
                filteredData.length
              } birthday${filteredData.length === 1 ? "" : "s"}!`
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
  container: {
    flex: 1,
    width: "100%",
  },
  topContainer: {
    height: "50%",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  bottomContainer: {
    flex: 1,
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  infoBox: {
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "600",
  },
});