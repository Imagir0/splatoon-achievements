import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';


function AppNavigation() {
  const { isDark } = useTheme();

    useEffect(() => {
    NavigationBar.setBackgroundColorAsync(
      isDark ? '#000000' : '#FFFFFF'
    );
    NavigationBar.setButtonStyleAsync(
      isDark ? 'light' : 'dark'
    );
  }, [isDark]);

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="encyclopedia" options={{ headerShown: false }} />
        <Stack.Screen name="account" options={{ headerShown: false }} />
      </Stack>

      <StatusBar
        style={isDark ? 'light' : 'dark'}
        backgroundColor="transparent"
      />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppNavigation />
    </ThemeProvider>
  );
}
