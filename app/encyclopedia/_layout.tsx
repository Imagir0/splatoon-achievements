import UserMenu from '@/components/UserMenu';
import { useTheme } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';

export default function EncyclopediaLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
        headerRight: () => <UserMenu />,
      }}
    />
  );
}
