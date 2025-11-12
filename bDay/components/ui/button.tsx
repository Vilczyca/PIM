import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors, Fonts } from "../../constants/theme"; // dopasuj ścieżkę
import { useColors } from "@/hooks/use-colors";

type ButtonProps = {
  children?: React.ReactNode;
  type?: "default" | "special";
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function Button({
  children,
  type = "default",
  onPress,
  style,
  textStyle,
}: ButtonProps) {
  const colors = useColors();
  const getButtonStyle = () => {
    switch (type) {
      case "special":
        return {
          backgroundColor: colors.specialButtonColor,
          textColor: colors.specialButtonTextColor,
        };
      default:
        return {
          backgroundColor: colors.buttonColor,
          textColor: colors.buttonTextColor,
        };
    }
  };

  const { backgroundColor, textColor } = getButtonStyle();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Fonts.sans,
  },
});
