import { useBadges } from '@/contexts/BadgesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { badges } from '@/data/badges';
import { salmonRunCategories } from '@/data/filters/salmonRunFilters';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function SalmonRunCategoryScreen() {
  const { theme } = useTheme(); // Récupération du thème
  const params = useLocalSearchParams();
  const salmonRunCategory = params.salmonRunCategory as
    | keyof typeof salmonRunCategories
    | undefined;

  const config = salmonRunCategory ? salmonRunCategories[salmonRunCategory] : undefined;
  const { selectedBadges, toggleBadge } = useBadges();

  const filteredBadges = useMemo(() => {
    if (!config) return [];
    return badges.filter(config.filter);
  }, [config]);

  if (!config) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.colors.text }}>Catégorie inconnue</Text>
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
          title: config?.title ?? 'Salmon Run',
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
                  borderWidth: 1,
                },
              ]}
            >
              <Image source={item.image} style={styles.image} />
              <Text style={[styles.description, { color: theme.colors.text }]}>
                {item.description}
              </Text>
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: isChecked
                      ? theme.colors.white
                      : theme.colors.icon,
                    backgroundColor: 'transparent',
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
