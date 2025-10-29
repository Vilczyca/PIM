import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const colors = useColors();
    const router = useRouter();
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
    };

    const onLogin = () => {
        if (email === "admin@example.com" && password === "1234") {
            setError("");
            router.replace("/userScreen");
        } else {
            setError("Niepoprawny login lub hasło");
            shake();
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Text style={[styles.title, { color: colors.text }]}>LOGIN</Text>

            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                <View style={styles.form}>
                    <Text style={[styles.label, { color: colors.text }]}>Username</Text>
                    <TextInput
                        style={[
                            styles.input,
                            { borderColor: colors.card, color: colors.text, backgroundColor: colors.background },
                        ]}
                        placeholder="xyz@gmail.com"
                        placeholderTextColor="#b5b5b5"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={[styles.label, { color: colors.text, marginTop: 18 }]}>Password</Text>
                    <TextInput
                        style={[
                            styles.input,
                            { borderColor: colors.card, color: colors.text, backgroundColor: colors.background },
                        ]}
                        placeholder="••••••••••"
                        placeholderTextColor="#b5b5b5"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
            </Animated.View>

            {error ? <Text style={[styles.errorText, { color: "red" }]}>{error}</Text> : null}

            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.buttonColor }]}
                onPress={onLogin}
                activeOpacity={0.9}
            >
                <Text style={[styles.buttonText, { color: colors.buttonTextColor }]}>LOGIN</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 24 },
    title: { fontSize: 36, fontWeight: "800", textAlign: "center", marginTop: 48 },
    form: { marginTop: 28 },
    label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginLeft: 4 },
    input: { height: 56, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
    errorText: { marginTop: 12, fontSize: 14, fontWeight: "600", textAlign: "center" },
    button: {
        position: "absolute",
        left: 24,
        right: 24,
        bottom: 24,
        height: 64,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    buttonText: { fontSize: 18, fontWeight: "800", letterSpacing: 1 },
});
