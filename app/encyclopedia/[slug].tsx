import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function EncyclopediaDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>
        {slug}
      </Text>

      <Text style={{ marginTop: 12 }}>
        Contenu de l’encyclopédie pour : {slug}
      </Text>
    </View>
  );
}
