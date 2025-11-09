import React, {useState, useRef, useEffect} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Image,
} from "react-native";

import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { auth,signInWithEmailAndPassword, provider, signInWithRedirect, getRedirectResult } from "@/constants/firebase";
import { useGoogleLogin } from '@/hooks/use-google-login';
import {selectAllMyHomie} from "@/components/database";

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

    const onLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setError("");
            router.replace("/cards");
        } catch (err:any) {
            setError("Niepoprawny login lub hasło");
            shake();
        }
    };

    const { promptAsync, isLoading } = useGoogleLogin();

    const onGoogleLogin = async () => {
        try {
            setError("");
            await promptAsync();
        } catch (err: any) {
            setError("Błąd logowania Google: " + err.message);
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
                            {
                                borderColor: colors.tint,
                                color: colors.text,
                                backgroundColor: colors.background,
                            },
                        ]}
                        placeholder="xyz@gmail.com"
                        placeholderTextColor="#a5a5a5"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={[styles.label, { color: colors.text, marginTop: 18 }]}>
                        Password
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: colors.tint,
                                color: colors.text,
                                backgroundColor: colors.background,
                            },
                        ]}
                        placeholder="••••••••••"
                        placeholderTextColor="#a5a5a5"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
            </Animated.View>

            {error ? <Text style={[styles.errorText, { color: "red" }]}>{error}</Text> : null}

            {/* przycisk LOGIN */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.tint }]}
                onPress={onLogin}
                activeOpacity={0.9}
            >
                <Text style={[styles.buttonText, { color: colors.background }]}>LOGIN</Text>
            </TouchableOpacity>

            {/* przycisk Sign in with Google */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.tint }]}
                onPress={onGoogleLogin}
                activeOpacity={0.85}
                disabled={isLoading}
            >
                <Image
                    source={require("@/assets/images/google-logo.png")}
                    style={{ width: 36, height: 36, marginRight: 10 }}
                />
                <Text style={styles.buttonText}>Sign in with Google</Text>
            </TouchableOpacity>
            {/*TODO: usunąć gdy logowanie będzie w pelni działać*/}
            {/* SKIP*/}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.tint }]}
                onPress={() => {router.replace("/cards");
                    selectAllMyHomie();}}
                activeOpacity={0.9}
            >
                <Text style={[styles.buttonText, { color: "red" }]}>SKIP</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: "center",
    },
    title: {
        fontSize: 36,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 24,
    },
    form: { marginBottom: 32 },
    label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginLeft: 4 },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    errorText: {
        marginBottom: 10,
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
    button: {
        flexDirection: "row",
        height: 64,
        justifyContent: "center",
        marginBottom: 20,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: { fontSize: 18, fontWeight: "800", letterSpacing: 1 }
});
