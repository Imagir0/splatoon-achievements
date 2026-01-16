import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

type FiguresCategoryItem = {
  key: string;
  label: string;
};

const FIGURES_CATEGORIES: FiguresCategoryItem[] = [
  { key: 'spend', label: 'Achats' },
  { key: 'salmon', label: 'Salmon Run' },
  { key: 'rank', label: 'Rangs' },
  { key: 'tableturf', label: 'Cartes & Territoire' },
  { key: 'story', label: 'Mode histoire' },
  { key: 'dlc', label: 'DLC' },
];

export default function FiguresIndexScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={FIGURES_CATEGORIES}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({
                pathname:
                  '/(tabs)/collectibles/objects/figures/[figuresCategory]',
                params: { figuresCategory: item.key },
              })
            }
          >
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
        )}
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
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
});
