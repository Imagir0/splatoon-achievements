import { BadgesProvider } from '@/contexts/BadgesContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <BadgesProvider>
      <Tabs
        screenOptions={{
          // Supprime l'espace prévu pour les icônes
          //tabBarIconStyle: { display: 'none' },
          tabBarLabelStyle: {
            fontSize: 11,
          },
          tabBarActiveTintColor: '#e92626ff',
          tabBarInactiveTintColor: '#6b7280',
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="collectibles"
          options={{
            title: 'Collectibles',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="team"
          options={{
            title: 'Gestion équipe',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="stats"
          options={{
            title: 'Statistiques',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </BadgesProvider>
  );
}
