import { useBadges } from '@/contexts/BadgesContext';
import { badgeFilters } from '@/data/badgeFilters';
import { badges } from '@/data/badges';
import { BADGES_CATEGORY_TITLES } from '@/data/badgesCategoryTitles';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const collectibleCategories = Object.entries(BADGES_CATEGORY_TITLES).map(
  ([key, title]) => ({ key, title })
);

export default function CollectiblesScreen() {
  const router = useRouter();
  const { selectedBadges } = useBadges();

  const getCategoryCounters = (key: string) => {
    const filterFn = badgeFilters[key];
    if (!filterFn) return { total: 0, checked: 0 };

    const filteredBadges = badges.filter(filterFn);
    const total = filteredBadges.length;
    const checked = filteredBadges.filter(b => selectedBadges[b.id]).length;

    return { total, checked };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={styles.summaryCard}
        onPress={() =>
          router.push('/(tabs)/collectibles/badges/list')
        }
      >
        <View style={styles.summaryTopRow}>
          <Text style={styles.summaryTitle}>Badges</Text>
          <Text style={styles.summaryCounter}>
            {Object.values(selectedBadges).filter(v => v).length}
            {' / '}
            {badges.length}
          </Text>
        </View>

        <Text style={styles.summaryLink}>
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
            duration: 1200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }).start();
        }, [progress]);

        return (
          <Pressable
            key={cat.key}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/collectibles/badges/[category]',
                params: { category: cat.key },
              })
            }
          >
            <View style={styles.row}>
              <Text style={styles.cardTitle}>{cat.title}</Text>
              <Text style={styles.counter}>
                {checked} / {total}
              </Text>
            </View>

            <View style={styles.barBackground}>
              <Animated.View
                style={[
                  styles.barProgress,
                  {
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
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
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
    fontSize: 16,
    fontWeight: '600',
  },
  barBackground: {
    height: 8,
    width: '100%',
    backgroundColor: '#d1d5db',
    borderRadius: 4,
    marginTop: 6,
    overflow: 'hidden',
  },
  barProgress: {
    height: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 4,
  },
    summaryCard: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    marginBottom: 20,
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
    color: '#374151',
    opacity: 0.7,
  },

});
