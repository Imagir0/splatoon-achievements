import { COLORS } from '@/constants/colors';
import { useObjects } from '@/contexts/ObjectsContext';
import { allObjects } from '@/data/allObjects';
import { objectsFilters } from '@/data/filters/objectsFilters';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function LockersScreen() {
  const { isOwned, toggleObject } = useObjects();

  const lockers = useMemo(() => {
    const filterFn = objectsFilters.lockers.general;
    if (!filterFn) return [];
    return allObjects.filter(filterFn).sort((a, b) => a.id - b.id);
  }, []);

  const handlePress = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleObject('lockers', id);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Casiers' }} />

      <FlatList
        data={lockers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const owned = isOwned('lockers', item.id);

          return (
            <Pressable
              style={[
                styles.row,
                owned && styles.rowOwned,
              ]}
              onPress={() => handlePress(item.id)}
            >
              <Image source={item.image} style={styles.image} />

              <Text style={styles.name}>{item.name}</Text>

              <View style={styles.checkbox}>
                {owned && (
                  <MaterialIcons
                    name="check"
                    size={22}
                    color={COLORS.shades.black}
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
  container: {
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
  rowOwned: {
    backgroundColor: COLORS.green.rowChecked,
  },
  image: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    marginRight: 12,
  },
  name: {
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
