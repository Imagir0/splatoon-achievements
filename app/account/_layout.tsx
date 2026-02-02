import UserMenu from '@/components/UserMenu';
import { useTheme } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';

export default function AccountLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTitle: 'Mon compte',
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
        headerRight: () => <UserMenu />,
      }}
    />
  );
}
