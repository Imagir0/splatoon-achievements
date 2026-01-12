import { useBadges } from '@/contexts/BadgesContext';
import { badgeFilters } from '@/data/badgeFilters';
import { badges } from '@/data/badges';
import { BADGES_CATEGORY_TITLES } from '@/data/badgesCategoryTitles';
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
  const { category } = useLocalSearchParams<{ category: string }>();
  const { selectedBadges, toggleBadge } = useBadges();
  const navigation = useNavigation();
  const title = BADGES_CATEGORY_TITLES[category ?? ''] ?? 'Catégorie';

  React.useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  // Filtrage dynamique
  const filteredBadges = useMemo(() => {
    const filterFn = badgeFilters[category ?? ''];
    return filterFn ? badges.filter(filterFn) : [];
  }, [category]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={filteredBadges}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedBadges[item.id];

          return (
            <Pressable
              style={[styles.row, isChecked && styles.rowChecked]}
              onPress={() => toggleBadge(item.id)}
            >
              <Image source={item.image} style={styles.image} />

              <Text style={styles.description}>{item.description}</Text>

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
