import { useObjects } from '@/contexts/ObjectsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { STICKERS_CATEGORY_TITLES } from '@/data/categoryTitles/stickersCategoryTitles';
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

export default function StickersCategoryScreen() {
  const { stickersCategory } = useLocalSearchParams<{ stickersCategory: string }>();
  const { theme } = useTheme();

  const { isOwned, toggleObject, getObjectCount, setObjectCount } = useObjects();

  const title = STICKERS_CATEGORY_TITLES[stickersCategory ?? ''] ?? 'Catégorie';
  const filterFn = objectsFilters.stickers[stickersCategory ?? ''];

  const [search, setSearch] = useState('');
  const searchableCategories = ['spend', 'weapons'];
  const showSearch = stickersCategory ? searchableCategories.includes(stickersCategory) : false;

  const filteredStickers = useMemo(() => {
    if (!filterFn) return [];

    return OBJECTS_DATA.stickers
      .map(f => ({ ...f, category: 'stickers' as const, price: Number(f.price ?? 0) }))
      .filter(
        sticker =>
          filterFn(sticker) &&
          (!showSearch || sticker.name.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filterFn, stickersCategory, search, showSearch]);

  const handlePress = (id: number, maxNumber: number) => {
    if (maxNumber === 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleObject('stickers', id);
    }
  };

  const handleSliderChange = (id: number, value: number, maxNumber: number) => {
    setObjectCount('stickers', id, value);
    if (value === maxNumber) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
          placeholder="Rechercher un autocollant…"
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
        data={filteredStickers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          const maxNumber = Number(item.maxNumber ?? 1);
          const minPrice = Number(item.price ?? 0);
          const count = getObjectCount('stickers', item.id);
          const isChecked = isOwned('stickers', item.id);
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
              onPress={
                maxNumber === 1
                  ? () => handlePress(item.id, maxNumber)
                  : undefined
              }
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

                  {stickersCategory === 'tableturf' && (
                    <View style={styles.tableturf}>
                      <Text
                        style={[
                          styles.price,
                          { color: theme.colors.textMuted },
                        ]}
                      >
                        {item.note}
                      </Text>
                    </View>
                  )}

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
 
                    {stickersCategory === 'salmon' && (
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
                      handleSliderChange(item.id, value, maxNumber)
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
  tableturf: {
    width: 100,
  },
  meta: {
    fontSize: 14,
    fontWeight: '500',
    width: 90,
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