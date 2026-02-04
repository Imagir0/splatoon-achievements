import { useTheme } from '@/contexts/ThemeContext';
import { Stack, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const ENTRIES = [
  { id: 'bonus', label: '↗️​ Bonus vêtements' },
  { id: 'medals', label: 'Médailles' },
  { id: 'salmonSmell', label: 'Odeur Salmon' },
  { id: 'salmonEnnemies', label: 'Ennemis Salmon Run' },
  { id: 'tickets', label: 'Tickets nourriture et équipements' },
  { id: 'experience', label: 'Expériences de niveaux' },
  { id: 'colors', label: '🎨 Couleurs' },
  { id: 'emote', label: '🏆 Animations de poses' },
  { id: 'tableTurf', label: 'Cartes & Territoire' },
];

export default function EncyclopediaScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Encyclopédie',
          headerShadowVisible: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <FlatList
          data={ENTRIES}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Pressable
              style={styles.item}
              onPress={() =>
                router.push({
                  pathname: './encyclopedia/[id]',
                  params: { id: String(item.id) },
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
    </>
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
