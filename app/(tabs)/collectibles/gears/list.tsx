import { COLORS } from '@/constants/colors';
import { useGears } from '@/contexts/GearsContext';
import { allGears, GearItem } from '@/data/allGears';
import { Stack } from 'expo-router';
import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';

export default function AllGearsScreen() {
  const { isOwned } = useGears();

  const screenWidth = Dimensions.get('window').width;
  const numColumns = 10;
  const spacing = 2;
  const itemSize =
    (screenWidth - spacing * (numColumns * 2)) / numColumns;

  const handlePress = (gear: GearItem) => {
    const message = gear.name;
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Équipement', message);
    }
  };

  const GEAR_TYPE_TO_COLOR: Record<GearItem['type'], keyof typeof COLORS.categories> = {
    heads: 'blue',
    clothes: 'green',
    shoes: 'red',
  };

  function getGearColor(gear: GearItem) {
    const colorKey = GEAR_TYPE_TO_COLOR[gear.type];
    return COLORS.categories[colorKey] ?? COLORS.shades.order;
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
          const bgColor = getGearColor(item);

          return (
            <Pressable
              onPress={() => handlePress(item)}
              style={[
                styles.itemWrapper,
                {
                  width: itemSize,
                  height: itemSize,
                  margin: spacing,
                  backgroundColor: bgColor,
                },
              ]}
            >
              <Image
                source={item.image}
                style={[
                  styles.itemImage,
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
  itemWrapper: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});
