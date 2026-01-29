import { useBadges } from '@/contexts/BadgesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { badges } from '@/data/badges';
import { BADGES_CATEGORY_TITLES } from '@/data/categoryTitles/badgesCategoryTitles';
import { badgeFilters } from '@/data/filters/badgeFilters';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const collectibleCategories = Object.entries(BADGES_CATEGORY_TITLES).map(
  ([key, title]) => ({ key, title })
);

export default function CollectiblesScreen() {
  const router = useRouter();
  const { selectedBadges } = useBadges();
  const { theme } = useTheme();

  const getCategoryCounters = (key: string) => {
    const filterFn = badgeFilters[key];
    if (!filterFn) return { total: 0, checked: 0 };

    const filteredBadges = badges.filter(filterFn);
    const total = filteredBadges.length;
    const checked = filteredBadges.filter(b => selectedBadges[b.id]).length;

    return { total, checked };
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >

      <Pressable
        style={[
          styles.summaryCard,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
        onPress={() =>
          router.push('/(tabs)/collectibles/badges/list')
        }
      >
        <View style={styles.summaryTopRow}>
          <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
            Badges
          </Text>
          <Text style={[styles.summaryCounter, { color: theme.colors.primary }]}>
            {Object.values(selectedBadges).filter(v => v).length}
            {' / '}
            {badges.length}
          </Text>
        </View>

        <Text style={[styles.summaryLink, { color: theme.colors.textMuted }]}>
          Voir la collection
        </Text>
      </Pressable>

      {collectibleCategories.map(cat => {
        const { total, checked } = getCategoryCounters(cat.key);
        const progress = total > 0 ? checked / total : 0;

        const progressAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
          Animated.timing(progressAnim, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
          }).start();
        }, [progress]);

        return (
          <Pressable
            key={cat.key}
            style={[
              styles.card,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/collectibles/badges/[category]',
                params: { category: cat.key },
              })
            }
          >
            <View style={styles.row}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                {cat.title}
              </Text>
              <Text style={[styles.counter, { color: theme.colors.textMuted }]}>
                {checked} / {total}
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
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
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
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
  },
  barBackground: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    marginTop: 6,
    overflow: 'hidden',
  },
  barProgress: {
    height: '100%',
    borderRadius: 4,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  summaryCounter: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryLink: {
    marginTop: 4,
    fontSize: 12,
  },
});
