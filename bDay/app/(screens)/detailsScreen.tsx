import { updateMyHomie, deleteMyHomie } from "@/components/database";
import { DetailsView } from "@/components/views/details-view";
import { CalendarRecord } from "@/constants/types";
import { useFirebaseData } from "@/context/FirebaseDataContex";
import { useTheme } from "@/context/ThemeContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {ActivityIndicator, TouchableOpacity, View, Text, Alert} from "react-native";
import {OpenInGoogleCalendar} from "@/components/open-in-google-calendar";


export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const parsedId = id.toString()

  const [mode, setMode] = useState<"view" | "edit" | "add">("view");
  const [initialData, setInitialData] = useState<CalendarRecord | undefined>(
      undefined
  );
const [dataCopy, setDataCopy] = useState<CalendarRecord | undefined>(
    undefined
);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | undefined>(undefined);
  const { colors } = useTheme();

  const navigation = useNavigation();


  const { calendarData, refresh } = useFirebaseData();

  useEffect(() => {
   
    if (parsedId == null || Number.isNaN(parsedId)) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setErr(undefined);
        const person = calendarData.find(x => x.id === parsedId)
        if (!cancelled) setInitialData(person);
        setDataCopy(person);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "load error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load().then();

    return () => {
      cancelled = true;
    };
  }, [calendarData, parsedId]);

  useLayoutEffect(() => {
    const isEditing = mode === "edit";
    navigation.setOptions({
        headerTitle: isEditing ? "Edit" : "Details",

      headerRight: () => (
          <View style={{ flexDirection: "row", width: 68, justifyContent: "flex-end"}}>
              <TouchableOpacity
                      onPress={() => OpenInGoogleCalendar(dataCopy)}
                      style={{ marginRight: 6 }}
                  >
                      {!isEditing &&(
                      <Feather name="share" size={24} color={colors.tint} />
                      )}
                  </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode(isEditing ? "view" : "edit")}
              style={{ marginRight: 16 }}
            >
              {isEditing ? (
                <Feather name="x" size={22} color={colors.tint} />
              ) : (
                <Feather name="edit" size={22} color={colors.tint} />
              )}
            </TouchableOpacity>
          </View>
      ),
        headerLeft: () => (
            <View style={{ flexDirection: "row", width: 68 }}>
                {isEditing ? (
                    <TouchableOpacity onPress={handleDelete} style={{ marginLeft: 16 }}>
                        <Feather name="trash-2" size={22} color={colors.tint} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
                        <Ionicons name="arrow-back" size={24} color={colors.tint} />
                    </TouchableOpacity>
                )}
            </View>
        ),
      gestureEnabled: !isEditing,
    });
  }, [dataCopy, mode, navigation, colors.tint]);

  const handleSaveEdit = (data: CalendarRecord) => {
      if( initialData) {
          data.id = initialData.id;
          data.uid = initialData.uid;
      }
      updateMyHomie(data);
      refresh();
      setInitialData(data);
      setMode("view");
  };

    const handleDelete = () => {
        if (!initialData) return;
        Alert.alert(
            "Delete",
            "Are you sure you want to delete this birthday?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteMyHomie(initialData.id);
                        refresh();
                        navigation.goBack();
                    },
                },
            ]
        );
    };


  if (parsedId != null && loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <DetailsView
      id={parsedId}
      mode={mode}
      setMode={setMode}
      onSaveEdit={handleSaveEdit}
      initialData={initialData}
      errorText={err}
    />
  );
}
