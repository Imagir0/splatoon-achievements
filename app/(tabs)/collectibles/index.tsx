import { useBadges } from '@/contexts/BadgesContext';
import { badgeFilters } from '@/data/badgeFilters';
import { badges } from '@/data/badges';
import { CATEGORY_TITLES } from '@/data/categoryTitles';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const collectibleCategories = Object.entries(CATEGORY_TITLES).map(
  ([key, title]) => ({ key, title })
);

export default function CollectiblesScreen() {
  const router = useRouter();
  const { selectedBadges } = useBadges();

  // Fonction pour compter les badges cochés et totaux par catégorie
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
      <Text style={styles.title}>Collections des badges</Text>

      <View style={styles.summaryRow}>
        {/* Badge possédés */}
        <View style={styles.summaryTile}>
          <Text style={styles.summaryText}>Possédés</Text>
          <Text style={styles.summaryNumber}>
            {Object.values(selectedBadges).filter(v => v).length}
          </Text>
        </View>

        {/* Total badges */}
        <View style={styles.summaryTile}>
          <Text style={styles.summaryText}>Total</Text>
          <Text style={styles.summaryNumber}>{badges.length}</Text>
        </View>
      </View>

      {collectibleCategories.map(cat => {
        const { total, checked } = getCategoryCounters(cat.key);
        const progress = total > 0 ? checked / total : 0;

        // Animated value pour la barre de progression
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
                pathname: '/(tabs)/collectibles/[category]',
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

            {/* Barre animée */}
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '700',
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
  summaryRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 16,
  },
  summaryTile: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#e5e7eb'
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  }
});
