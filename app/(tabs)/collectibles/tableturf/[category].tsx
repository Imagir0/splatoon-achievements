import { useTableTurf } from '@/contexts/TableTurfContext';
import { TABLETURF_CATEGORY_TITLES } from '@/data/categoryTitles/tableTurfCategoryTitles';
import { tableTurfFilters } from '@/data/filters/tableTurfFilters';
import { tableTurf } from '@/data/tableTurf';
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
  const { selectedTableTurf, toggleTableTurf } = useTableTurf();
  const navigation = useNavigation();
  const title = TABLETURF_CATEGORY_TITLES[category ?? ''] ?? 'Catégorie';

  React.useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  // Filtrage dynamique
  const filteredTableTurf = useMemo(() => {
    const filterFn = tableTurfFilters[category ?? ''];
    return filterFn ? tableTurf.filter(filterFn) : [];
  }, [category]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={filteredTableTurf}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedTableTurf[item.number];

          return (
            <Pressable
              style={[styles.row, isChecked && styles.rowChecked]}
              onPress={() => toggleTableTurf(item.number)}
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
