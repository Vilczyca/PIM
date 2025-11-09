import React from "react";
import { View, StyleSheet } from "react-native";
import { useNetwork } from "@/context/NetworkContext";
import { Feather } from "@expo/vector-icons";
export const OfflineIcon = () => {
    const { isOnline } = useNetwork();

    if (isOnline || isOnline === undefined) return null;

    return (
        <View style={[styles.banner, { backgroundColor: "#00000000" }]}>
            <Feather name="wifi-off" size={28} color="red"/>
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
});
