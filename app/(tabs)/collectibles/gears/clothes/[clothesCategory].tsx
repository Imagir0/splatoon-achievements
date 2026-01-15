import { useGears } from '@/contexts/GearsContext';
import { GEARS_DATA } from '@/data/gears';
import { GEARS_CATEGORY_TITLES } from '@/data/gearsCategoryTitles';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ClothesCategoryScreen() {
  const { clothesCategory } = useLocalSearchParams<{ clothesCategory: string }>();
  const { isOwned, toggleGear } = useGears();

  function normalizeBrand(name: string) {
    return name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9+]/g, '');
  }

  // Récupérer le titre de la catégorie
  const title = GEARS_CATEGORY_TITLES[clothesCategory ?? ''] ?? 'Catégorie';

  // Filtrage des vêtements pour la catégorie
  const filteredGears = useMemo(() => {
    const allClothes = GEARS_DATA.clothes;

    return allClothes.filter(
      (gear) =>
        normalizeBrand(gear.brand.name) === clothesCategory
    );
  }, [clothesCategory]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Définir le titre de l'écran */}
      <Stack.Screen options={{ title }} />

      <FlatList
        data={filteredGears}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = isOwned('clothes', item.id);

          return (
            <Pressable
              style={[styles.row, isChecked && styles.rowChecked]}
              onPress={() => toggleGear('clothes', item.id)}
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
  row: {
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  rowChecked: {
    backgroundColor: '#86efac',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 12,
    resizeMode: 'contain',
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
});
