import { useBadges } from '@/contexts/BadgesContext';
import { badgeFilters } from '@/data/badgeFilters';
import { badges } from '@/data/badges';
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

export default function AllBadgesScreen() {
  const { selectedBadges } = useBadges();
  const screenWidth = Dimensions.get('window').width;
  const numColumns = 10;
  const spacing = 2; // marge entre les badges
  const badgeSize = (screenWidth - spacing * (numColumns * 2)) / numColumns;

  const handleBadgePress = (badge: typeof badges[0]) => {
    const message = badge.description;
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Badge', message);
    }
  };

  const filterColors: Record<string, string> = {
    weapons: '#a5b4fc',
    achievements: '#a5b4fc',
    specialWeapons: '#7288f1ff',
    rankLevel: '#a5dfa7ff',
    gameModes: '#b1eeacff',
    challenge: '#c52ae4ff',
    spending: '#ff9284ff',
    equipement: '#e66f6fff',
    splatfest: '#e76ee1ff',
    others: '#f3f576ff',
    tableturf: '#3c58e2ff',
    storyMode: '#532e2eff',
    DLC: "#dfdfdfff",
    salmonRun: "#eb3919ff",
  };

  function getBadgeColor(badge: (typeof badges)[number]) {
    const categoryKey = Object.keys(badgeFilters).find((key) =>
      badgeFilters[key](badge)
    );
    return categoryKey ? filterColors[categoryKey] ?? '#e5e7eb' : '#e5e7eb';
  }

  return (
    <View style={{ flex: 1, padding: spacing }}>
      <Stack.Screen options={{ title: 'Tous les badges' }} />

      <FlatList
        key={Object.keys(selectedBadges).join('-')} // force re-render
        data={badges}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const owned = !!selectedBadges[item.id];
          const bgColor = getBadgeColor(item);

          return (
            <Pressable
              onPress={() => handleBadgePress(item)}
              style={[
                styles.badgeWrapper,
                { 
                  backgroundColor: bgColor,
                  width: badgeSize,
                  height: badgeSize,
                  margin: spacing,
                }
              ]}
            >
              <Image
                source={item.image}
                style={[styles.badgeImage, { opacity: owned ? 1 : 0.3 }]}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badgeWrapper: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});
