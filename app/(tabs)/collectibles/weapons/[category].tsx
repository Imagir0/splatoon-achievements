import { useWeapons } from '@/contexts/WeaponsContext';
import { weapons } from '@/data/weapons';
import { WEAPONS_CATEGORY_TITLES } from '@/data/weaponsCategoryTitles';
import { weaponsFilters } from '@/data/weaponsFilters';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { selectedWeapons, toggleWeapon } = useWeapons();
  const navigation = useNavigation();
  const title = WEAPONS_CATEGORY_TITLES[category ?? ''] ?? 'Catégorie';

  React.useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  // Filtrage dynamique
  const filteredWeapons = useMemo(() => {
    const filterFn = weaponsFilters[category ?? ''];
    return filterFn ? weapons.filter(filterFn) : [];
  }, [category]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={filteredWeapons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedWeapons[item.id];

          return (
            <Pressable
                style={[styles.row, isChecked && styles.rowChecked]}
                onPress={() => toggleWeapon(item.id)}
                >
                <Image source={item.image} style={styles.image} />
                <Text style={styles.description}>{item.name}</Text>
                <View style={styles.checkbox}>
                    {isChecked && <Text>✔</Text>}
                </View>
                </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 8,
  },
  rowChecked: {
    backgroundColor: '#86efac',
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
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#065f46',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  checkMark: {
    fontSize: 18,
    color: '#065f46',
    fontWeight: '700',
  },
  searchInput: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: '#e5e7eb',
    fontSize: 16,
  },
});