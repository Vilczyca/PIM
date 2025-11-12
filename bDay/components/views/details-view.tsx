import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/Spinner";
import { Fonts } from "@/constants/theme";
import { useColor } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { CalendarRecord } from "@/constants/types";
import Button from "../ui/button";

type Mode = "add" | "edit" | "view";

interface DetailsViewProps {
  id?: string;
  mode?: Mode;
  setMode?: (m: Mode) => void;
  onSaveAdd?: (data: CalendarRecord) => void;
  onSaveEdit?: (data: CalendarRecord) => void;
  initialData?: CalendarRecord;
  errorText?: string;
}

export function DetailsView({
  id,
  mode = "view",
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

  const placeholderOpt = "Optional";
  const placeholderReq = "Required";

  //saved state
  const [name, setName] = useState(initialData?.name ?? "Person 1");
  const [birthday, setBirthday] = useState(initialData?.date ?? "07-11-2025");
  const [phone, setPhone] = useState(initialData?.phone?.toString() ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");

  //temp state
  const [tmpName, setTmpName] = useState(name);
  const [tmpBirthday, setTmpBirthday] = useState(birthday);
  const [tmpPhone, setTmpPhone] = useState(phone);
  const [tmpEmail, setTmpEmail] = useState(email);

  //validation
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!tmpName.trim()) {
      const msg = "Name is required.";
      setValidationError(msg);
      Alert.alert(msg);
      return false;
    }

    if (!/^\d{2}-\d{2}-\d{4}$/.test(tmpBirthday)) {
      const msg = "Birthday date must be in format DD-MM-RRRR.";
      setValidationError(msg);
      Alert.alert(msg);
      return false;
    }

    const [day, month, year] = tmpBirthday.split("-").map(Number);
    const validDate = day >= 1 && day <= 31 && month >= 1 && month <= 12;
    if (!validDate) {
      const msg = "Wrong birthday date.";
      setValidationError(msg);
      Alert.alert(msg);
      return false;
    }

    if (tmpEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tmpEmail)) {
      const msg = "Wrong e-mail format.";
      setValidationError(msg);
      Alert.alert(msg);
      return false;
    }

    if (tmpPhone && !/^\d{6,}$/.test(tmpPhone.replace(/\D/g, ""))) {
      const msg = "Phone number should contain at least 6 digits.";
      setValidationError(msg);
      Alert.alert(msg);
      return false;
    }

    setValidationError(null);
    return true;
  };

  const isEditing = mode !== "view";

  //sync when parent updates
  useEffect(() => {
    if (!initialData) return;
    setName(initialData.name ?? "");
    setBirthday(initialData.date ?? "");
    setPhone(initialData.phone?.toString() ?? "");
    setEmail(initialData.email ?? "");
    if (mode === "view") {
      setTmpName(initialData.name ?? "");
      setTmpBirthday(initialData.date ?? "");
      setTmpPhone(initialData.phone?.toString() ?? "");
      setTmpEmail(initialData.email ?? "");
    }
  }, [initialData]); //eslint-disable-line

  useEffect(() => {
    const today = new Date();
    const formattedToday = today
      .toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\./g, "-");
    setTmpBirthday(formattedToday);

    if (mode === "edit") {
      setTmpName(name);
      setTmpBirthday(birthday);
      setTmpPhone(phone);
      setTmpEmail(email);
    } else if (mode === "add") {
      setTmpName("");
      setTmpBirthday(formattedToday);
      setTmpPhone("");
      setTmpEmail("");
    } else {
      setTmpName(name);
      setTmpBirthday(birthday);
      setTmpPhone(phone);
      setTmpEmail(email);
    }
  }, [mode, name, birthday, phone, email]);

  const onBirthdayChange = (text: string) => {
    let d = text.replace(/\D/g, "");
    if (d.length > 8) d = d.slice(0, 8);

    let f = d;
    if (d.length > 4) f = `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4)}`;
    else if (d.length > 2) f = `${d.slice(0, 2)}-${d.slice(2)}`;
    setTmpBirthday(f);
  };

  const onSave = () => {
    if (!validateForm()) return;

    const data = {
      name: tmpName,
      date: tmpBirthday,
      ...(isNaN(parseInt(tmpPhone)) ? {} : { phone: parseInt(tmpPhone) }),
      email: tmpEmail,
    };
    if (mode === "add") {
      onSaveAdd?.(data);
    } else if (mode === "edit") {
      onSaveEdit?.(data);
      setName(tmpName);
      setBirthday(tmpBirthday);
      setPhone(tmpPhone);
      setEmail(tmpEmail);
      setMode?.("view");
    }
  };

  const onCall = () => {
    if (!phone) return Alert.alert("Brak numeru telefonu");
    Linking.openURL(`tel:${phone}`);
  };

  const onSms = () => {
    if (!phone) return Alert.alert("Brak numeru telefonu");

    const isBirthday = checkIfBirthday(birthday);
    const message = isBirthday
      ? 'Hej, wszystkiego najlepszego z okazji urodzin! 🎉 Pozdrowienia z aplikacji "bDAY!" :)'
      : 'Hej, pozdrowienia z aplikacji "bDAY!" :)  Mam nadzieję, że wszystko u Ciebie dobrze.';

    Linking.openURL(`sms:${phone}?body=${encodeURIComponent(message)}`);
  };

  const onMail = () => {
    if (!email) return Alert.alert("Brak adresu e-mail");

    const isBirthday = checkIfBirthday(birthday);
    const subject = isBirthday
      ? "Wszystkiego najlepszego z okazji urodzin!"
      : 'Pozdrowienia z "bDAY!"';
    const body = isBirthday
      ? `Cześć,

    Wszystkiego najlepszego z okazji urodzin! 🎉 Pozdrowienia z aplikacji \"bDAY!\" :)

    Pozdrawiam`
      : `Cześć,

    Chciałem/Chciałam właśnie pozdrowić Cię przez aplikację \"bDAY!\" :) Mam nadzieję, że wszystko u Ciebie dobrze.

    Pozdrawiam`;

    Linking.openURL(
      `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
    );
  };

  const checkIfBirthday = (birthdayDate: string) => {
    try {
      const [day, month, year] = birthdayDate.split("-").map(Number);
      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth() + 1;

      return currentDay === day && currentMonth === month;
    } catch (error) {
      return false;
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {!!errorText && (
          <Text style={{ color: "red", marginBottom: 12 }}>
            error: {errorText}
          </Text>
        )}

        <Text
          style={[styles.title, { color: colors.text, fontFamily: Fonts.sans }]}
        >
          {(isEditing ? tmpName || "New person" : name).toUpperCase()} DETAILS
        </Text>

        <Avatar
          name={isEditing ? tmpName || "?" : name}
          size={200}
          style={{ marginVertical: 24 }}
        />

        {/* row of icons */}
        {!isEditing && (
          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={onCall}>
              <Ionicons name="call" size={28} color={colors.tint} />
              <Text style={[styles.iconLabel, { color: colors.text }]}>
                Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={onSms}>
              <Ionicons name="chatbubbles" size={28} color={colors.tint} />
              <Text style={[styles.iconLabel, { color: colors.text }]}>
                SMS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={onMail}>
              <Ionicons name="mail" size={28} color={colors.tint} />
              <Text style={[styles.iconLabel, { color: colors.text }]}>
                Email
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* form */}
        <View
          style={[styles.form, !isEditing && { opacity: 0.6 }]}
          pointerEvents={!isEditing ? "none" : "auto"}
          accessibilityState={{ disabled: !isEditing }}
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
            editable={isEditing}
            value={tmpName}
            onChangeText={setTmpName}
            placeholder="Name"
          />

          <View style={{ height: 200, justifyContent: "center" }}>
            <Spinner value={tmpBirthday} onChange={onBirthdayChange} />
          </View>
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
            editable={isEditing}
            keyboardType="phone-pad"
            placeholder={placeholderOpt}
            value={tmpPhone}
            onChangeText={setTmpPhone}
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
            editable={isEditing}
            keyboardType="email-address"
            placeholder={placeholderOpt}
            value={tmpEmail}
            onChangeText={setTmpEmail}
          />
        </View>
      </ScrollView>

      {isEditing && (
        <Button style={styles.bottomBtn} onPress={onSave}>
          Save
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: { fontSize: 22, fontWeight: "800", marginTop: 24 },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
  },
  iconBtn: { alignItems: "center" },
  iconLabel: { marginTop: 4, fontSize: 12, fontWeight: "600" },
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
