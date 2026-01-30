import { useTheme } from '@/contexts/ThemeContext';
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
  const { theme } = useTheme();

  const tabs: { key: Tab; label: string }[] = [
    { key: 'badges', label: 'Badges' },
    { key: 'banners', label: 'Splatiquettes' },
    { key: 'objects', label: 'Objets' },
    { key: 'gears', label: 'Équipements' },
    { key: 'weapons', label: 'Armes' },
    { key: 'salmon', label: 'Salmon Run' },
    { key: 'tableturf', label: 'Cartes & Territoire' },
  ];

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
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
                style={[
                  styles.label,
                  { color: theme.colors.textMuted },
                  isActive && {
                    color: theme.colors.primary,
                    fontWeight: '700',
                  },
                ]}
                numberOfLines={2}
              >
                {tab.label}
              </Text>

              {isActive && (
                <View
                  style={[
                    styles.indicator,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
              )}
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
    fontWeight: '500',
    textAlign: 'center',
  },
  indicator: {
    marginTop: 4,
    height: 3,
    width: 18,
    borderRadius: 2,
  },
});
