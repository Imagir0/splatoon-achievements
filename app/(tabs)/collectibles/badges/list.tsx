import { COLORS } from '@/constants/colors';
import { useBadges } from '@/contexts/BadgesContext';
import { badges } from '@/data/badges';
import { badgeFilters } from '@/data/filters/badgeFilters';
import { Stack } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, FlatList, Image, Platform, Pressable, StyleSheet, ToastAndroid, View } from 'react-native';

export default function AllBadgesScreen() {
  const { selectedBadges } = useBadges();
  const screenWidth = Dimensions.get('window').width;
  const numColumns = 10;
  const spacing = 2;
  const badgeSize = (screenWidth - spacing * (numColumns * 2)) / numColumns;

  const handleBadgePress = (badge: typeof badges[0]) => {
    const message = badge.description;
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Badge', message);
    }
  };

  const BADGE_GROUP_ORDER: string[] = [
  'storyMode',
  'DLC',
  'spending',
  'others',
  'splatfest',
  'challenge',
  'rankLevel',
  'gameModes',
  'gears',
  'tableturf',
  'salmonRun',
  'weapons',
  'specialWeapons',
];

  const filterColors: Record<string, string> = {
    weapons: COLORS.blue.weapons,
    specialWeapons: COLORS.blue.specialWeapons,
    rankLevel: COLORS.green.rank,
    gameModes: COLORS.green.rank,
    challenge: COLORS.violet.challenge,
    spending: COLORS.red.spending,
    gears: COLORS.red.gears,
    splatfest: COLORS.violet.splatfest,
    others: COLORS.yellow.others,
    tableturf: COLORS.violet.tableturf,
    storyMode: COLORS.red.story,
    DLC: COLORS.shades.order,
    salmonRun: COLORS.orange.salmon,
  };

  const sortedBadges = React.useMemo(() => {
    const result: typeof badges = [];

    for (const filterKey of BADGE_GROUP_ORDER) {
      const filterFn = badgeFilters[filterKey];
      if (!filterFn) continue;

      const PRIORITY_IDS = [2900000, 2900001, 2900002];
      const filtered = badges
        .filter(filterFn)
        .sort((a, b) => {
          const aPriority = PRIORITY_IDS.includes(a.id);
          const bPriority = PRIORITY_IDS.includes(b.id);
          if (aPriority && !bPriority) return -1;
          if (!aPriority && bPriority) return 1;
          return a.description.localeCompare(b.description);
        });
      result.push(...filtered);
    }
    return result;
  }, []);



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
        key={Object.keys(selectedBadges).join('-')}
        data={sortedBadges}
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
