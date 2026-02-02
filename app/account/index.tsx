import { useTheme } from '@/contexts/ThemeContext';
import { StyleSheet, Text, View } from 'react-native';

export default function AccountScreen() {
  const { theme } = useTheme();

  return (
    <View
    style={[
        styles.container,
        { backgroundColor: theme.colors.background },
    ]}
    >
    <Text style={[styles.title, { color: theme.colors.text }]}>
        Informations utilisateur
    </Text>

    <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
        Nom d’utilisateur
        </Text>
        <Text style={[styles.value, { color: theme.colors.textMuted }]}>
        À venir
        </Text>
    </View>

    <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
        Email
        </Text>
        <Text style={[styles.value, { color: theme.colors.textMuted }]}>
        À venir
        </Text>
    </View>

    <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
        Préférences
        </Text>
        <Text style={[styles.value, { color: theme.colors.textMuted }]}>
        En construction
        </Text>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
});
