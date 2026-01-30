
import { useTableTurf } from '@/contexts/TableTurfContext';
import { useTheme } from '@/contexts/ThemeContext';
import { tableTurf } from '@/data/tableTurf';
import { Stack } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, FlatList, Image, Platform, Pressable, StyleSheet, ToastAndroid, View } from 'react-native';

export default function AllTableTurfScreen() {
  const { theme } = useTheme();
  const { selectedTableTurf } = useTableTurf();
  const screenWidth = Dimensions.get('window').width;
  const numColumns = 10;
  const spacing = 2;
  const tableTurfSize = (screenWidth - spacing * (numColumns * 2)) / numColumns;

  const handleTableTurfPress = (card: typeof tableTurf[0]) => {
    const message = card.name;
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('TableTurf', message);
    }
  };

  return (
    <View style={{ flex: 1, padding: spacing, backgroundColor: theme.colors.background }}>
      <Stack.Screen options={{ title: 'Toutes les cartes' }} />

      <FlatList
        key={Object.keys(selectedTableTurf).join('-')}
        data={tableTurf}
        keyExtractor={(item) => item.number.toString()}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const owned = !!selectedTableTurf[item.number];

          return (
            <Pressable
              onPress={() => handleTableTurfPress(item)}
              style={[
                styles.tableTurfWrapper,
                {
                  backgroundColor: theme.categories.dlc,
                  width: tableTurfSize,
                  height: tableTurfSize,
                  margin: spacing,
                  borderWidth: 1,
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