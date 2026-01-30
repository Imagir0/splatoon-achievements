import { useBanners } from '@/contexts/BannersContext';
import { useTheme } from '@/contexts/ThemeContext';
import { banners } from '@/data/banners';
import { bannerFilters } from '@/data/filters/bannerFilters';
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
  const { theme } = useTheme();
  const { selectedBanners } = useBanners();
  const screenWidth = Dimensions.get('window').width;
  const numColumns = 10;
  const spacing = 2;
  const bannerSize = (screenWidth - spacing * (numColumns * 2)) / numColumns;

  const handleBannerPress = (banner: typeof banners[0]) => {
    const groupKey = getBannerGroup(banner);

    const message =
      (groupKey && BANNER_GROUP_LABELS[groupKey]) ??
      banner.howToGet;

    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Banner', message);
    }
  };

  const BANNER_GROUP_LABELS: Record<string, string> = {
    dlc: 'DLC',
    codeQR: 'QR code',
    nSwitchNews: 'News Nintendo Switch',
    jackpots: 'Jackpot',
    salmonRun: 'Salmon Run',
    tableturf: 'Cartes & Territoire',
    general: 'Catalogue',
  };

  const BANNER_GROUP_ORDER: string[] = [
    'dlc',
    'codeQR',
    'nSwitchNews',
    'jackpots',
    'salmonRun',
    'tableturf',
    'general',
  ];

  const filterColors: Record<string, string> = {
    general: theme.categories?.weapons,
    salmonRun: theme.categories?.salmon,
    tableturf: theme.categories?.tableturf,
    dlc: theme.categories?.dlc,
    codeQR: theme.categories?.codeqr,
    nSwitchNews: theme.categories?.news,
    jackpots: theme.categories?.others,
  };

  function getBannerColor(banner: (typeof banners)[number]) {
    const categoryKey = Object.keys(bannerFilters).find((key) =>
      bannerFilters[key](banner)
    );

    return categoryKey
      ? filterColors[categoryKey] ?? theme.categories.dlc
      : theme.categories.dlc;
  }

  function getBannerGroup(banner: (typeof banners)[number]) {
    return Object.keys(bannerFilters).find((key) =>
      bannerFilters[key](banner)
    );
  }

  const sortedBanners = React.useMemo(() => {
    const result: typeof banners = [];

    for (const filterKey of BANNER_GROUP_ORDER) {
      const filterFn = bannerFilters[filterKey];
      if (!filterFn) continue;

      const filtered = banners
        .filter(filterFn)
        .sort((a, b) =>
          a.id - b.id
        );
      result.push(...filtered);
    }
    return result;
  }, []);


  return (
    <View style={{ flex: 1, padding: spacing }}>
      <Stack.Screen options={{ title: 'Toutes les bannières' }} />

      <FlatList
        key={Object.keys(selectedBanners).join('-')}
        data={sortedBanners}
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
