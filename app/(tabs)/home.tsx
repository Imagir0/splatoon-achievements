import { useBadges } from '@/contexts/BadgesContext';
import { useBanners } from '@/contexts/BannersContext';
import { useGears } from '@/contexts/GearsContext';
import { useObjects } from '@/contexts/ObjectsContext';
import { useSalmonSkins } from '@/contexts/SalmonRunContext';
import { useTableTurf } from '@/contexts/TableTurfContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useWeapons } from '@/contexts/WeaponsContext';
import { allGears } from '@/data/allGears';
import { allObjects } from '@/data/allObjects';
import { badges } from '@/data/badges';
import { banners } from '@/data/banners';
import { salmonSkins } from '@/data/salmonSkins';
import { tableTurf } from '@/data/tableTurf';
import { weapons } from '@/data/weapons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { theme } = useTheme();

  const { selectedBadges } = useBadges();
  const { selectedBanners } = useBanners();
  const { selectedGears } = useGears();
  const { selectedObjects } = useObjects();
  const { selectedSalmonSkins } = useSalmonSkins();
  const { selectedTableTurf } = useTableTurf();
  const { selectedWeapons } = useWeapons();

  const ownedBadgesCount = Object.values(selectedBadges).filter(Boolean).length;
  const ownedBannersCount = Object.values(selectedBanners).filter(Boolean).length;
  const ownedGearsCount = Object.values(selectedGears).filter(Boolean).length;
  const ownedObjectsCount = Object.values(selectedObjects).filter(Boolean).length;
  const ownedSalmonSkinsCount = Object.values(selectedSalmonSkins).filter(Boolean).length;
  const ownedTableTurfCount = Object.values(selectedTableTurf).filter(Boolean).length;
  const ownedWeaponsCount = Object.values(selectedWeapons).filter(Boolean).length;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Récapitulatifs
      </Text>

      <View style={styles.grid}>
        {[
          ['Badges', ownedBadgesCount, badges.length],
          ['Splatiquettes', ownedBannersCount, banners.length],
          ['Objets', ownedObjectsCount, allObjects.length],
          ['Armes', ownedWeaponsCount, weapons.length],
          ['Équipements', ownedGearsCount, allGears.length],
          ['Salmon Run', ownedSalmonSkinsCount, salmonSkins.length],
          ['Cartes & Territoire', ownedTableTurfCount, tableTurf.length],
        ].map(([label, owned, total]) => (
          <Pressable
            key={label}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              {label}
            </Text>
            <Text style={[styles.counter, { color: theme.colors.primary }]}>
              {owned} / {total}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '32%',
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  counter: {
    fontSize: 9,
    fontWeight: '700',
  },
});
