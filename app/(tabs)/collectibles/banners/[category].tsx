import { useBanners } from '@/contexts/BannersContext';
import { bannerFilters } from '@/data/bannerFilters';
import { banners } from '@/data/banners';
import { BANNER_CATEGORY_TITLES } from '@/data/bannersCategoryTitles';
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
  const { selectedBanners, toggleBanner } = useBanners();
  const navigation = useNavigation();
  const title = BANNER_CATEGORY_TITLES[category ?? ''] ?? 'Catégorie';

  React.useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  // Filtrage dynamique
  const filteredBanners = useMemo(() => {
    const filterFn = bannerFilters[category ?? ''];
    return filterFn ? banners.filter(filterFn) : [];
  }, [category]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={filteredBanners}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedBanners[item.id];

          return (
            <Pressable
                style={[styles.row, isChecked && styles.rowChecked]}
                onPress={() => toggleBanner(item.id)}
                >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={item.image} style={styles.image} />

                    {category === 'salmonRun' ? (
                    <Text style={styles.fishScalePrice}>{item.fishScalePrice}</Text>
                    ) : null}
                </View>
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
    width: 200,
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
  fishScalePrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginTop: 4,
    },
});
