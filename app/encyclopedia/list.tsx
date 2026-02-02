import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const ENTRIES = [
  { id: 'bonus', label: 'Bonus' },
  { id: 'gearBonus', label: 'Bonus vêtements' },
  { id: 'medals', label: 'Médailles' },
  { id: 'salmonSmell', label: 'Odeur Salmon' },
  { id: 'salmonEnnemies', label: 'Enemis Salmon Run' },
  { id: 'tickets', label: 'Tickets nourriture et équipements' },
  { id: 'experience', label: 'Expériences de niveaux' },
  { id: 'colors', label: 'Couleurs présentes' },
  { id: 'fistBump', label: 'Fist bump' },
  { id: 'tableTurf', label: 'Récompenses Cartes & Territoire' },
];

export default function EncyclopediaScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <FlatList
        data={ENTRIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() =>
              router.push({
                pathname: '/encyclopedia/[slug]',
                params: { slug: item.id },
              })
            }
          >
            <Text style={[styles.text, { color: theme.colors.text }]}>
              {item.label}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});
