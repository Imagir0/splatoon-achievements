import { COLORS } from '@/constants/colors';
import { useBadges } from '@/contexts/BadgesContext';
import { badges } from '@/data/badges';
import { weaponCategories } from '@/data/filters/weaponFilters';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, } from 'react-native';

export default function WeaponsIndex() {
  const router = useRouter();
  const { selectedBadges } = useBadges();

  const progressAnim = useRef<Record<string, Animated.Value>>({}).current;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(weaponCategories).map(([key, config]) => {
        if (!progressAnim[key]) {
          progressAnim[key] = new Animated.Value(0);
        }

        const filteredBadges = useMemo(
          () => badges.filter(config.filter),
          [config.filter]
        );

        const total = filteredBadges.length;
        const obtained = filteredBadges.filter(
          (b) => selectedBadges[b.id]
        ).length;

        const progress = total === 0 ? 0 : obtained / total;

        Animated.timing(progressAnim[key], {
          toValue: progress,
          duration: 500,
          useNativeDriver: false,
        }).start();

        const widthInterpolated = progressAnim[key].interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%'],
        });

        return (
          <Pressable
            key={key}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname:
                  '/(tabs)/collectibles/badges/weapons/[weaponCategory]',
                params: { weaponCategory: key },
              })
            }
          >
            <View style={styles.row}>
              <Text style={styles.title}>{config.title}</Text>
              <Text style={styles.counter}>{obtained} / {total}</Text>
            </View>

            <View style={styles.barBackground}>
              <Animated.View
                style={[
                  styles.barProgress,
                  { width: widthInterpolated },
                ]}
              />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    padding: 16,
    backgroundColor: COLORS.shades.white,
    borderRadius: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.shades.black,
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
  },
  barBackground: {
    height: 6,
    backgroundColor: COLORS.shades.order,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barProgress: {
    height: '100%',
    backgroundColor: COLORS.green.progress,
    borderRadius: 4,
  },
});
