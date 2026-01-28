import UserMenu from '@/components/UserMenu';
import { BadgesProvider } from '@/contexts/BadgesContext';
import { BannersProvider } from '@/contexts/BannersContext';
import { GearsProvider } from '@/contexts/GearsContext';
import { ObjectsProvider } from '@/contexts/ObjectsContext';
import { SalmonSkinsProvider } from '@/contexts/SalmonRunContext';
import { TableTurfProvider } from '@/contexts/TableTurfContext';
import { WeaponsProvider } from '@/contexts/WeaponsContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function TabsLayout() {
  const [menuVisible, setMenuVisible] = useState(false);

  /*const handleLogin = () => {
    setMenuVisible(false);
    console.log('Connexion');
    // navigation vers écran de connexion plus tard
  };*/

  const toggleTheme = () => {
    setMenuVisible(false);
  };

  return (
    <BadgesProvider>
      <BannersProvider>
        <SalmonSkinsProvider>
          <WeaponsProvider>
            <TableTurfProvider>
              <GearsProvider>
                <ObjectsProvider>
                  <>
                    <Tabs
                      screenOptions={{
                        tabBarLabelStyle: { fontSize: 11 },
                        tabBarActiveTintColor: '#e92626ff',
                        tabBarInactiveTintColor: '#6b7280',
                        headerRight: () => <UserMenu />,
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
                  </>
                </ObjectsProvider>
              </GearsProvider>
            </TableTurfProvider>
          </WeaponsProvider>
        </SalmonSkinsProvider>
      </BannersProvider>
    </BadgesProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  menu: {
    position: 'absolute',
    top: 56,
    right: 12,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 200,
    elevation: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuText: {
    color: 'white',
    fontSize: 16,
  },
});
