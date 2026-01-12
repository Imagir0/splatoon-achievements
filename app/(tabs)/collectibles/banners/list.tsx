import { useBanners } from '@/contexts/BannersContext';
import { bannerFilters } from '@/data/bannerFilters';
import { banners } from '@/data/banners';
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

export default function AllBannersScreen() {
  const { selectedBanners } = useBanners();
  const screenWidth = Dimensions.get('window').width;
  const numColumns = 10;
  const spacing = 2; // marge entre les badges
  const bannerSize = (screenWidth - spacing * (numColumns * 2)) / numColumns;

  const handleBannerPress = (banner: typeof banners[0]) => {
    const message = banner.howToGet;
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Banner', message);
    }
  };

  const filterColors: Record<string, string> = {
    general: '#c6cdf0ff',
    salmonRun: "#eb3919ff",
    tableturf: '#3c58e2ff',
    DLC: "#dfdfdfff",
    codeQR: '#acaeb9ff',
    nSwitchNews: '#595a63ff',
    jackpots: '#dbd27fff',
  };

  function getBannerColor(banner: (typeof banners)[number]) {
    const categoryKey = Object.keys(bannerFilters).find((key) =>
      bannerFilters[key](banner)
    );
    return categoryKey ? filterColors[categoryKey] ?? '#e5e7eb' : '#e5e7eb';
  }

  return (
    <View style={{ flex: 1, padding: spacing }}>
      <Stack.Screen options={{ title: 'Toutes les bannières' }} />

      <FlatList
        key={Object.keys(selectedBanners).join('-')} // force re-render
        data={banners}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const owned = !!selectedBanners[item.id];
          const bgColor = getBannerColor(item);

          return (
            <Pressable
              onPress={() => handleBannerPress(item)}
              style={[
                styles.bannerWrapper,
                { 
                  backgroundColor: bgColor,
                  width: bannerSize,
                  height: bannerSize,
                  margin: spacing,
                }
              ]}
            >
              <Image
                source={item.image}
                style={[styles.bannerImage, { opacity: owned ? 1 : 0.3 }]}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});
