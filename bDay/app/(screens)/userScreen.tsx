import { Avatar } from "@/components/ui/avatar";
import { Fonts } from "@/constants/theme";
import { useColors } from "@/hooks/use-colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView } from "react-native";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function UserScreen() {
  const colors = useColors();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("Person 1");
const [birthday, setBirthday] = useState("01-01-2025");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [tempName, setTempName] = useState(name);
  const [tempBirthday, setTempBirthday] = useState(birthday);
  const [tempPhone, setTempPhone] = useState(phone);
  const [tempEmail, setTempEmail] = useState(email);

  const tintColor = colors.tint;

  const onLogout = () => {
    router.replace("./loginScreen");
  };

  const onSave = () => {
    setName(tempName);
    setBirthday(tempBirthday);
    setPhone(tempPhone);
    setEmail(tempEmail);
    setIsEditing(false);
    console.log("saved:", tempName, tempBirthday, tempPhone, tempEmail);
  };

  const onCancelEdit = () => {
    setTempName(name);
    setTempBirthday(birthday);
    setTempPhone(phone);
    setTempEmail(email);
    setIsEditing(false);
  };

  const startEdit = () => {
    setTempName(name);
    setTempBirthday(birthday);
    setTempPhone(phone);
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
      <ScrollView nestedScrollEnabled contentContainerStyle={styles.container
        
      }>

          <Text
            style={[
              styles.title,
              { color: colors.text, fontFamily: Fonts.sans },
            ]}
          >
            YOUR DETAILS
          </Text>

          <Avatar name={name} size={200} style={{ marginVertical: 24 }} />

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
            />

            {/* <Text
              style={[
                styles.label,
                { color: colors.text, marginTop: 18, fontFamily: Fonts.sans },
              ]}
            >
              Birthday date
            </Text>
           
             <View style={{ height: 200, justifyContent: "center" }}>
    <Spinner
      value={tempBirthday}
      onChange={handleBirthdayChange}
    />
  </View> */}
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
              keyboardType="numeric"
              placeholder="DD-MM-RRRR"
              maxLength={10}
              value={tempBirthday}
              editable={isEditing}
              selectTextOnFocus={isEditing}
              onChangeText={handleBirthdayChange}
            />
            <Text
              style={[
                styles.label,
                { color: colors.text, marginTop: 18, fontFamily: Fonts.sans },
              ]}
            >
              Phone
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
              keyboardType="phone-pad"
              placeholder="Optional"
              value={tempPhone}
              editable={isEditing}
              selectTextOnFocus={isEditing}
              onChangeText={setTempPhone}
            />

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
  title: { fontSize: 22, fontWeight: "800", marginTop: 64 },
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
