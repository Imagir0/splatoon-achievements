import { COLORS } from '@/constants/colors';
import { useObjects } from '@/contexts/ObjectsContext';
import { FIGURES_CATEGORY_TITLES } from '@/data/categoryTitles/objectsCategoryTitles';
import { objectsFilters } from '@/data/filters/objectsFilters';
import { OBJECTS_DATA } from '@/data/objects';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function FiguresCategoryScreen() {
  const { figuresCategory } = useLocalSearchParams<{ figuresCategory: string }>();

  const { isOwned, toggleObject, getObjectCount, setObjectCount } = useObjects();

  const title = FIGURES_CATEGORY_TITLES[figuresCategory ?? ''] ?? 'Catégorie';
  const filterFn = objectsFilters.figures[figuresCategory ?? ''];
  
  const [search, setSearch] = useState('');
  const searchableCategories = ['spend'];
  const showSearch = figuresCategory ? searchableCategories.includes(figuresCategory) : false;

  const filteredFigures = useMemo(() => {
    if (!filterFn) return [];

    return OBJECTS_DATA.figures
      .map(f => ({ ...f, category: 'figures' as const }))
      .filter(
        figure =>
          filterFn(figure) &&
          (!showSearch || figure.name.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filterFn, figuresCategory, search, showSearch]);

  const handlePress = (id: number, maxNumber: number) => {
    if (maxNumber === 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleObject('figures', id);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title }} />

      {showSearch && (
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher un objet…"
          placeholderTextColor={COLORS.shades.disable}
          style={styles.searchInput}
        />
      )}

      <FlatList
        data={filteredFigures}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          const maxNumber = Number(item.maxNumber);
          const minPrice = Number(item.price ?? 0);
          const count = getObjectCount('figures', item.id);
          const isChecked = isOwned('figures', item.id);
          const shouldHighlightRow = count === maxNumber;

          return (
            <Pressable
              style={[styles.row, shouldHighlightRow && styles.rowChecked]}
              onPress={() => handlePress(item.id, maxNumber)}
            >
              {maxNumber === 1 && (
                <View style={styles.rowTop}>
                  <Image source={item.image} style={styles.image} />
                  <View style={styles.textContainer}>
                    <Text style={styles.description}>{item.name}</Text>
                  </View>
                  <View style={styles.checkbox}>
                    {isChecked && (
                      <MaterialIcons name="check" size={22} color={COLORS.shades.black} />
                    )}
                  </View>
                </View>
              )}

              {maxNumber > 1 && (
                <View>
                  <View style={styles.rowTop}>
                    <Image source={item.image} style={styles.image} />
                    <View style={styles.textContainer}>
                      <Text style={styles.description}>{item.name}</Text>
                      {minPrice !== 0 && (
                        <Text style={styles.price}>
                          {minPrice.toLocaleString()}
                        </Text>
                      )}
                    </View>
                    {figuresCategory === 'salmon' && (
                    <View style={styles.fishScalePrice}>
                        <Text style={styles.price}>{item.fishScalePrice}</Text>
                    </View>
                    )}
                    <View style={styles.slideCount}>
                      {minPrice !== 0 && (
                        <Text style={styles.price}>{(minPrice * count).toLocaleString()}</Text>
                      )}
                      <Text style={styles.countTextInline}>
                        {count} / {maxNumber}
                      </Text>
                    </View>
                  </View>
                  <Slider
                    minimumValue={0}
                    maximumValue={maxNumber}
                    step={1}
                    value={count}
                    onValueChange={value => setObjectCount('figures', item.id, value)}
                    minimumTrackTintColor={COLORS.green.progress}
                    maximumTrackTintColor={COLORS.shades.order}
                    thumbTintColor={COLORS.green.progress}
                    style={styles.slider}
                  />
                </View>
              )}
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
    padding: 16
},
  searchInput: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: COLORS.shades.white,
    fontSize: 16,
  },
  row: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: COLORS.shades.white,
    overflow: 'hidden',
  },
  rowChecked: {
    backgroundColor: COLORS.green.rowChecked,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 12,
    resizeMode: 'contain'
},
  textContainer: {
    flex: 1,
    flexDirection: 'column'
},
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.shades.black
},
  fishScalePrice: {
    width: 80,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.shades.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  countTextInline: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  slideCount: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.shades.codeqr,
    marginBottom: 1
},
  slider: {
    height: 14,
    marginHorizontal: 0,
    marginBottom: 5
},
});
