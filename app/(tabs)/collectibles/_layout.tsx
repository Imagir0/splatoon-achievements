import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="ranked/index" options={{ title: 'Succès ranked' }} />
        <Stack.Screen name="salmon-run/index" options={{ title: 'Succès salmon' }} />
        <Stack.Screen name="story-mode/index" options={{ title: 'Mode histoire' }} />
        <Stack.Screen name="tableturf-battle/index" options={{ title: 'Cartes et territoire' }} />
        <Stack.Screen name="weapons/index" options={{ title: 'Succès d\'armes' }} />
        <Stack.Screen name="modals/modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
