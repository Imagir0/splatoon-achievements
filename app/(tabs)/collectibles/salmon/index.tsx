import { useSalmonSkins } from '@/contexts/SalmonRunContext';
import { salmonSkins } from '@/data/salmonSkins';
import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SalmonScreen() {
  const { selectedSalmonSkins, toggleSalmonSkins } = useSalmonSkins();

  // Tous les items Salmon Run
  const displayedSkins = salmonSkins;


  return (
    <View style={styles.container}>
      <FlatList
        data={displayedSkins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedSalmonSkins[item.id];

          return (
            <Pressable
              style={[styles.row, isChecked && styles.rowChecked]}
              onPress={() => toggleSalmonSkins(item.id)}
            >
              <Image source={item.image} style={styles.image} />

              <View style={styles.centerContent}>
                <Text style={styles.price}>
                  {item.fishScalePrice}
                </Text>
              </View>

              <View style={styles.checkbox}>
                {isChecked && <Text>✔</Text>}
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
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  rowChecked: {
    backgroundColor: '#86efac',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 12,
    resizeMode: 'contain',
  },
  centerContent: {
    flex: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#065f46',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
