import { useBadges } from '@/contexts/BadgesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { badges } from '@/data/badges';
import { weaponCategories } from '@/data/filters/weaponFilters';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View, } from 'react-native';

export default function WeaponCategoryScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const weaponCategory = params.weaponCategory as
    | keyof typeof weaponCategories
    | undefined;

  const config = weaponCategory ? weaponCategories[weaponCategory] : undefined;
  const { selectedBadges, toggleBadge } = useBadges();
  const [search, setSearch] = useState('');

  const searchableCategories = [
    'shooters',
    'rollers',
    'chargers',
    'sloshers',
    'splatlings',
    'dualies',
    'brellas',
    'blasters',
    'brushes',
    'bows',
    'splatanas',
  ];

  const showSearch = weaponCategory
    ? searchableCategories.includes(weaponCategory)
    : false;

  const filteredBadges = useMemo(() => {
    if (!config) return [];
    return badges.filter(
      (badge) =>
        config.filter(badge) &&
        (!showSearch ||
          badge.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [config, search, showSearch]);

  const handlePress = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBadge(id);
  };

  return (
    <View style={styles.view}>
      <Stack.Screen
        options={{
          title: config?.title ?? 'Armes',
        }}
      />

      {showSearch && (
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher un badge…"
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.searchInput, { borderColor: theme.colors.border }]}
        />
      )}

      <FlatList
        data={filteredBadges}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedBadges[item.id];

          return (
            <Pressable
              onPress={() => handlePress(item.id)}
              style={[
                styles.row,
                {
                  backgroundColor: isChecked
                    ? theme.colors.rowChecked
                    : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Image source={item.image} style={styles.image} />

              <Text
                style={[
                  styles.description,
                  { color: theme.colors.text },
                ]}
              >
                {item.description}
              </Text>

              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: isChecked
                      ? theme.colors.white
                      : theme.colors.icon,
                    backgroundColor: isChecked
                      ? 'transparent'
                      : 'transparent',
                  },
                ]}
              >
                {isChecked && (
                  <MaterialIcons
                    name="check"
                    size={24}
                    color={theme.colors.white}
                  />
                )}
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 12,
  },
  description: {
    flex: 1,
    fontSize: 16,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  searchInput: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: 'white',
    fontSize: 16,
    borderWidth: 1,
  },
});
