import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/Spinner";
import { Fonts } from "@/constants/theme";
import { useColors } from "@/hooks/use-colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import {
  auth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "@/constants/firebase";
import {selectRegisteredUsers, updateUserInRegisteredUsers} from "@/components/database"; // Dodaj tę funkcję

export default function UserScreen() {
  const colors = useColors();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Dane użytkownika z Firebase
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");

  // Tymczasowe wartości do edycji
  const [tempName, setTempName] = useState(name);
  const [tempBirthday, setTempBirthday] = useState(birthday);
  const [tempEmail, setTempEmail] = useState(email);

  const tintColor = colors.tint;

  // Pobierz dane zalogowanego użytkownika
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setName(user.displayName || "User");
        setEmail(user.email || "");
        setTempName(user.displayName || "User");
        setTempEmail(user.email || "");

        // Pobierz datę urodzenia z kolekcji registered_users
        try {
          const usersData = await selectRegisteredUsers();
          const currentUserData = usersData?.find((u) => u.id === user.uid);

          if (currentUserData?.date) {
            setBirthday(currentUserData.date);
            setTempBirthday(currentUserData.date);
          } else {
            // Ustaw domyślną datę jeśli nie znaleziono
            const today = new Date();
            const formattedToday = today
              .toLocaleDateString("pl-PL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\./g, "-");
            setBirthday(formattedToday);
            setTempBirthday(formattedToday);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Ustaw domyślną datę w przypadku błędu
          const today = new Date();
          const formattedToday = today
            .toLocaleDateString("pl-PL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\./g, "-");
          setBirthday(formattedToday);
          setTempBirthday(formattedToday);
        }
      } else {
        // Jeśli użytkownik nie jest zalogowany, wróć do logowania
        router.replace("./loginScreen");
      }
    });

    return () => unsubscribe();
  }, []);

  const onLogout = async () => {
    try {
      await signOut(auth);
      router.replace("./loginScreen");
    } catch (error) {
      console.error("Error signing out: ", error);
      Alert.alert("Error", "Failed to sign out");
    }
  };

  const onSave = async () => {
    try {

      await updateUserInRegisteredUsers(currentUser.uid, {
        name: tempName,
        date: tempBirthday,
        email: tempEmail
      });

      // Zaktualizuj lokalny stan
      setName(tempName);
      setBirthday(tempBirthday);
      setEmail(tempEmail);
      setIsEditing(false);

      console.log("Profile updated:", tempName, tempBirthday, tempEmail);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const onCancelEdit = () => {
    // Przywróć oryginalne wartości
    setTempName(name);
    setTempBirthday(birthday);
    setTempEmail(email);
    setIsEditing(false);
  };

  const startEdit = () => {
    setTempName(name);
    setTempBirthday(birthday);
    setTempEmail(email);
    setIsEditing(true);
  };

  const disabled = !isEditing;

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

    setTempBirthday(formatted);
  };

  // Jeśli użytkownik nie jest załadowany, pokaż loading
  if (!currentUser) {
    return (
      <View
        style={[
          styles.root,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "User profile",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color={tintColor} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => (isEditing ? onCancelEdit() : startEdit())}
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
        <ScrollView
          nestedScrollEnabled
          contentContainerStyle={styles.container}
        >
          <Text
            style={[
              styles.title,
              { color: colors.text, fontFamily: Fonts.sans },
            ]}
          >
            YOUR DETAILS
          </Text>

          {/* Dodaj informację o emailu */}
          {currentUser?.email && (
            <Text
              style={[
                styles.subtitle,
                { color: colors.text, fontFamily: Fonts.sans },
              ]}
            >
              {currentUser.email}
            </Text>
          )}

          <Avatar
            name={isEditing ? tempName : name}
            size={200}
            style={{ marginVertical: 24 }}
          />

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
              value={tempName}
              editable={isEditing}
              selectTextOnFocus={isEditing}
              onChangeText={setTempName}
              placeholder="Enter your name"
            />

            <Text
              style={[
                styles.label,
                { color: colors.text, marginTop: 18, fontFamily: Fonts.sans },
              ]}
            >
              Birthday date
            </Text>

            <View style={{ height: 200, justifyContent: "center" }}>
              <Spinner value={tempBirthday} onChange={handleBirthdayChange} />
            </View>

            <Text style={[styles.hint, { color: colors.text }]}>
              Format: DD-MM-YYYY
            </Text>

            <Text
              style={[
                styles.label,
                { color: colors.text, marginTop: 18, fontFamily: Fonts.sans },
              ]}
            >
              Email
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
              keyboardType="email-address"
              placeholder="Optional"
              value={tempEmail}
              editable={isEditing}
              selectTextOnFocus={isEditing}
              onChangeText={setTempEmail}
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
            {isEditing ? "Save" : "Logout"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 64,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  form: {
    alignSelf: "stretch",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 8,
    opacity: 0.7,
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
