import { useGears } from '@/contexts/GearsContext';
import { GEARS_DATA } from '@/data/gears';
import { GEARS_CATEGORY_TITLES } from '@/data/gearsCategoryTitles';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';

export default function ShoesIndexScreen() {
  const router = useRouter();
  const { isOwned } = useGears();
  const progressAnim = useRef<Record<string, Animated.Value>>({}).current;
  const categories = Object.entries(GEARS_CATEGORY_TITLES);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {categories.map(([key, title]) => {
        if (!progressAnim[key]) {
          progressAnim[key] = new Animated.Value(0);
        }

        const filtered = useMemo(
          () => GEARS_DATA.shoes.filter(g => g.brand.name.toLowerCase() === key.toLowerCase()),
          [key]
        );

        const total = filtered.length;
        const obtained = filtered.filter(g => isOwned('shoes', g.id)).length;
        const progress = total === 0 ? 0 : obtained / total;

        Animated.timing(progressAnim[key], {
          toValue: progress,
          duration: 500,
          useNativeDriver: false,
        }).start();

        const widthInterpolated = progressAnim[key].interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%'],
        });

        return (
          <Pressable
            key={key}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/collectibles/gears/shoes/[shoesCategory]',
                params: { shoesCategory: key },
              })
            }
            style={{ padding: 16, backgroundColor: '#e5e7eb', borderRadius: 10, marginBottom: 12 }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: '600' }}>{title}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>{obtained} / {total}</Text>
            </View>

            <View style={{ height: 6, backgroundColor: '#d1d5db', borderRadius: 4, overflow: 'hidden' }}>
              <Animated.View style={{ height: '100%', width: widthInterpolated, backgroundColor: '#16a34a' }} />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
