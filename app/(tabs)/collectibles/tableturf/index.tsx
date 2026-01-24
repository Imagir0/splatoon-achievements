import { COLORS } from '@/constants/colors';
import { useTableTurf } from '@/contexts/TableTurfContext';
import { TABLETURF_CATEGORY_TITLES } from '@/data/categoryTitles/tableTurfCategoryTitles';
import { tableTurfFilters } from '@/data/filters/tableTurfFilters';
import { tableTurf } from '@/data/tableTurf';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const collectibleCategories = Object.entries(TABLETURF_CATEGORY_TITLES).map(
  ([key, title]) => ({ key, title })
);

export default function TableTurfScreen() {
  const router = useRouter();
  const { selectedTableTurf } = useTableTurf();

  const getCategoryCounters = (key: string) => {
    const filterFn = tableTurfFilters[key];
    if (!filterFn) return { total: 0, checked: 0 };

    const filtered = tableTurf.filter(filterFn);
    const total = filtered.length;
    const checked = filtered.filter(t => selectedTableTurf[t.number]).length;

    return { total, checked };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={styles.summaryCard}
        onPress={() =>
          router.push('/(tabs)/collectibles/tableturf/list')
        }
      >
        <View style={styles.summaryTopRow}>
          <Text style={styles.summaryTitle}>Cartes & Territoire</Text>
          <Text style={styles.summaryCounter}>
            {Object.values(selectedTableTurf).filter(Boolean).length}
            {' / '}
            {tableTurf.length}
          </Text>
        </View>

        <Text style={styles.summaryLink}>Voir la collection</Text>
      </Pressable>

      {collectibleCategories.map(cat => {
        const { total, checked } = getCategoryCounters(cat.key);
        const progress = total > 0 ? checked / total : 0;

        const progressAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
          Animated.timing(progressAnim, {
            toValue: progress,
            duration: 500, // harmonisé avec WeaponsScreen
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
                pathname: '/(tabs)/collectibles/tableturf/[category]',
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
    backgroundColor: COLORS.shades.white,
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
    color: COLORS.shades.black,
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
  },
  barBackground: {
    height: 8,
    width: '100%',
    backgroundColor: COLORS.shades.order,
    borderRadius: 4,
    marginTop: 6,
    overflow: 'hidden',
  },
  barProgress: {
    height: '100%',
    backgroundColor: COLORS.green.progress,
    borderRadius: 4,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: COLORS.shades.white,
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
    color: COLORS.shades.black,
  },
  summaryCounter: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryLink: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.7,
  },
});
