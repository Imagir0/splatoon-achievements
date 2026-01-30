import { useGears } from '@/contexts/GearsContext';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { theme } = useTheme();

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

  const GEAR_TYPE_TO_COLOR: Record<GearItem['type'], string> = {
    heads: theme.colors.primary,
    clothes: theme.colors.progressBar,
    shoes: theme.colors.rowChecked,
  };

  function getGearColor(gear: GearItem) {
    return GEAR_TYPE_TO_COLOR[gear.type] ?? theme.colors.surface;
  }

  return (
    <View style={{ flex: 1, padding: spacing, backgroundColor: theme.colors.background }}>
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
