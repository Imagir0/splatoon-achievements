import { useTheme } from '@/contexts/ThemeContext';
import { useWeapons } from '@/contexts/WeaponsContext';
import { weaponsFilters } from '@/data/filters/weaponsFilters';
import { weapons } from '@/data/weapons';
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

export default function AllWeaponsScreen() {
  const { selectedWeapons } = useWeapons();
  const { theme } = useTheme();

  const screenWidth = Dimensions.get('window').width;
  const numColumns = 10;
  const spacing = 2;
  const weaponSize =
    (screenWidth - spacing * (numColumns * 2)) / numColumns;

  const handleWeaponPress = (weapon: (typeof weapons)[number]) => {
    const message = weapon.name;
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Arme', message);
    }
  };

  const filterColors: Record<string, string | undefined> = {
    shooter: theme.weapons?.shooter,
    blaster: theme.weapons?.blaster,
    roller: theme.weapons?.roller,
    brush: theme.weapons?.brush,
    charger: theme.weapons?.charger,
    slosher: theme.weapons?.slosher,
    spinner: theme.weapons?.spinner,
    maneuver: theme.weapons?.maneuver,
    shelter: theme.weapons?.shelter,
    stringer: theme.weapons?.stringer,
    saber: theme.weapons?.saber,
  };

  function getWeaponColor(weapon: (typeof weapons)[number]) {
    const categoryKey = Object.keys(weaponsFilters).find((key) =>
      weaponsFilters[key](weapon)
    );

    return categoryKey
      ? filterColors[categoryKey] ?? theme.colors.border
      : theme.colors.border;
  }

  const sortedWeapons = React.useMemo(() => {
    const result: typeof weapons = [];

    const categoryKeys = Object.keys(weaponsFilters);

    for (const key of categoryKeys) {
      const filterFn = weaponsFilters[key];
      if (!filterFn) continue;

      const filtered = weapons
        .filter(filterFn)
        .sort((a, b) => a.name.localeCompare(b.name, 'fr'));

      result.push(...filtered);
    }

    return result;
  }, []);


  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Stack.Screen options={{ title: 'Toutes les armes' }} />

      <FlatList
        key={Object.keys(selectedWeapons).join('-')}
        data={sortedWeapons}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const owned = !!selectedWeapons[item.id];
          const bgColor = getWeaponColor(item);

          return (
            <Pressable
              onPress={() => handleWeaponPress(item)}
              style={[
                styles.weaponWrapper,
                {
                  backgroundColor: bgColor,
                  width: weaponSize,
                  height: weaponSize,
                  margin: spacing,
                },
              ]}
            >
              <Image
                source={item.image}
                style={[
                  styles.weaponImage,
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
  container: {
    flex: 1,
    padding: 2,
  },
  weaponWrapper: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weaponImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});