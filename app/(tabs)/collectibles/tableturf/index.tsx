import { useTableTurf } from '@/contexts/TableTurfContext';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { theme } = useTheme();
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
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Pressable
        style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
        onPress={() => router.push('/(tabs)/collectibles/tableturf/list')}
      >
        <View style={styles.summaryTopRow}>
          <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>Cartes & Territoire</Text>
          <Text style={[styles.summaryCounter, { color: theme.colors.text }]}>
            {Object.values(selectedTableTurf).filter(Boolean).length} / {tableTurf.length}
          </Text>
        </View>
        <Text style={[styles.summaryLink, { color: theme.colors.textMuted }]}>Voir la collection</Text>
      </Pressable>

      {collectibleCategories.map(cat => {
        const { total, checked } = getCategoryCounters(cat.key);
        const progress = total > 0 ? checked / total : 0;
        const progressAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
          Animated.timing(progressAnim, {
            toValue: progress,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }).start();
        }, [progress]);

        return (
          <Pressable
            key={cat.key}
            style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
            onPress={() => router.push({
              pathname: '/(tabs)/collectibles/tableturf/[category]',
              params: { category: cat.key },
            })}
          >
            <View style={styles.row}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{cat.title}</Text>
              <Text style={[styles.counter, { color: theme.colors.text }]}>{checked} / {total}</Text>
            </View>

            <View style={[styles.barBackground, { backgroundColor: theme.colors.border }]}>
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
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 10,
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