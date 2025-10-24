import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
} from "react-native";
import { useColors } from "@/hooks/use-colors"; //dopasuj ścieżkę
import { Fonts } from "@/constants/theme";

export default function UserModal() {
    const colors = useColors();

    const name = "Person 1";
    const birthday = "October 10";

    return (
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

                <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
                    <Text
                        style={[
                            styles.avatarText,
                            { color: colors.background, fontFamily: Fonts.sans },
                        ]}
                    >
                        IMG
                    </Text>
                </View>

                <View style={styles.form}>
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
                        editable={false}
                    />

                    <Text
                        style={[
                            styles.label,
                            {
                                color: colors.text,
                                marginTop: 18,
                                fontFamily: Fonts.sans,
                            },
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
                        editable={false}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    topBar: {
        height: 64,
        justifyContent: "center",
    },
    iconBtn: { position: "absolute", left: 16, top: 16, padding: 8 },
    iconBtnRight: { position: "absolute", right: 16, top: 16, padding: 8 },
    container: { alignItems: "center", paddingHorizontal: 20, paddingBottom: 40 },
    title: { fontSize: 22, fontWeight: "800", marginTop: 12 },
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
});
