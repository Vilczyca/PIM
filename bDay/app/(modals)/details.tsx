import { useLayoutEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useColor } from "@/hooks/use-colors";
import { DetailsView } from "@/components/views/details-view";
import { SearchBar } from "@/components/ui/search-bar";
import { Fonts } from "@/constants/theme";
import {insertMyHomie} from "@/components/database";
import {CalendarRecord} from "@/constants/types";
import {useFirebaseData} from "@/context/FirebaseDataContex";

export default function AddDetailsModal() {
  const router = useRouter();
  const navigation = useNavigation();
  const tint = useColor("tint");
  const textColor = useColor("text");
  const tabBackground = useColor("background");
  const card = useColor("card");
  const [activeTab, setActiveTab] = useState<"add" | "search">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { calendarData, usersData,loading, refresh } = useFirebaseData();
  const [results, setResults] = useState(usersData);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add",
      headerLeft: () => null,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <Feather name="x" size={22} color={tint} />
        </TouchableOpacity>
      ),
      gestureEnabled: false,
      presentation: "modal",
    });
  }, [navigation, router, tint]);

  const handleSaveAdd = (data: CalendarRecord) => {
      const record = {
          name: data.name,
          date: data.date,
          phone: data.phone,
          email: data.email,
      };
      insertMyHomie(record);
      refresh();
      router.back();
  };

  const onSelectItem = (item: any) => {
    setSelectedItem((prev: { id: any }) =>
      prev?.id === item.id ? null : item
    );
  };

  const onSave = () => {
    if (!selectedItem) return;
    insertMyHomie(selectedItem);
    refresh();
    router.back();
  };

  const handleResultsChange = (newResults: any[]) => {
    setResults(newResults);

    if (selectedItem && !newResults.some((r) => r.id === selectedItem.id)) {
      setSelectedItem(null);
    }
  };

  const renderSearchTab = () => (
    <View style={{ flex: 1 }}>
      <SearchBar
        data={usersData}
        keysToSearch={["name", "email", "birthday"]}
        onResultsChange={handleResultsChange}
        placeholder="Search by name, email or birthday..."
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isSelected = selectedItem?.id === item.id;
          return (
            <TouchableOpacity
              style={[
                styles.item,
                {
                  borderColor: isSelected ? tint : card,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => onSelectItem(item)}
            >
              <Text style={[styles.itemName, { color: textColor }]}>
                {item.name}
              </Text>
              <Text
                style={[styles.itemEmail, { color: textColor, opacity: 0.7 }]}
              >
                {item.email}
              </Text>
              <Text
                style={[
                  styles.itemBirthday,
                  { color: textColor, opacity: 0.7 },
                ]}
              >
                {item.date}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {selectedItem && (
        <TouchableOpacity
          style={[styles.bottomBtn, { backgroundColor: tint }]}
          onPress={onSave}
        >
          <Text
            style={{
              color: tabBackground,
              fontSize: 16,
              fontWeight: "700",
              fontFamily: Fonts.sans,
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "add":
        return <DetailsView mode="add" onSaveAdd={handleSaveAdd} />;
      case "search":
        return renderSearchTab();
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: tabBackground }]}>
      {/* Zakładki */}
      <View style={[styles.tabContainer]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "add" && [
              styles.activeTab,
              { borderBottomColor: tint },
            ],
          ]}
          onPress={() => setActiveTab("add")}
        >
          <Text
            style={[
              styles.tabText,
              { color: textColor },
              activeTab === "add" && [styles.activeTabText, { color: tint }],
            ]}
          >
            Add
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "search" && [
              styles.activeTab,
              { borderBottomColor: tint },
            ],
          ]}
          onPress={() => setActiveTab("search")}
        >
          <Text
            style={[
              styles.tabText,
              { color: textColor },
              activeTab === "search" && [styles.activeTabText, { color: tint }],
            ]}
          >
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* Zawartość zakładek */}
      <View style={styles.content}>{renderTabContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  item: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
  },
  itemEmail: {
    fontSize: 14,
  },
  itemBirthday: {
    fontSize: 13,
  },
  bottomBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
