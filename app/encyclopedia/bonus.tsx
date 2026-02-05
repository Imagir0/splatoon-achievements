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
import { Bonus, bonus } from '@/data/bonus';
import { SafeAreaView } from 'react-native-safe-area-context';

type SortKey = 'brand' | 'likely' | 'unlikely';
type SortOrder = 'asc' | 'desc';

export default function BonusScreen() {
  const { theme } = useTheme();

  const [sortKey, setSortKey] = useState<SortKey>('brand');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const data: Bonus[] = bonus;

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
          title: 'Bonus d\'équipements',
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
            onPress={() => toggleSort('brand')}
          >
            <HeaderLabel
              label="Marque"
              active={sortKey === 'brand'}
              order={sortOrder}
              color={theme.colors.text}
            />
          </Pressable>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => toggleSort('likely')}
          >
            <HeaderLabel
              label={'Probabilité ⬆️​'}
              active={sortKey === 'likely'}
              order={sortOrder}
              color={theme.colors.text}
            />
          </Pressable>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => toggleSort('unlikely')}
          >
            <HeaderLabel
              label={'Probabilité ⬇️​'}
              active={sortKey === 'unlikely'}
              order={sortOrder}
              color={theme.colors.text}
            />
          </Pressable>
        </View>
        <FlatList
            data={sortedData}
            keyExtractor={(item) => item.brand.toString()}
            renderItem={({ item }) => (
                <View
                style={[
                    styles.row,
                    { borderBottomColor: theme.colors.border },
                ]}
                >
                <View style={styles.column}>
                    <Image
                    source={item.brandImage}
                    style={styles.image}
                    resizeMode="contain"
                    />
                    <Text style={[styles.cell, { color: theme.colors.text }]}>
                    {item.brand}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Image
                    source={item.likelyImage}
                    style={styles.image}
                    resizeMode="contain"
                    />
                    <Text
                    style={[
                        styles.cell,
                        { color: theme.colors.textMuted, textAlign: 'center' },
                    ]}
                    >
                    {item.likely}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Image
                    source={item.unlikelyImage}
                    style={styles.image}
                    resizeMode="contain"
                    />
                    <Text
                    style={[
                        styles.cell,
                        { color: theme.colors.textMuted, textAlign: 'center' },
                    ]}
                    >
                    {item.unlikely}
                    </Text>
                </View>
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
