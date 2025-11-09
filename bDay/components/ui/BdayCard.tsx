import { useColor } from "@/hooks/use-colors";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
type BdayCardProps = {
  id: string;
  name: string;
  birthday: string;
  avatar?: string; 
  isBirthdayToday?: boolean;
  showDaysLeft?: boolean;
  onPress?: () => void;
};

export function BdayCard({
  name,
  birthday,
  avatar,
  isBirthdayToday = false,
  showDaysLeft = true,
  onPress,
}: BdayCardProps) {

const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp";  
const cardColor = useColor("card");
const cardColorBday = useColor("cardBday");
const textColor = useColor("text")
let daysLeft: number | null = null;
  if (showDaysLeft) {
    const today = new Date();
    const [year, month, day] = birthday.split("-").map(Number);
    let nextBday = new Date(today.getFullYear(), month - 1, day);

    
    today.setHours(0, 0, 0, 0);
    nextBday.setHours(0, 0, 0, 0);

    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }

    daysLeft = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }


  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: isBirthdayToday ? cardColorBday : cardColor, borderColor : cardColorBday }]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <Image
          source={{ uri: avatar || defaultAvatar }}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 12 }}>
          <Text style={[styles.name, { color: textColor }]}>
            {name} {isBirthdayToday ? "🎉 " : ""} 
          </Text>
          <Text style={styles.date}>{birthday.slice(5)}</Text>
          {daysLeft !== null && <Text style={styles.daysLeft}>{daysLeft===0 ? "Today": daysLeft+ " days left"}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    borderWidth:2
  },
  row: {
    flexDirection: "row",
    alignItems: "center" 
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  name: { 
    fontSize: 16,
    fontWeight: "bold"
  },
  date: { 
    fontSize: 14,
    color: "#555"
  },
  daysLeft: {
    fontSize: 12,
    color: "#888"
  },
});
