import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';

const THEME_STORAGE_KEY = "app_theme";

type ThemePreference = "auto" | "light" | "dark";

interface ThemeContextType {
  colors: typeof Colors.light; // Zwraca już konkretne kolory
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemePreference>("auto");

  const actualTheme: ColorSchemeName = themePreference === "auto" 
    ? (systemTheme || 'light') 
    : themePreference;

  const colors = Colors[actualTheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setThemePreference(savedTheme as ThemePreference);
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    }
  };

  const updateThemePreference = async (newTheme: ThemePreference) => {
    setThemePreference(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{
      colors,
      themePreference,
      setThemePreference: updateThemePreference,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};