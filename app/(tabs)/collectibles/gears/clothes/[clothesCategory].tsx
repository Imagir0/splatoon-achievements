import { useGears } from '@/contexts/GearsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { GEARS_CATEGORY_TITLES } from '@/data/categoryTitles/gearsCategoryTitles';
import { GEARS_DATA } from '@/data/gears';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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

export default function ClothesCategoryScreen() {
  const { theme } = useTheme();
  const { clothesCategory } =
    useLocalSearchParams<{ clothesCategory: string }>();

  const { isOwned, toggleGear } = useGears();

  const normalizeBrand = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9+]/g, '');

  const title =
    GEARS_CATEGORY_TITLES[clothesCategory ?? ''] ?? 'Catégorie';

  const filteredGears = useMemo(() => {
    return GEARS_DATA.clothes.filter(
      gear =>
        normalizeBrand(gear.brand.name) === clothesCategory
    );
  }, [clothesCategory]);

  const handlePress = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleGear('clothes', id);
  };

  return (
    <View style={styles.view}>
      <Stack.Screen options={{ title }} />

      <FlatList
        data={filteredGears}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = isOwned('clothes', item.id);

          return (
            <Pressable
              onPress={() => handlePress(item.id)}
              style={[
                styles.row,
                {
                  backgroundColor: isChecked
                    ? theme.colors.rowChecked
                    : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Image source={item.image} style={styles.image} />

              <Text style={[styles.description, { color: theme.colors.text }]}>
                {item.name}
              </Text>

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
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 12,
  },
  description: {
    flex: 1,
    fontSize: 16,
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
});
