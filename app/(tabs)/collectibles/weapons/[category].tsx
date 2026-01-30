import { useTheme } from '@/contexts/ThemeContext';
import { useWeapons } from '@/contexts/WeaponsContext';
import { WEAPONS_CATEGORY_TITLES } from '@/data/categoryTitles/weaponsCategoryTitles';
import { weaponsFilters } from '@/data/filters/weaponsFilters';
import { weapons } from '@/data/weapons';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function CategoryScreen() {
  const { theme } = useTheme();
  const { category } = useLocalSearchParams<{ category: string }>();
  const { selectedWeapons, toggleWeapon } = useWeapons();
  const navigation = useNavigation();
  const title = WEAPONS_CATEGORY_TITLES[category ?? ''] ?? 'Catégorie';

  React.useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  const handlePress = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleWeapon(id);
  };

  const filteredWeapons = useMemo(() => {
    const filterFn = weaponsFilters[category ?? ''];
    return filterFn ? weapons.filter(filterFn) : [];
  }, [category]);

  return (
    <View style={[styles.view, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={filteredWeapons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedWeapons[item.id];

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

              <View style={styles.content}>
                <Text style={[styles.name, { color: theme.colors.text }]}>
                  {item.name}
                </Text>
              </View>

              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: isChecked
                      ? theme.colors.white
                      : theme.colors.icon,
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
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
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
});