import { useBadges } from '@/contexts/BadgesContext';
import { badges } from '@/data/badges';
import { salmonRunCategories } from '@/data/salmonRunCategories';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export default function SalmonRunIndex() {
  const router = useRouter();
  const { selectedBadges } = useBadges();

  // Animations par catégorie
  const progressAnim = useRef<Record<string, Animated.Value>>({}).current;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {Object.entries(salmonRunCategories).map(([key, config]) => {
        // Initialisation animation
        if (!progressAnim[key]) {
          progressAnim[key] = new Animated.Value(0);
        }

        // Badges filtrés pour cette catégorie
        const filteredBadges = useMemo(
          () => badges.filter(config.filter),
          [config.filter]
        );

        const total = filteredBadges.length;
        const obtained = filteredBadges.filter(
          (b) => selectedBadges[b.id]
        ).length;

        const progress = total === 0 ? 0 : obtained / total;

        // Animation
        Animated.timing(progressAnim[key], {
          toValue: progress,
          duration: 500, // ⬅️ durée modifiable
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
                pathname: '/(tabs)/collectibles/badges/salmonRun/[salmonRunCategory]',
                params: { salmonRunCategory: key },
              })
            }
            style={{
              padding: 16,
              backgroundColor: '#e5e7eb',
              borderRadius: 10,
              marginBottom: 12,
            }}
          >
            {/* Titre + compteur */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '600' }}>
                {config.title}
              </Text>

              <Text style={{ fontSize: 14, fontWeight: '600' }}>
                {obtained} / {total}
              </Text>
            </View>

            {/* Barre de progression */}
            <View
              style={{
                height: 6,
                backgroundColor: '#d1d5db',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <Animated.View
                style={{
                  height: '100%',
                  width: widthInterpolated,
                  backgroundColor: '#16a34a',
                }}
              />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
