import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { Fonts } from "@/constants/theme";
import { Avatar } from "@/components/ui/avatar";


export default function UserScreen() {
    const colors = useColors();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("Person 1");
    const [birthday, setBirthday] = useState("October 10");
    const tintColor = colors.tint;

    const onLogout = () => {
        router.replace("./loginScreen");
    };

    const onSave = () => {
        setIsEditing(false);
        console.log("saved:", name, birthday);
    };

    const disabled = !isEditing;

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Profil użytkownika",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
                            <Ionicons name="arrow-back" size={24} color={tintColor} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => setIsEditing(!isEditing)}
                            style={{ marginRight: 16 }}
                        >
                            {isEditing ? (
                                <Feather name="x" size={22} color={tintColor} />
                            ) : (
                                <Feather name="edit-3" size={22} color={tintColor} />
                            )}
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={[styles.root, { backgroundColor: colors.background }]}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text
                        style={[
                            styles.title,
                            { color: colors.text, fontFamily: Fonts.sans },
                        ]}
                    >
                        &lt;NAME&gt; DETAILS
                    </Text>

                    <Avatar name="Person 1" size={200} style={{ marginVertical: 24 }} />

                    {/* //blok: pola sa nieklikalne gdy nie edycja */}
                    <View
                        style={[styles.form, disabled && { opacity: 0.6 }]}
                        pointerEvents={disabled ? "none" : "auto"}
                        accessibilityState={{ disabled }}
                    >
                        <Text
                            style={[
                                styles.label,
                                { color: colors.text, fontFamily: Fonts.sans },
                            ]}
                        >
                            Name
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    color: colors.text,
                                    borderColor: colors.card,
                                    fontFamily: Fonts.sans,
                                },
                            ]}
                            value={name}
                            editable={isEditing}
                            selectTextOnFocus={isEditing}
                            onChangeText={setName}
                        />

                        <Text
                            style={[
                                styles.label,
                                { color: colors.text, marginTop: 18, fontFamily: Fonts.sans },
                            ]}
                        >
                            Birthday date
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    color: colors.text,
                                    borderColor: colors.card,
                                    fontFamily: Fonts.sans,
                                },
                            ]}
                            value={birthday}
                            editable={isEditing}
                            selectTextOnFocus={isEditing}
                            onChangeText={setBirthday}
                        />
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={[styles.bottomBtn, { backgroundColor: colors.tint }]}
                    onPress={isEditing ? onSave : onLogout}
                >
                    <Text
                        style={{
                            color: colors.background,
                            fontSize: 16,
                            fontWeight: "700",
                            fontFamily: Fonts.sans,
                        }}
                    >
                        {isEditing ? "Zapisz" : "Wyloguj"}
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    container: { alignItems: "center", paddingHorizontal: 20, paddingBottom: 100 },
    title: { fontSize: 22, fontWeight: "800", marginTop: 64 },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    avatarText: { fontSize: 24, fontWeight: "800" },
    form: { alignSelf: "stretch" },
    label: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
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
