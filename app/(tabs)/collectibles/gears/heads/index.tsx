import { COLORS } from '@/constants/colors';
import { useGears } from '@/contexts/GearsContext';
import { GEARS_CATEGORY_TITLES } from '@/data/categoryTitles/gearsCategoryTitles';
import { GEARS_DATA } from '@/data/gears';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HeadsIndexScreen() {
  const router = useRouter();
  const { isOwned } = useGears();

  const progressAnim = useRef<Record<string, Animated.Value>>({}).current;
  const categories = Object.entries(GEARS_CATEGORY_TITLES);

  const normalize = (str: string) =>
    str.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {categories.map(([key, title]) => {
        if (!progressAnim[key]) {
          progressAnim[key] = new Animated.Value(0);
        }

        const filtered = useMemo(
          () =>
            GEARS_DATA.heads.filter(
              gear =>
                normalize(gear.brand.name) === normalize(key)
            ),
          [key]
        );

        const total = filtered.length;
        const obtained = filtered.filter(gear =>
          isOwned('heads', gear.id)
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
                  '/(tabs)/collectibles/gears/heads/[headsCategory]',
                params: { headsCategory: key },
              })
            }
          >
            <View style={styles.row}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.counter}>
                {obtained} / {total}
              </Text>
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
    alignItems: 'center',
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
