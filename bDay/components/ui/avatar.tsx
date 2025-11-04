import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Fonts } from "@/constants/theme";
import { useColors } from "@/hooks/use-colors";

interface AvatarProps {
    name?: string;
    size?: number;
    style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 100, style }) => {
    const colors = useColors();
    const trimmed = name?.trim();
    const letter = trimmed?.[0]?.toUpperCase() ?? "?";

    return (
        <View
            style={[
                styles.avatar,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: colors.tint,
                },
                style,
            ]}
        >
            <Text
                style={[
                    styles.letter,
                    {
                        color: colors.background,
                        fontFamily: Fonts.sans,
                        fontSize: size * 0.4,
                    },
                ]}
            >
                {letter}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    letter: {
        fontWeight: "800",
    },
});
