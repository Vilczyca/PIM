//app/detailsScreen.tsx
import { useEffect, useState, useLayoutEffect } from "react";
import { TouchableOpacity, ActivityIndicator, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useColor } from "@/hooks/use-colors";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { DetailsView } from "@/components/views/details-view";

type PersonData = { name: string; birthday: string }; //DD-MM-RRRR

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const parsedId =
    typeof id === "string"
      ? Number(id)
      : Array.isArray(id)
      ? Number(id[0])
      : undefined;

  const [mode, setMode] = useState<"view" | "edit" | "add">("view");
  const [initialData, setInitialData] = useState<PersonData | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | undefined>(undefined);

  const tintColor = useColor("tint");
  const navigation = useNavigation();

  useEffect(() => {
    //jesli nie ma id, nie ładujemy
    if (parsedId == null || Number.isNaN(parsedId)) return;

    let cancelled = false;

    const toDDMMYYYY = (iso: string) => {
      //bezpieczna konwersja iso->dd-mm-rrrr
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    };

    const load = async () => {
      try {
        setLoading(true);
        setErr(undefined);
        //todo:fetch real api
        //const res = await fetch(`https://api.example.com/person/${parsedId}`);
        //if(!res.ok) throw new Error(`http ${res.status}`);
        //const j = await res.json();
        //const data: PersonData = { name: j.name, birthday: toDDMMYYYY(j.birthday) };

        //mock
        const data: PersonData = {
          name: `Person ${parsedId}`,
          birthday: toDDMMYYYY("2025-11-07"),
        };

        if (!cancelled) setInitialData(data);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "load error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [parsedId]);

  useLayoutEffect(() => {
    const isEditing = mode === "edit";
    navigation.setOptions({
      title: isEditing ? "Edit" : "Details",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setMode(isEditing ? "view" : "edit")}
          style={{ marginRight: 16 }}
        >
          {isEditing ? (
            <Feather name="x" size={22} color={tintColor} />
          ) : (
            <Feather name="edit" size={22} color={tintColor} />
          )}
        </TouchableOpacity>
      ),
      headerLeft: () =>
        isEditing ? null : (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="arrow-back" size={24} color={tintColor} />
          </TouchableOpacity>
        ),
      gestureEnabled: !isEditing,
    });
  }, [mode, navigation, tintColor]);

  const handleSaveEdit = (data: PersonData) => {
    //todo:update api/store
    setInitialData(data); //update lokalnego widoku
    setMode("view");
  };

  if (parsedId != null && loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={tintColor} />
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
