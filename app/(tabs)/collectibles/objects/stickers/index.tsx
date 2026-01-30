import { useObjects } from '@/contexts/ObjectsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { STICKERS_CATEGORY_TITLES } from '@/data/categoryTitles/stickersCategoryTitles';
import { objectsFilters } from '@/data/filters/objectsFilters';
import { OBJECTS_DATA } from '@/data/objects';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function StickersIndexScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isOwned } = useObjects();
  const progressAnim = useRef<Record<string, Animated.Value>>({}).current;
  const categories = Object.entries(STICKERS_CATEGORY_TITLES);

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

        const filtered = useMemo(() => {
          const filterFn = objectsFilters.stickers[key];
          if (!filterFn) return [];
          return OBJECTS_DATA.stickers
            .map(s => ({ ...s, category: 'stickers' as const }))
            .filter(filterFn);
        }, [key]);

        const total = filtered.length;
        const obtained = filtered.filter(f => isOwned('stickers', f.id)).length;
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
            onPress={() =>
              router.push({
                pathname: '/(tabs)/collectibles/objects/stickers/[stickersCategory]',
                params: { stickersCategory: key },
              })
            }
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.row}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                {title}
              </Text>
              <Text
                style={[styles.counter, { color: theme.colors.textMuted }]}
              >
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