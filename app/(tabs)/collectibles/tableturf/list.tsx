import { COLORS } from '@/constants/colors';
import { useTableTurf } from '@/contexts/TableTurfContext';
import { tableTurfFilters } from '@/data/filters/tableTurfFilters';
import { tableTurf } from '@/data/tableTurf';
import { Stack } from 'expo-router';
import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';

export default function AllTableTurfScreen() {
  const { selectedTableTurf } = useTableTurf();

  const screenWidth = Dimensions.get('window').width;
  const numColumns = 10;
  const spacing = 2;
  const tableTurfSize =
    (screenWidth - spacing * (numColumns * 2)) / numColumns;

  const handleTableTurfPress = (card: typeof tableTurf[0]) => {
    const message = card.name;

    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('TableTurf', message);
    }
  };

  const filterColors: Record<string, string> = {
    season1: COLORS.shades.white,
    season2: COLORS.shades.order,
    season3: COLORS.shades.white,
    season4: COLORS.shades.order,
    season5: COLORS.shades.white,
    season6: COLORS.shades.order,
    season7: COLORS.shades.white,
    season8: COLORS.shades.order,
  };

  function getTableTurfColor(card: (typeof tableTurf)[number]) {
    const categoryKey = Object.keys(tableTurfFilters).find((key) =>
      tableTurfFilters[key](card)
    );

    return categoryKey
      ? filterColors[categoryKey] ?? COLORS.shades.order
      : COLORS.shades.order;
  }

  return (
    <View style={{ flex: 1, padding: spacing }}>
      <Stack.Screen options={{ title: 'Toutes les cartes' }} />

      <FlatList
        key={Object.keys(selectedTableTurf).join('-')}
        data={tableTurf}
        keyExtractor={(item) => item.number.toString()}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const owned = !!selectedTableTurf[item.number];
          const bgColor = getTableTurfColor(item);

          return (
            <Pressable
              onPress={() => handleTableTurfPress(item)}
              style={[
                styles.tableTurfWrapper,
                {
                  backgroundColor: bgColor,
                  width: tableTurfSize,
                  height: tableTurfSize,
                  margin: spacing,
                },
              ]}
            >
              <Image
                source={item.image}
                style={[
                  styles.tableTurfImage,
                  { opacity: owned ? 1 : 0.3 },
                ]}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tableTurfWrapper: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableTurfImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});
