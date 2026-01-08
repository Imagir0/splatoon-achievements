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

import { useBadges } from '@/contexts/BadgesContext';
import { badges } from '@/data/badges';
import { weaponCategories } from '@/data/weaponCategories';

export default function WeaponCategoryScreen() {
  const params = useLocalSearchParams();
  const weaponCategory = params.weaponCategory as
    | keyof typeof weaponCategories
    | undefined;
  const config = weaponCategory ? weaponCategories[weaponCategory] : undefined;

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

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen
        options={{
          title: config?.title ?? 'Armes',
        }}
      />

      <FlatList
        data={filteredBadges}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedBadges[item.id];

          return (
            <Pressable
              onPress={() => toggleBadge(item.id)}
              style={[
                styles.row,
                isChecked && styles.rowChecked,
              ]}
            >
              {/* Image du badge */}
              <Image source={item.image} style={styles.image} />

              {/* Description */}
              <Text style={styles.description}>{item.description}</Text>

              {/* Checkbox */}
              <View style={styles.checkbox}>
                {isChecked && <Text style={styles.checkMark}>✔</Text>}
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 8,
  },
  rowChecked: {
    backgroundColor: '#86efac',
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
    borderColor: '#065f46',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  checkMark: {
    fontSize: 18,
    color: '#065f46',
    fontWeight: '700',
  },
});
