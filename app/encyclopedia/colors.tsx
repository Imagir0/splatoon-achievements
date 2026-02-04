import { useTheme } from '@/contexts/ThemeContext';
import { colors, getRandomShape } from '@/data/colors';
import { Stack } from 'expo-router';
import { useMemo } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function ColorsScreen() {
  const { theme } = useTheme();
  const rowsWithImages = useMemo(() => {
    return colors.map(color => ({
      ...color,
      images: [
        getRandomShape(),
        getRandomShape(),
        getRandomShape(),
        getRandomShape(),
      ],
    }));
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Couleurs',
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

          <View style={{ flex: 3 }}>
            <HeaderLabel label="Nom" color={theme.colors.text} />
          </View>

          <View style={{ flex: 1 }}>
            <HeaderLabel label="Alpha" color={theme.colors.text} />
          </View>

          <View style={{ flex: 1 }}>
            <HeaderLabel label="Bravo" color={theme.colors.text} />
          </View>

          <View style={{ flex: 1 }}>
            <HeaderLabel label="Charlie" color={theme.colors.text} />
          </View>

          <View style={{ flex: 1 }}>
            <HeaderLabel label="Neutral" color={theme.colors.text} />
          </View>
        </View>
        <FlatList
          data={rowsWithImages}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={[styles.row, { borderBottomColor: theme.colors.text }]}>
              <Text style={[styles.cell, { flex: 1, color: theme.colors.text }]}>
                {item.name}
              </Text>
              <Image
                source={item.images[0]}
                style={[styles.image, { tintColor: `#${item.alpha}` }]}
                resizeMode="contain"
              />
              <Image
                source={item.images[1]}
                style={[styles.image, { tintColor: `#${item.bravo}` }]}
                resizeMode="contain"
              />
              <Image
                source={item.images[2]}
                style={[styles.image, { tintColor: `#${item.charlie}` }]}
                resizeMode="contain"
              />
              <Image
                source={item.images[3]}
                style={[styles.image, { tintColor: `#${item.neutral}` }]}
                resizeMode="contain"
              />
            </View>
          )}
        />
      </View>
    </>
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
  image: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  cell: {
    fontSize: 14,
  },
});
