import { Avatar } from "@/components/ui/avatar";
import { useColor } from "@/hooks/use-colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
type BdayCardProps = {
  id: string;
  name: string | null;
  birthday: string | null;
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
 
  let daysLeft: number | null = null;
  const { colors } = useTheme();

  if (showDaysLeft && birthday) {
    const today = new Date();
    const [day, month, year] = birthday.split("-").map(Number);
    let nextBday = new Date(today.getFullYear(), month - 1, day);

    today.setHours(0, 0, 0, 0);
    nextBday.setHours(0, 0, 0, 0);

    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }

    daysLeft = Math.ceil(
      (nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  } else {
    daysLeft = null;
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isBirthdayToday ? colors.cardBday : colors.card,
          borderColor: colors.cardBday,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <Avatar name={name ?? undefined} size={50} />

        <View style={{ marginLeft: 12 }}>
          <Text style={[styles.name, { color: colors.text }]}>
            {name} {isBirthdayToday ? "🎉 " : ""}
          </Text>
          <Text style={styles.date}>{birthday}</Text>
          {daysLeft !== null && (
            <Text style={styles.daysLeft}>
              {daysLeft === 0 ? "Today" : daysLeft + " days left"}
            </Text>
          )}
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
    borderWidth: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
  daysLeft: {
    fontSize: 12,
    color: "#888",
  },
});
