import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import CollectiblesTabBar from '@/components/CollectiblesTabBar';

type Tab =
  | 'badges'
  | 'banners'
  | 'gears'
  | 'objects'
  | 'salmon'
  | 'tableturf'
  | 'weapons';

import BadgesScreen from './badges';
import BannersScreen from './banners';
import GearsScreen from './gears';
import ObjectsScreen from './objects';
import SalmonScreen from './salmon';
import TableturfScreen from './tableturf';
import WeaponsScreen from './weapons';

export default function CollectiblesScreen() {
  const { tab } = useLocalSearchParams<{ tab?: Tab }>();

  const [activeTab, setActiveTab] = useState<Tab>(
    tab ?? 'badges'
  );

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'badges':
        return <BadgesScreen />;
      case 'banners':
        return <BannersScreen />;
      case 'objects':
        return <ObjectsScreen />;
      case 'gears':
        return <GearsScreen />;
      case 'weapons':
        return <WeaponsScreen />;
      case 'salmon':
        return <SalmonScreen />;
      case 'tableturf':
        return <TableturfScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'Collections' }} />

      <CollectiblesTabBar activeTab={activeTab} onChange={setActiveTab} />

      <View style={{ flex: 1 }}>{renderActiveTab()}</View>
    </View>
  );
}
