import { useBadges } from '@/contexts/BadgesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { badges } from '@/data/badges';
import { weaponCategories } from '@/data/filters/weaponFilters';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, } from 'react-native';

export default function WeaponsIndex() {
  const router = useRouter();
  const { selectedBadges } = useBadges();
  const { theme } = useTheme();

  const progressAnim = useRef<Record<string, Animated.Value>>({}).current;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
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
            style={[
              styles.card,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}
            onPress={() =>
              router.push({
                pathname:
                  '/(tabs)/collectibles/badges/weapons/[weaponCategory]',
                params: { weaponCategory: key },
              })
            }
          >
            <View style={styles.row}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                {config.title}
              </Text>
              <Text style={[styles.counter, { color: theme.colors.textMuted }]}>
                {obtained} / {total}
              </Text>
            </View>

            <View style={[
              styles.barBackground,
              { backgroundColor: theme.colors.border },
            ]}>
              <Animated.View
                style={[
                  styles.barProgress,
                  {
                    backgroundColor: theme.colors.progressBar,
                    width: widthInterpolated,
                  },
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
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
  },
  barBackground: {
    height: 6,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barProgress: {
    height: '100%',
    borderRadius: 4,
  },
});
