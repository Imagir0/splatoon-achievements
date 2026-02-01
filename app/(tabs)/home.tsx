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
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

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

  const { getObjectsTotalSpent, getObjectsTotalPossible } = useObjects();
  const { getGearsTotalSpent, getGearsTotalPossible } = useGears();

  const {
    getTotalFishScales: getTotalBannerScales,
    getOwnedFishScales: getOwnedBannerScales,
    getOwnedFishScalesByType: getOwnedBannerScalesByType,
    getTotalFishScalesByType: getTotalBannerScalesByType,
  } = useBanners();

  const {
    getTotalFishScales: getTotalGearScales,
    getOwnedFishScales: getOwnedGearScales,
    getOwnedFishScalesByType: getOwnedGearScalesByType,
    getTotalFishScalesByType: getTotalGearScalesByType,
  } = useGears();

  const {
    getTotalFishScales: getTotalObjectScales,
    getOwnedFishScales: getOwnedObjectScales,
    getOwnedFishScalesByType: getOwnedObjectScalesByType,
    getTotalFishScalesByType: getTotalObjectScalesByType,
  } = useObjects();

  const priceOwnedObjects = getObjectsTotalSpent();
  const priceTotalObjects = getObjectsTotalPossible();

  const priceOwnedGears = getGearsTotalSpent();
  const priceTotalGears = getGearsTotalPossible();

  const totalScales = getTotalBannerScales() + getTotalGearScales() + getTotalObjectScales();
  const ownedScales = getOwnedBannerScales() + getOwnedGearScales() + getOwnedObjectScales();

  const totalScalesByType = {
    Bronze:
      getTotalBannerScalesByType().Bronze +
      getTotalGearScalesByType().Bronze +
      getTotalObjectScalesByType().Bronze,

    Silver:
      getTotalBannerScalesByType().Silver +
      getTotalGearScalesByType().Silver +
      getTotalObjectScalesByType().Silver,

    Gold:
      getTotalBannerScalesByType().Gold +
      getTotalGearScalesByType().Gold +
      getTotalObjectScalesByType().Gold,
  };

  const ownedScalesByType = {
    Bronze:
      getOwnedBannerScalesByType().Bronze +
      getOwnedGearScalesByType().Bronze +
      getOwnedObjectScalesByType().Bronze,

    Silver:
      getOwnedBannerScalesByType().Silver +
      getOwnedGearScalesByType().Silver +
      getOwnedObjectScalesByType().Silver,

    Gold:
      getOwnedBannerScalesByType().Gold +
      getOwnedGearScalesByType().Gold +
      getOwnedObjectScalesByType().Gold,
  };

  const homeCategories = [
    { label: 'Badges', key: 'badges', owned: ownedBadgesCount, total: badges.length },
    { label: 'Splatiquettes', key: 'banners', owned: ownedBannersCount, total: banners.length },
    { label: 'Objets', key: 'objects', owned: ownedObjectsCount, total: allObjects.length },
    { label: 'Armes', key: 'weapons', owned: ownedWeaponsCount, total: weapons.length },
    { label: 'Équipements', key: 'gears', owned: ownedGearsCount, total: allGears.length },
    { label: 'Salmon Run', key: 'salmon', owned: ownedSalmonSkinsCount, total: salmonSkins.length },
    { label: 'Cartes & Territoire', key: 'tableturf', owned: ownedTableTurfCount, total: tableTurf.length },
  ];

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
        {homeCategories.map(({ label, key, owned, total }) => (
          <Pressable
            key={key}
            onPress={() =>
              router.push({
                pathname: '/collectibles',
                params: { tab: key },
              })
            }
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
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Dépenses
      </Text>

      <View style={styles.grid}>
        {[
          ['Objets', priceOwnedObjects, priceTotalObjects],
          ['Équipements', priceOwnedGears, priceTotalGears],
          ['Écailles', ownedScales, totalScales],
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

            {label != 'Écailles' && (
              <View>
                <Text style={[styles.counter, { color: theme.colors.primary }]}>
                  {owned.toLocaleString()} / {total.toLocaleString()}
                </Text>
              </View>
            )}
            {label === 'Écailles' && (
              <Text style={[styles.counter, { color: theme.colors.primary }]}>
                🟤 {ownedScalesByType.Bronze}/{totalScalesByType.Bronze}{'\n'}
                ⚪ {ownedScalesByType.Silver}/{totalScalesByType.Silver}{'\n'}
                🟡 {ownedScalesByType.Gold}/{totalScalesByType.Gold}
              </Text>
            )}
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
