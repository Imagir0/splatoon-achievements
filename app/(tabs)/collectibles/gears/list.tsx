import { useGears } from '@/contexts/GearsContext';
import { allGears, GearItem } from '@/data/allGears';
import { Stack } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, FlatList, Image, Platform, Pressable, StyleSheet, ToastAndroid, View } from 'react-native';

export default function AllGearsScreen() {
  const { isOwned } = useGears();
  const screenWidth = Dimensions.get('window').width;
  const numColumns = 10;
  const spacing = 2;
  const itemSize = (screenWidth - spacing * (numColumns * 2)) / numColumns;

  const handlePress = (gear: GearItem) => {
    const message = gear.name;
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Équipement', message);
    }
  };

  const GEAR_COLORS: Record<GearItem['type'], string> = {
        clothes: '#a5dfa7ff',
        heads: '#a5b4fc',
        shoes: '#ff9284ff',
    };

    function getGearColor(gear: GearItem) {
    return GEAR_COLORS[gear.type] ?? '#e5e7eb';
    }

  return (
    <View style={{ flex: 1, padding: spacing }}>
      <Stack.Screen options={{ title: 'Tous les équipements' }} />

      <FlatList
        data={allGears}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const owned = isOwned(item.type, item.id);

          return (
            <Pressable
              onPress={() => handlePress(item)}
              style={[
                styles.gearWrapper,
                {
                  width: itemSize,
                  height: itemSize,
                  margin: spacing,
                  backgroundColor: getGearColor(item),
                },
              ]}
            >
              <Image
                source={item.image}
                style={[
                  styles.gearImage,
                  { opacity: owned ? 1 : 0.3 },
                ]}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gearWrapper: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});
