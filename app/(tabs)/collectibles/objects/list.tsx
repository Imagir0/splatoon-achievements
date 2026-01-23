import { useObjects } from '@/contexts/ObjectsContext';
import { allObjects, ObjectItem } from '@/data/allObjects';
import { objectsFilters } from '@/data/filters/objectsFilters';
import { Stack } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';

export default function AllObjectsScreen() {
  const { getObjectCount } = useObjects();

  const screenWidth = Dimensions.get('window').width;
  const numColumns = 10;
  const spacing = 2;
  const itemSize = (screenWidth - spacing * (numColumns * 2)) / numColumns;

  const OBJECT_GROUP_ORDER: Array<{
    category: ObjectItem['category'];
    filterKey: string;
  }> = [
    { category: 'figures', filterKey: 'spend' },
    { category: 'stickers', filterKey: 'spend' },

    { category: 'figures', filterKey: 'rank' },

    { category: 'figures', filterKey: 'salmon' },
    { category: 'stickers', filterKey: 'salmon' },

    { category: 'figures', filterKey: 'salmonEvent' },
    { category: 'stickers', filterKey: 'salmonEvent' },

    { category: 'figures', filterKey: 'tableturf' },
    { category: 'stickers', filterKey: 'tableturf' },

    { category: 'figures', filterKey: 'story' },
    { category: 'stickers', filterKey: 'story' },

    { category: 'figures', filterKey: 'dlc' },
    { category: 'stickers', filterKey: 'dlc' },

    { category: 'stickers', filterKey: 'weapons' },

    { category: 'lockers', filterKey: 'general' },
  ];

  const sortedObjects = useMemo(() => {
    const result: ObjectItem[] = [];

    for (const group of OBJECT_GROUP_ORDER) {
      const filterFn = objectsFilters[group.category]?.[group.filterKey];
      if (!filterFn) continue;

      const items = allObjects
        .filter(filterFn)
        .sort((a, b) => a.name.localeCompare(b.name));

      result.push(...items);
    }

    return result;
  }, []);

  const handlePress = (object: ObjectItem) => {
    const message = object.name;
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Équipement', message);
    }
  };

  const GEAR_COLORS: Record<ObjectItem['category'], string> = {
    figures: 'rgb(193, 233, 194)',
    lockers: '#bfc6e9',
    stickers: 'rgb(238, 184, 177)',
  };

  function getGearColor(object: ObjectItem) {
    return GEAR_COLORS[object.category] ?? '#e5e7eb';
  }

  return (
    <View style={{ flex: 1, padding: spacing }}>
      <Stack.Screen options={{ title: 'Tous les objets / stickers' }} />

      <FlatList
        data={sortedObjects}
        keyExtractor={(item) => `${item.category}-${item.id}`}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const count = getObjectCount(item.category, item.id);
          const maxNumber = Number(item.maxNumber) || 1;

          const isFullyOwned =
            maxNumber === 1
              ? count > 0
              : count === maxNumber;

          return (
            <Pressable
              onPress={() => handlePress(item)}
              style={[
                styles.objectWrapper,
                {
                  width: itemSize,
                  height: itemSize,
                  margin: spacing,
                  backgroundColor: getGearColor(item),
                },
              ]}
            >
              <Image
                source={item.image}
                style={[
                  styles.objectImage,
                  { opacity: isFullyOwned ? 1 : 0.3 },
                ]}
              />

              {maxNumber > 1 && count > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{count}</Text>
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
  objectWrapper: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  objectImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  countBadge: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  countText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
  },
});
