import { Stack } from 'expo-router';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { medals } from '@/data/medals';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MedalsScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Médailles',
          headerShadowVisible: false,
        }}
      />

      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View
          style={[
            styles.tableHeader,
            { borderBottomColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.headerText, { width: 48 }]} />
          <Pressable
            style={{ flex: 2 }}
          >
            <HeaderLabel
              label={'Nom​'}
              color={theme.colors.text}
            />
          </Pressable>
          <Pressable
            style={{ flex: 2 }}
          >
            <HeaderLabel
              label={'Description​'}
              color={theme.colors.text}
            />
          </Pressable>
        </View>
        <FlatList
            data={medals}
            keyExtractor={(item) => item.description.toString()}
            renderItem={({ item }) => (
                <View
                style={[
                    styles.row,
                    { borderBottomColor: theme.colors.border },
                ]}
                >
                  <Image
                    source={item.image}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <Text style={[styles.cell, { flex: 1, color: theme.colors.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.cell, { flex: 1, color: theme.colors.text }]}>
                    {item.description}
                  </Text>
                </View>
            )}
            />
      </View>
    </SafeAreaView>
  );
}

function HeaderLabel({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <Text style={{ fontWeight: '600', color }}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  cell: {
    fontSize: 13,
  },
});
