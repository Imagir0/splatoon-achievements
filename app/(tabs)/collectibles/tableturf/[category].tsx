import { useTableTurf } from '@/contexts/TableTurfContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TABLETURF_CATEGORY_TITLES } from '@/data/categoryTitles/tableTurfCategoryTitles';
import { tableTurfFilters } from '@/data/filters/tableTurfFilters';
import { tableTurf } from '@/data/tableTurf';
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
  const { theme } = useTheme();
  const { category } = useLocalSearchParams<{ category: string }>();
  const { selectedTableTurf, toggleTableTurf } = useTableTurf();
  const navigation = useNavigation();

  const title =
    TABLETURF_CATEGORY_TITLES[category ?? ''] ?? 'Catégorie';

  React.useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  const handlePress = (number: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTableTurf(number);
  };

  const filteredTableTurf = useMemo(() => {
    const filterFn = tableTurfFilters[category ?? ''];
    return filterFn ? tableTurf.filter(filterFn) : [];
  }, [category]);

  return (
    <View style={[styles.view, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={filteredTableTurf}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedTableTurf[item.number];

          return (
            <Pressable
              onPress={() => handlePress(item.number)}
              style={[
                styles.row,
                {
                  backgroundColor: isChecked
                    ? theme.colors.rowChecked
                    : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <Image source={item.image} style={styles.image} />

              <View style={styles.content}>
                <Text style={[styles.name, { color: theme.colors.text }]}>
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
    paddingBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
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