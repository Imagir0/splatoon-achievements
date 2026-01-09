import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import BadgesScreen from './badges';
import BannersScreen from './banners';
import ObjectsScreen from './objects';

export default function CollectiblesScreen() {
  const [activeTab, setActiveTab] = useState<'badges' | 'banners' | 'objects'>('badges');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'badges':
        return <BadgesScreen />;
      case 'banners':
        return <BannersScreen />;
      case 'objects':
        return <ObjectsScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'Collections' }} />

      {/* Menu fixe en haut */}
      <View style={styles.tabMenu}>
        <Pressable
          style={[styles.tabButton, activeTab === 'badges' && styles.tabButtonActive]}
          onPress={() => setActiveTab('badges')}
        >
          <Text style={styles.tabText}>Badges</Text>
        </Pressable>

        <Pressable
          style={[styles.tabButton, activeTab === 'banners' && styles.tabButtonActive]}
          onPress={() => setActiveTab('banners')}
        >
          <Text style={styles.tabText}>Splatiquettes</Text>
        </Pressable>

        <Pressable
          style={[styles.tabButton, activeTab === 'objects' && styles.tabButtonActive]}
          onPress={() => setActiveTab('objects')}
        >
          <Text style={styles.tabText}>Objets</Text>
        </Pressable>
      </View>

      {/* Contenu de l'onglet actif */}
      <View style={{ flex: 1 }}>{renderActiveTab()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#e5e7eb',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#16a34a',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
