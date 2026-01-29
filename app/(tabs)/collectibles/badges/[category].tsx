import { useBadges } from '@/contexts/BadgesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { badges } from '@/data/badges';
import { BADGES_CATEGORY_TITLES } from '@/data/categoryTitles/badgesCategoryTitles';
import { badgeFilters } from '@/data/filters/badgeFilters';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
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
  const params = useLocalSearchParams<{ category?: string }>();
  const category = params.category;
  const { selectedBadges, toggleBadge } = useBadges();
  const title = BADGES_CATEGORY_TITLES[category ?? ''];

  const filteredBadges = useMemo(() => {
    const filterFn = category ? badgeFilters[category] : undefined;
    return filterFn ? badges.filter(filterFn) : [];
  }, [category]);

  if (!category || !badgeFilters[category]) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>
          Catégorie inconnue
        </Text>
      </View>
    );
  }

  const handlePress = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBadge(id);
  };

  return (
    <View style={[styles.view, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: title ?? 'Catégorie',
          headerStyle: { backgroundColor: theme.colors.header },
          headerTintColor: theme.colors.text,
        }}
      />

      <FlatList
        data={filteredBadges}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedBadges[item.id];

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

              <Text
                style={[
                  styles.description,
                  { color: theme.colors.text },
                ]}
              >
                {item.description}
              </Text>

              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: isChecked
                      ? theme.colors.white
                      : theme.colors.icon,
                    backgroundColor: isChecked
                      ? 'transparent'
                      : 'transparent',
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});