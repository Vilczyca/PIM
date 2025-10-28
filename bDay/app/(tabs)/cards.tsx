import { AddBdayButton } from "@/components/ui/add-bday-button";
import { BdayCard } from "@/components/ui/BdayCard"; // Twój komponent
import { useColor } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";

type CardItem = {
  id: string;
  name: string;
  birthday: string;
  avatar?: string;
};

const DATA: CardItem[] = [
  { id: "1", name: "Julia Kowalska", birthday: "2001-10-28" },
  { id: "2", name: "Michał Nowak", birthday: "1998-10-27" },
  { id: "3", name: "Kasia Zielińska", birthday: "2000-02-14" },
];

export default function CardsScreen() {
  const router = useRouter();
  const bgColor = useColor("background");
 const textColor = useColor("text");
 


 const daysUntilBirthday = (birthday: string): number => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [, month, day] = birthday.split("-").map(Number);

  
  const todayMidnight = new Date(currentYear, today.getMonth(), today.getDate());
  const thisYearBday = new Date(currentYear, month - 1, day);

  if (thisYearBday < todayMidnight) thisYearBday.setFullYear(currentYear + 1);

 

  return Math.ceil((thisYearBday.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24))
}

const sections = useMemo(()=>{
    const todayList: CardItem[]=[];
    const incomingList : CardItem[] =[];

  DATA.forEach((item)=> {
    const daysLeft = daysUntilBirthday(item.birthday);
    if (daysLeft ===0){
      todayList.push(item);
    }
    else{
      incomingList.push(item);
    }


  });
  incomingList.sort(
      (a, b) => daysUntilBirthday(a.birthday) - daysUntilBirthday(b.birthday)
    );

    return [{
      title:"TODAY", data: todayList},
      {title: "INCOMING", data: incomingList},].filter((section)=>section.data.length>0)
    },[]);

 

  const handlePress = (id: string) => {
    router.push({
      pathname: "/(screens)/detailsScreen",
      params: { id, mode: "view" },
    });
  };

 return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <BdayCard
            id={item.id}
            name={item.name}
            birthday={item.birthday}
            avatar={item.avatar}
            showDaysLeft={true}
            isBirthdayToday={daysUntilBirthday(item.birthday) === 0}
            onPress={() => handlePress(item.id)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.header, { color: textColor }]}>{title}</Text>
        )}
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
