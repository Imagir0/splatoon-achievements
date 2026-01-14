import { useWeapons } from '@/contexts/WeaponsContext';
import { weapons } from '@/data/weapons';
import { weaponsFilters } from '@/data/weaponsFilters';
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
  View
} from 'react-native';

export default function AllWeaponsScreen() {
  const { selectedWeapons } = useWeapons();
  const screenWidth = Dimensions.get('window').width;
  const numColumns = 10;
  const spacing = 2; // marge entre les badges
  const weaponsSize = (screenWidth - spacing * (numColumns * 2)) / numColumns;

  const handleWeaponsPress = (weapon: typeof weapons[0]) => {
    const message = weapon.name;
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Weapon', message);
    }
  };

  const filterColors: Record<string, string> = {
    shooter: 'rgb(242, 243, 161)',
    blaster: 'rgb(233, 177, 151)',
    roller: 'rgb(183, 243, 183)',
    brush: 'rgb(243, 174, 220)',
    charger: 'rgb(146, 155, 196)',
    slosher: 'rgb(198, 205, 240)',
    spinner: 'rgb(178, 148, 226)',
    maneuver: 'rgb(216, 124, 167)',
    shelter: 'rgb(192, 193, 196)',
    stringer: 'rgb(141, 141, 141)',
    saber: 'rgb(136, 152, 233)',
  };

  function getWeaponsColor(weapon: (typeof weapons)[number]) {
    const categoryKey = Object.keys(weaponsFilters).find((key) =>
      weaponsFilters[key](weapon)
    );
    return categoryKey ? filterColors[categoryKey] ?? '#e5e7eb' : '#e5e7eb';
  }

  return (
    <View style={{ flex: 1, padding: spacing }}>
      <Stack.Screen options={{ title: 'Toutes les armes' }} />

      <FlatList
        key={Object.keys(selectedWeapons).join('-')} // force re-render
        data={weapons}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const owned = !!selectedWeapons[item.id];
          const bgColor = getWeaponsColor(item);

          return (
            <Pressable
              onPress={() => handleWeaponsPress(item)}
              style={[
                styles.weaponsWrapper,
                { 
                  backgroundColor: bgColor,
                  width: weaponsSize,
                  height: weaponsSize,
                  margin: spacing,
                }
              ]}
            >
              <Image
                source={item.image}
                style={[styles.weaponsImage, { opacity: owned ? 1 : 0.3 }]}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  weaponsWrapper: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weaponsImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});
