import { useObjects } from '@/contexts/ObjectsContext';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { theme } = useTheme();

  const { isOwned, toggleObject, getObjectCount, setObjectCount } = useObjects();

  const title = FIGURES_CATEGORY_TITLES[figuresCategory ?? ''] ?? 'Catégorie';
  const filterFn = objectsFilters.figures[figuresCategory ?? ''];

  const [search, setSearch] = useState('');
  const searchableCategories = ['spend'];
  const showSearch = figuresCategory ? searchableCategories.includes(figuresCategory) : false;

  const filteredFigures = useMemo(() => {
    if (!filterFn) return [];

    return OBJECTS_DATA.figures
      .map(f => ({ ...f, category: 'figures' as const, price: Number(f.price ?? 0) }))
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
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Stack.Screen options={{ title }} />

      {showSearch && (
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher un objet…"
          placeholderTextColor={theme.colors.textMuted}
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
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
              style={[
                styles.row,
                {
                  backgroundColor: shouldHighlightRow
                    ? theme.colors.rowChecked
                    : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                },
              ]}
              onPress={() => handlePress(item.id, maxNumber)}
            >
              {maxNumber === 1 && (
                <View style={styles.rowTop}>
                  <Image source={item.image} style={styles.image} />

                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.description,
                        { color: theme.colors.text },
                      ]}
                    >
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
                </View>
              )}

              {maxNumber > 1 && (
                <View>
                  <View style={styles.rowTop}>
                    <Image source={item.image} style={styles.image} />

                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.description,
                          { color: theme.colors.text },
                        ]}
                      >
                        {item.name}
                      </Text>

                      {minPrice !== 0 && (
                        <Text
                          style={[
                            styles.price,
                            { color: theme.colors.textMuted },
                          ]}
                        >
                          {minPrice.toLocaleString()}
                        </Text>
                      )}
                    </View>
                     
                    {figuresCategory === 'salmon' && (
                      <Text style={[styles.meta, { color: theme.colors.text }]}>
                        {item.fishScalePrice}
                      </Text>
                    )}

                    <View style={styles.slideCount}>
                      {minPrice !== 0 && (
                        <Text
                          style={[
                            styles.price,
                            { color: theme.colors.textMuted },
                          ]}
                        >
                          {(minPrice * count).toLocaleString()}
                        </Text>
                      )}

                      <Text
                        style={[
                          styles.countTextInline,
                          { color: theme.colors.text },
                        ]}
                      >
                        {count} / {maxNumber}
                      </Text>
                    </View>
                  </View>

                  <Slider
                    minimumValue={0}
                    maximumValue={maxNumber}
                    step={1}
                    value={count}
                    onValueChange={value =>
                      setObjectCount('figures', item.id, value)
                    }
                    minimumTrackTintColor={theme.colors.progressBar}
                    maximumTrackTintColor={theme.colors.border}
                    thumbTintColor={theme.colors.progressBar}
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
    padding: 16,
    paddingBottom: 0,
  },
  searchInput: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  row: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
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
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
  },
  fishScalePrice: {
    width: 80,
  },
  meta: {
    fontSize: 14,
    fontWeight: '500',
    width: 100,
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
    marginBottom: 1,
  },
  slider: {
    height: 14,
    marginBottom: 5,
  },
});
