import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useColor } from "@/hooks/use-colors";
import { Fonts } from "@/constants/theme";
import { Avatar } from "@/components/ui/avatar";

type Mode = "add"|"edit"|"view";
type PersonData = { name:string; birthday:string };

interface DetailsViewProps {
    id?: number;
    mode?: Mode;
    setMode?: (m:Mode)=>void;
    onSaveAdd?: (data:PersonData)=>void;
    onSaveEdit?: (data:PersonData)=>void;
    initialData?: PersonData;   //<- nowe
    errorText?: string;         //<- opcjonalny komunikat
}

export function DetailsView({
                                id,
                                mode="view",
                                setMode,
                                onSaveAdd,
                                onSaveEdit,
                                initialData,
                                errorText,
                            }: DetailsViewProps) {
    const colors = {
        background: useColor("background"),
        text: useColor("text"),
        card: useColor("card"),
        tint: useColor("tint"),
    };

    //saved state
    const [name, setName] = useState(initialData?.name ?? "Person 1");
    const [birthday, setBirthday] = useState(initialData?.birthday ?? "07-11-2025");

    //sync gdy rodzic dostarczy nowe initialData (np. po fetchu)
    useEffect(() => {
        if (!initialData) return;
        setName(initialData.name ?? "");
        setBirthday(initialData.birthday ?? "");
        //jesli jestes w view: od razu odswiez tmp, zeby widok i edycja mialy to samo
        if (mode === "view") {
            setTmpName(initialData.name ?? "");
            setTmpBirthday(initialData.birthday ?? "");
        }
    }, [initialData]); //eslint-disable-line

    //temp state
    const [tmpName, setTmpName] = useState(name);
    const [tmpBirthday, setTmpBirthday] = useState(birthday);

    const isEditing = mode !== "view";

    useEffect(() => {
        if (mode === "edit") {
            setTmpName(name);
            setTmpBirthday(birthday);
        } else if (mode === "add") {
            setTmpName("");
            setTmpBirthday("");
        } else {
            setTmpName(name);
            setTmpBirthday(birthday);
        }
    }, [mode, name, birthday]);

    //format dd-mm-rrrr
    const onBirthdayChange = (text:string) => {
        //usun niecyfry
        let d = text.replace(/\D/g, "");
        if (d.length > 8) d = d.slice(0, 8);
        //wstaw '-'
        let f = d;
        if (d.length > 4) f = `${d.slice(0,2)}-${d.slice(2,4)}-${d.slice(4)}`;
        else if (d.length > 2) f = `${d.slice(0,2)}-${d.slice(2)}`;
        setTmpBirthday(f);
    };

    //save
    const onSave = () => {
        if (mode === "add") {
            onSaveAdd?.({ name: tmpName, birthday: tmpBirthday });
            //parent zamyka/wychodzi
        } else if (mode === "edit") {
            onSaveEdit?.({ name: tmpName, birthday: tmpBirthday });
            setName(tmpName);
            setBirthday(tmpBirthday);
            setMode?.("view");
        }
    };

    return (
        <View style={[styles.root, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.container}>
                {!!errorText && (
                    <Text style={{ color:"red", marginBottom:12 }}>error: {errorText}</Text>
                )}

                <Text style={[styles.title, { color: colors.text, fontFamily: Fonts.sans }]}>
                    {(isEditing ? (tmpName || "New person") : name).toUpperCase()} DETAILS
                </Text>

                <Avatar name={isEditing ? (tmpName || "?") : name} size={200} style={{ marginVertical: 24 }} />

                <View
                    style={[styles.form, !isEditing && { opacity: 0.6 }]}
                    pointerEvents={!isEditing ? "none" : "auto"}
                    accessibilityState={{ disabled: !isEditing }}
                >
                    <Text style={[styles.label, { color: colors.text, fontFamily: Fonts.sans }]}>
                        Name
                    </Text>
                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.card, fontFamily: Fonts.sans }]}
                        editable={isEditing}
                        value={tmpName}
                        onChangeText={setTmpName}
                    />

                    <Text style={[styles.label, { color: colors.text, marginTop: 18, fontFamily: Fonts.sans }]}>
                        Birthday date (DD-MM-RRRR)
                    </Text>
                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.card, fontFamily: Fonts.sans }]}
                        editable={isEditing}
                        keyboardType="numeric"
                        maxLength={10}
                        placeholder="DD-MM-RRRR"
                        value={tmpBirthday}
                        onChangeText={onBirthdayChange}
                    />
                </View>
            </ScrollView>

            {isEditing && (
                <TouchableOpacity style={[styles.bottomBtn, { backgroundColor: colors.tint }]} onPress={onSave}>
                    <Text style={{ color: colors.background, fontSize: 16, fontWeight: "700", fontFamily: Fonts.sans }}>
                        Zapisz
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root:{ flex:1 },
    container:{ alignItems:"center", paddingHorizontal:20, paddingBottom:100 },
    title:{ fontSize:22, fontWeight:"800", marginTop:24 },
    form:{ alignSelf:"stretch" },
    label:{ fontSize:14, fontWeight:"700", marginBottom:8 },
    input:{ height:48, borderWidth:1, borderRadius:12, paddingHorizontal:16, fontSize:16 },
    bottomBtn:{ position:"absolute", bottom:20, left:20, right:20, paddingVertical:14, borderRadius:12, alignItems:"center" },
});
