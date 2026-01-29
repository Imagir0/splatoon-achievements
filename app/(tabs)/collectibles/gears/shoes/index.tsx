import { useGears } from '@/contexts/GearsContext';
import { useTheme } from '@/contexts/ThemeContext';
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

export default function ShoesIndexScreen() {
  const router = useRouter();
  const { isOwned } = useGears();
  const { theme } = useTheme();

  const progressAnim = useRef<Record<string, Animated.Value>>({}).current;
  const categories = Object.entries(GEARS_CATEGORY_TITLES);

  const normalize = (str: string) =>
    str.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '');

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {categories.map(([key, title]) => {
        if (!progressAnim[key]) {
          progressAnim[key] = new Animated.Value(0);
        }

        const filteredGears = useMemo(
          () =>
            GEARS_DATA.shoes.filter(
              g => normalize(g.brand.name) === normalize(key)
            ),
          [key]
        );

        const total = filteredGears.length;
        const obtained = filteredGears.filter(g =>
          isOwned('shoes', g.id)
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
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() =>
              router.push({
                pathname:
                  '/(tabs)/collectibles/gears/shoes/[shoesCategory]',
                params: { shoesCategory: key },
              })
            }
          >
            <View style={styles.row}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                {title}
              </Text>
              <Text style={[styles.counter, { color: theme.colors.text }]}>
                {obtained} / {total}
              </Text>
            </View>

            <View
              style={[
                styles.barBackground,
                { backgroundColor: theme.colors.border },
              ]}
            >
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
