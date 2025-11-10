import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from "react-native";

import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { Fonts } from "@/constants/theme";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "@/constants/firebase";
import { selectAllMyHomie, addRegisteredUser } from "@/components/database";
import { Spinner } from "@/components/ui/Spinner";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const colors = useColors();
  const router = useRouter();
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Ustaw domyślną datę przy przejściu do rejestracji
  useEffect(() => {
    if (!isLoginMode && !birthday) {
      const today = new Date();
      const formattedToday = today
        .toLocaleDateString("pl-PL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\./g, "-");
      setBirthday(formattedToday);
    }
  }, [isLoginMode]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBirthdayChange = (text: string) => {
    let digits = text.replace(/\D/g, "");
    if (digits.length > 8) digits = digits.slice(0, 8);

    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(
        4
      )}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}-${digits.slice(2)}`;
    }

    setBirthday(formatted);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      shake();
      return;
    }

    if (!isLoginMode) {
      if (!username) {
        setError("Please enter a username");
        shake();
        return;
      }
      if (!birthday) {
        setError("Please enter your birthday");
        shake();
        return;
      }
      // Walidacja formatu daty
      if (!/^\d{2}-\d{2}-\d{4}$/.test(birthday)) {
        setError("Birthday date must be in format DD-MM-YYYY");
        shake();
        return;
      }
    }

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (userCredential.user) {
          // 1. Zaktualizuj profil w Firebase Auth
          await updateProfile(userCredential.user, {
            displayName: username,
          });

          // 2. Dodaj użytkownika do kolekcji registered_users
          await addRegisteredUser({
            uid: userCredential.user.uid,
            name: username,
            email: email,
            date: birthday,
          });
        }
      }
      setError("");
      router.replace("/cards");
    } catch (err: any) {
      let message = "Login error";
      if (!isLoginMode) message = "Registration error";
      if (err.code === "auth/email-already-in-use")
        message = "This email is already registered";
      if (err.code === "auth/invalid-email") message = "Invalid email address";
      if (err.code === "auth/weak-password")
        message = "Password must be at least 6 characters long";
      setError(message);
      shake();
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    setUsername("");
    if (!isLoginMode) {
      setBirthday(""); // Wyczyść datę przy przejściu do logowania
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {isLoginMode ? "LOGIN" : "SIGN UP"}
        </Text>

        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <View style={styles.form}>
            {/* Pola tylko w trybie rejestracji */}
            {!isLoginMode && (
              <>
                <Text style={[styles.label, { color: colors.text }]}>
                  Username
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
                  placeholder="Enter your username"
                  placeholderTextColor="#a5a5a5"
                  autoCapitalize="words"
                  value={username}
                  onChangeText={setUsername}
                />

                <Text
                  style={[styles.label, { color: colors.text, marginTop: 18 }]}
                >
                  Birthday
                </Text>
                <View style={styles.spinnerContainer}>
                  <Spinner value={birthday} onChange={handleBirthdayChange} />
                </View>
                <Text style={[styles.hint, { color: colors.text }]}>
                  Format: DD-MM-YYYY
                </Text>
              </>
            )}

            <Text
              style={[
                styles.label,
                { color: colors.text, marginTop: !isLoginMode ? 18 : 0 },
              ]}
            >
              Email
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

        {error ? (
          <Text style={[styles.errorText, { color: "red" }]}>{error}</Text>
        ) : null}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.bottomBtn, { backgroundColor: colors.tint }]}
            onPress={handleAuth}
            activeOpacity={0.85}
          >
            <Text
              style={{
                color: colors.background,
                fontSize: 16,
                fontWeight: "700",
                fontFamily: Fonts.sans,
              }}
            >
              {isLoginMode ? "LOGIN" : "SIGN UP"}
            </Text>
          </TouchableOpacity>

          {/* Skip - tymczasowo wyłączony */}
          {/* <TouchableOpacity
            style={[
              styles.bottomBtn,
              { backgroundColor: colors.card, marginTop: 12 },
            ]}
            onPress={() => {
              router.replace("/cards");
              selectAllMyHomie();
            }}
            activeOpacity={0.85}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "700",
                fontFamily: Fonts.sans,
              }}
            >
              SKIP
            </Text>
          </TouchableOpacity> */}

          <TouchableOpacity onPress={toggleMode} style={{ marginTop: 12 }}>
            <Text
              style={{
                color: colors.text,
                textAlign: "center",
                fontSize: 16,
                fontFamily: Fonts.sans,
                textDecorationLine: "underline",
              }}
            >
              {isLoginMode
                ? "Don't have an account? Sign Up"
                : "Already have an account? Log In"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 24,
  },
  form: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  spinnerContainer: {
    height: 200,
    justifyContent: "center",
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 8,
    opacity: 0.7,
  },
  errorText: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 20,
  },
  bottomBtn: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
