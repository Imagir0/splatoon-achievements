import { useTableTurf } from '@/contexts/TableTurfContext';
import { tableTurf } from '@/data/tableTurf';
import { tableTurfFilters } from '@/data/tableTurfFilters';
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
  View
} from 'react-native';

export default function AlltableTurfScreen() {
  const { selectedTableTurf } = useTableTurf();
  const screenWidth = Dimensions.get('window').width;
  const numColumns = 10;
  const spacing = 2; // marge entre les tableTurf
  const tableTurfSize = (screenWidth - spacing * (numColumns * 2)) / numColumns;

  const handleTableTurfPress = (tT: typeof tableTurf[0]) => {
    const message = tT.name;
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('TableTurf', message);
    }
  };

  const filterColors: Record<string, string> = {
    season1: 'rgb(223, 226, 241)',
    season2: 'rgb(190, 199, 243)',
    season4: 'rgb(163, 176, 240)',
    season5: 'rgb(141, 157, 236)',
    season6: 'rgb(108, 128, 231)',
    season7: 'rgb(79, 103, 223)',
    season8: 'rgb(51, 76, 202)',
  };

  function getTableTurfColor(tT: (typeof tableTurf)[number]) {
    const categoryKey = Object.keys(tableTurfFilters).find((key) =>
      tableTurfFilters[key](tT)
    );
    return categoryKey ? filterColors[categoryKey] ?? '#e5e7eb' : '#e5e7eb';
  }

  return (
    <View style={{ flex: 1, padding: spacing }}>
      <Stack.Screen options={{ title: 'Toutes les cartes' }} />

      <FlatList
        key={Object.keys(selectedTableTurf).join('-')} // force re-render
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
                }
              ]}
            >
              <Image
                source={item.image}
                style={[styles.tableTurfImage, { opacity: owned ? 1 : 0.3 }]}
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
