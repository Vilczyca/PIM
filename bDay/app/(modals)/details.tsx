import { useState, useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useColor } from "@/hooks/use-colors";
import { useNavigation } from "@react-navigation/native";
import { DetailsView } from "@/components/views/details-view";

export default function AddDetailsModal() {
  return <DetailsView id={undefined} mode="add" />;
}
