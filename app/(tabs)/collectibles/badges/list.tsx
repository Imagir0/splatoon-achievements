import { useBadges } from '@/contexts/BadgesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { badges } from '@/data/badges';
import { badgeFilters } from '@/data/filters/badgeFilters';
import { Stack } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, FlatList, Image, Platform, Pressable, StyleSheet, ToastAndroid, View } from 'react-native';

export default function AllBadgesScreen() {
  const { selectedBadges } = useBadges();
  const { theme } = useTheme();
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
    'specialWeapons',
    'weapons',
  ];

  const filterColors: Record<string, string> = {
    weapons: theme.categories?.weapons,
    specialWeapons: theme.categories?.specialWeapons,
    rankLevel: theme.categories?.rank,
    gameModes: theme.categories?.rank,
    challenge: theme.categories?.challenge,
    spending: theme.categories?.spending,
    gears: theme.categories?.gears,
    splatfest: theme.categories?.splatfest,
    others: theme.categories?.others,
    tableturf: theme.categories?.tableturf,
    storyMode: theme.categories?.story,
    DLC: theme.categories?.dlc,
    salmonRun: theme.categories?.salmon,
  };

  const sortedBadges = React.useMemo(() => {
  const result: typeof badges = [];

  for (const filterKey of BADGE_GROUP_ORDER) {
    const filterFn = badgeFilters[filterKey];
    if (!filterFn) continue;

    let PRIORITY_IDS: number[] = [];
    if (filterKey === 'gameModes') {
      // Ordre personnalisé pour gameModes
      PRIORITY_IDS = [
        3000000, 3000001, 3000002,
        3000100, 3000101,
        3000400, 3000401,
        3000300, 3000301,
        3000200, 3000201
      ];
    } else {
      // Ordre par défaut pour les autres catégories
      PRIORITY_IDS = [2900000, 2900001, 2900002];
    }

    const filtered = badges
      .filter(filterFn)
      .sort((a, b) => {
        const aPriorityIndex = PRIORITY_IDS.indexOf(a.id);
        const bPriorityIndex = PRIORITY_IDS.indexOf(b.id);

        // Si l'un des deux est dans PRIORITY_IDS, on trie selon l'index
        if (aPriorityIndex !== -1 && bPriorityIndex === -1) return -1;
        if (aPriorityIndex === -1 && bPriorityIndex !== -1) return 1;
        if (aPriorityIndex !== -1 && bPriorityIndex !== -1)
          return aPriorityIndex - bPriorityIndex;

        // Sinon, tri alphabétique sur la description
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
    return categoryKey ? filterColors[categoryKey] ?? theme.colors.border : theme.colors.border;
  }

  return (
    <View style={{ flex: 1, padding: spacing, backgroundColor: theme.colors.background }}>
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
