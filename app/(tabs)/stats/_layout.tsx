import { useTheme } from '@/contexts/ThemeContext';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider, } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { isDark } = useTheme();

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>

      <StatusBar
        style={isDark ? 'light' : 'dark'}
        backgroundColor="transparent"
      />
    </NavigationThemeProvider>
  );
}
