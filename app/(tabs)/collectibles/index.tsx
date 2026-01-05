import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue dans vos succès !</Text>

      <Pressable style={styles.button} onPress={() => router.push('/(tabs)/collectibles/weapons')}>
        <Text style={styles.buttonText}>Succès d'armes</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/(tabs)/collectibles/ranked')}>
        <Text style={styles.buttonText}>Succès des modes</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/(tabs)/collectibles/salmon-run')}>
        <Text style={styles.buttonText}>Succès d'équipement</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});
