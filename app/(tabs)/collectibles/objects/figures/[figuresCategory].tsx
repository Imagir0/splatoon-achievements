import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useObjects } from '@/contexts/ObjectsContext';
import { allObjects } from '@/data/allObjects';
import { getFilteredObjects } from '@/data/getFilteredObjects';

const FIGURES_CATEGORY_TITLES: Record<string, string> = {
  spend: 'Objets – Achats',
  rank: 'Objets – Rangs',
  salmon: 'Objets – Salmon Run',
  salmonEvent: 'Objets – Évènements Salmon Run',
  tableturf: 'Objets – Cartes & Territoire',
  story: 'Objets – Mode histoire',
  dlc: 'Objets – DLC',
};

export default function FiguresCategoryScreen() {
  const { figuresCategory } =
    useLocalSearchParams<{ figuresCategory: string }>();

  const { isOwned, toggleObject } = useObjects();

  const title =
    FIGURES_CATEGORY_TITLES[figuresCategory ?? ''] ?? 'Figures';

  const objects = useMemo(() => {
    if (!figuresCategory) return [];
    return getFilteredObjects(
      allObjects,
      'figures',
      figuresCategory
    );
  }, [figuresCategory]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title }} />

      <FlatList
        data={objects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const owned = isOwned('figures', item.id);

          return (
            <Pressable
              style={[styles.row, owned && styles.rowOwned]}
              onPress={() => toggleObject('figures', item.id)}
            >
              <Image
                source={item.image}
                style={styles.image}
              />
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.checkbox}>
                {owned && <Text>✔</Text>}
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  rowOwned: {
    backgroundColor: '#86efac',
  },
  image: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    marginRight: 12,
  },
  name: {
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
  },
});
