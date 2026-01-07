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
        <Stack.Screen name="splatfest/index" options={{ title: 'Succès de Splatfests' }} />
        <Stack.Screen name="tableturf/index" options={{ title: 'Succès de Cartes & Territoire' }} />
        <Stack.Screen name="story-mode/index" options={{ title: 'Succès du mode histoire' }} />
        <Stack.Screen name="challenge/index" options={{ title: 'Succès du mode challenge' }} />
        <Stack.Screen name="DLC/index" options={{ title: 'Succès des DLC' }} />
        <Stack.Screen name="rank-level/index" options={{ title: 'Succès rang et niveau' }} />
        <Stack.Screen name="equipement/index" options={{ title: 'Succès des équipements' }} />
        <Stack.Screen name="spending/index" options={{ title: 'Succès des dépenses' }} />
        <Stack.Screen name="game-modes/index" options={{ title: 'Succès des modes de jeu' }} />
        <Stack.Screen name="weapons/index" options={{ title: 'Succès des armes' }} />
        <Stack.Screen name="special-weapons/index" options={{ title: 'Succès des armes spéciales' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
