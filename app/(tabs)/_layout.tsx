import { BadgesProvider } from '@/contexts/BadgesContext';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <BadgesProvider>
      <Tabs initialRouteName="home">
        <Tabs.Screen
          name="home"
          options={{ title: 'Accueil' }}
        />
        <Tabs.Screen
          name="collectibles"
          options={{ title: 'Collectibles' }}
        />
        <Tabs.Screen
          name="team"
          options={{ title: 'Gestion équipe' }}
        />
        <Tabs.Screen
          name="stats"
          options={{ title: 'Statistiques' }}
        />
      </Tabs>
    </BadgesProvider>
  );
}
