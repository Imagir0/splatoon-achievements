import { COLORS } from '@/constants/colors';
import { useWeapons } from '@/contexts/WeaponsContext';
import { WEAPONS_CATEGORY_TITLES } from '@/data/categoryTitles/weaponsCategoryTitles';
import { weaponsFilters } from '@/data/filters/weaponsFilters';
import { weapons } from '@/data/weapons';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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
  const { selectedWeapons, toggleWeapon } = useWeapons();
  const navigation = useNavigation();
  const title = WEAPONS_CATEGORY_TITLES[category ?? ''] ?? 'Catégorie';

  React.useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  const handlePress = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleWeapon(id);
  };

  const filteredWeapons = useMemo(() => {
    const filterFn = weaponsFilters[category ?? ''];
    return filterFn ? weapons.filter(filterFn) : [];
  }, [category]);

  return (
    <View style={styles.view}>
      <FlatList
        data={filteredWeapons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedWeapons[item.id];

          return (
            <Pressable
              onPress={() => handlePress(item.id)}
              style={[
                styles.row,
                isChecked && styles.rowChecked,
              ]}
            >
              <Image source={item.image} style={styles.image} />

              <View style={styles.content}>
                <Text style={styles.name}>{item.name}</Text>
              </View>

              <View style={styles.checkbox}>
                {isChecked && (
                  <MaterialIcons
                    name="check"
                    size={22}
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
    backgroundColor: COLORS.shades.white,
    borderRadius: 8,
    marginBottom: 8,
  },
  rowChecked: {
    backgroundColor: COLORS.green.rowChecked,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
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
