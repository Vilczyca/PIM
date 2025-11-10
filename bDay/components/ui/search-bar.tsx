import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColor } from "@/hooks/use-colors";

interface SearchBarProps<T> {
  data: T[];
  keysToSearch?: (keyof T)[];
  onResultsChange?: (results: T[]) => void;
  placeholder?: string;
}

export function SearchBar<T extends Record<string, any>>({
  data,
  keysToSearch = ["name", "email"] as (keyof T)[],
  onResultsChange,
  placeholder = "Search...",
}: SearchBarProps<T>) {
  const colors = {
    background: useColor("background"),
    text: useColor("text"),
    card: useColor("card"),
    tint: useColor("tint"),
  };

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>(data);

  useEffect(() => {
    if (!query.trim()) {
      setResults(data);
      onResultsChange?.(data);
      return;
    }

    const lower = query.toLowerCase();
    const filtered = data.filter((item) =>
      keysToSearch.some((key) =>
        String(item[key] ?? "").toLowerCase().includes(lower)
      )
    );
    setResults(filtered);
    onResultsChange?.(filtered);
  }, [query, data]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.tint },
      ]}
    >
      <Feather
        name="search"
        size={18}
        color={colors.tint}
        style={{ marginRight: 8 }}
      />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.text + "99"}
        value={query}
        onChangeText={setQuery}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
