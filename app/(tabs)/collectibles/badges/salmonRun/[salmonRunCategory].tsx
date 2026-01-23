import { COLORS } from '@/constants/colors';
import { useBadges } from '@/contexts/BadgesContext';
import { badges } from '@/data/badges';
import { salmonRunCategories } from '@/data/filters/salmonRunFilters';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function SalmonRunCategoryScreen() {
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
        <Text>Catégorie inconnue</Text>
      </View>
    );
  }

  const handlePress = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBadge(id);
  };

  return (
    <View style={styles.view}>
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
                isChecked && styles.rowChecked,
              ]}
            >
              <Image source={item.image} style={styles.image} />
              <Text style={styles.description}>
                {item.description}
              </Text>
              <View style={styles.checkbox}>
                {isChecked && (
                  <MaterialIcons
                    name="check"
                    size={24}
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
    padding: 16
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
  checkMark: {
    fontSize: 18,
    fontWeight: '700',
  },
});
