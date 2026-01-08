import { useBadges } from '@/contexts/BadgesContext';
import { badgeFilters } from '@/data/badgeFilters';
import { badges } from '@/data/badges';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Définition des catégories
const collectibleCategories = [
  { key: 'splatfest', title: 'Splatfests' },
  { key: 'tableturf', title: 'Tableturf' },
  { key: 'storyMode', title: 'Story Mode' },
  { key: 'challenge', title: 'Challenge' },
  { key: 'DLC', title: 'DLC' },
  { key: 'rankLevel', title: 'Rang et niveau' },
  { key: 'equipement', title: 'Équipements' },
  { key: 'spending', title: 'Dépenses' },
  { key: 'gameModes', title: 'Modes de jeu' },
  { key: 'weapons', title: 'Armes' },
  { key: 'specialWeapons', title: 'Armes spéciales' },
];

export default function CollectiblesScreen() {
  const router = useRouter();
  const { selectedBadges } = useBadges();

  // Filtrage des badges
  const getCategoryCounters = (key: string) => {
    const filterFn = badgeFilters[key];
    if (!filterFn) return { total: 0, checked: 0 };

    const list = badges.filter(filterFn);
    const total = list.length;

    const checked = list.filter(b => selectedBadges[b.id]).length;

    return { total, checked };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Collections des badges</Text>

      {collectibleCategories.map((cat) => {
        const { total, checked } = getCategoryCounters(cat.key);

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
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  counter: {
    fontSize: 16,
    fontWeight: '600',
  },
});
