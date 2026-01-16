import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const STICKERS_CATEGORIES = {
  spend: 'Achats',
  weapons: 'Armes',
  salmon: 'Récompenses',
  salmonEvent: 'Événements Salmon Run',
  tableturf: 'Cartes & Territoire',
  story: 'Mode histoire',
  dlc: 'DLC',
};

export default function StickersIndexScreen() {
  return (
    <View style={styles.container}>
      {Object.entries(STICKERS_CATEGORIES).map(([key, label]) => (
        <Pressable
          key={key}
          style={styles.row}
          onPress={() =>
            router.push({
              pathname:
                '/(tabs)/collectibles/objects/stickers/[stickersCategory]',
              params: { stickersCategory: key },
            })
          }
        >
          <Text style={styles.label}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
});
