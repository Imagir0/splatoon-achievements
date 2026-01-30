import { AppTheme, darkTheme, lightTheme } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const STORAGE_KEYS = {
  THEME: 'app_theme',
};

type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
  theme: AppTheme;
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  isReady: boolean;
};

const ThemeContext = createContext<ThemeContextType>(null as any);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        if (storedTheme === 'dark' || storedTheme === 'light') {
          setMode(storedTheme);
        }
      } finally {
        setIsReady(true);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, next);
  };

  const theme = useMemo(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        isDark: mode === 'dark',
        toggleTheme,
        isReady,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
