import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { Emote, emotes } from '@/data/emotes';
import { SafeAreaView } from 'react-native-safe-area-context';

type SortKey = 'name' | 'season' | 'category';
type SortOrder = 'asc' | 'desc';

export default function EmoteScreen() {
  const { theme } = useTheme();

  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const data: Emote[] = emotes;

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      return sortOrder === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data, sortKey, sortOrder]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Animation de poses',
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
            style={{ flex: 1 }}
            onPress={() => toggleSort('name')}
          >
            <HeaderLabel
              label="Nom"
              active={sortKey === 'name'}
              order={sortOrder}
              color={theme.colors.text}
            />
          </Pressable>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => toggleSort('season')}
          >
            <HeaderLabel
              label="Saison"
              active={sortKey === 'season'}
              order={sortOrder}
              color={theme.colors.text}
            />
          </Pressable>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => toggleSort('category')}
          >
            <HeaderLabel
              label="Fist-Bumps"
              active={sortKey === 'category'}
              order={sortOrder}
              color={theme.colors.text}
            />
          </Pressable>
        </View>
        <FlatList
          data={sortedData}
          keyExtractor={(item) => item.id.toString()}
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
              <Text
                style={[
                  styles.cell,
                  { flex: 1, color: theme.colors.text },
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    flex: 1,
                    textAlign: 'center',
                    color: theme.colors.textMuted,
                  },
                ]}
              >
                {item.season}
              </Text>
              <Text
                style={[
                  styles.cell,
                  { flex: 1, color: theme.colors.textMuted },
                ]}
              >
                {item.category}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  }
}

function HeaderLabel({
  label,
  active,
  order,
  color,
}: {
  label: string;
  active: boolean;
  order: SortOrder;
  color: string;
}) {
  return (
    <Text style={{ fontWeight: '600', color }}>
      {label}
      {active && (order === 'asc' ? ' ↑' : ' ↓')}
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
