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
        <Stack.Screen name="badges/list" options={{ title: 'Liste des badges' }} />
        <Stack.Screen name="badges/weapons/index" options={{ title: 'Badges des armes' }} />
        <Stack.Screen name="badges/salmonRun/index" options={{ title: 'Badges du mode Salmon Run' }} />
        <Stack.Screen name="banners/index" options={{ title: 'Bannières' }} />
        <Stack.Screen name="objects/index" options={{ title: 'Objets' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
