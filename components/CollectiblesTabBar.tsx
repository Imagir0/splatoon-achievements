import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Tab =
  | 'badges'
  | 'banners'
  | 'objects'
  | 'gears'
  | 'weapons'
  | 'tableturf'
  | 'salmon';

interface Props {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export default function CollectiblesTabBar({ activeTab, onChange }: Props) {
  const tabs: { key: Tab; label: string }[] = [
    { key: 'badges', label: 'Badges' },
    { key: 'banners', label: 'Splatiquettes' },
    { key: 'objects', label: 'Objets' },
    { key: 'gears', label: 'Équipements' },
    { key: 'weapons', label: 'Armes' },
    { key: 'tableturf', label: 'Cartes & Territoire' },
    { key: 'salmon', label: 'Salmon Run' },
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {tabs.map(tab => {
          const isActive = tab.key === activeTab;

          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              style={styles.tab}
            >
              <Text
                style={[styles.label, isActive && styles.labelActive]}
                numberOfLines={2}
              >
                {tab.label}
              </Text>

              {isActive && <View style={styles.indicator} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderColor: '#6b7280',
    backgroundColor: '#363232ff',
  },

  container: {
    paddingHorizontal: 8,
  },

  tab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 64,
  },

  label: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
  },

  labelActive: {
    color: '#e92626ff',
    fontWeight: '700',
  },

  indicator: {
    marginTop: 4,
    height: 3,
    width: 18,
    borderRadius: 2,
    backgroundColor: '#e92626ff',
  },
});
