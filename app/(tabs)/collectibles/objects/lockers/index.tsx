import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function LockersIndexScreen() {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.row}
        onPress={() =>
          router.push({
            pathname:
              '/(tabs)/collectibles/objects/lockers/[lockersCategory]',
            params: { lockersCategory: 'general' },
          })
        }
      >
        <Text style={styles.label}>Casiers</Text>
      </Pressable>
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
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
});
