import { useBadges } from '@/contexts/BadgesContext';
import { badges } from '@/data/badges';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useRef } from 'react';
import { Animated, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function SplatfestScreen() {

  const { selectedBadges, toggleBadge } = useBadges();

  const splatfestBadges = useMemo(
    () =>
      badges.filter(
        item =>
          item.category.includes('Fest') ||
          item.category.includes('WinCount_Tcl')
      ),
    []
  );

  const checkAnim = useRef<Record<number, Animated.Value>>({}).current;
  const cardAnim = useRef<Record<number, Animated.Value>>({}).current;

  splatfestBadges.forEach(badge => {
    if (!checkAnim[badge.id]) checkAnim[badge.id] = new Animated.Value(selectedBadges[badge.id] ? 1 : 0);
    if (!cardAnim[badge.id]) cardAnim[badge.id] = new Animated.Value(1);
  });

  const onToggle = (id: number) => {
    const newValue = !selectedBadges[id];

    if (newValue) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Animated.spring(checkAnim[id], {
      toValue: newValue ? 1 : 0,
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.timing(cardAnim[id], {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnim[id], {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    toggleBadge(id);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={splatfestBadges}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedBadges[item.id];

          return (
            <Animated.View
              style={[
                styles.row,
                isChecked && styles.rowChecked,
                { transform: [{ scale: cardAnim[item.id] }] },
              ]}
            >
              <Pressable style={styles.rowPressable} onPress={() => onToggle(item.id)}>
                <Image source={item.image} style={styles.image} />

                <Text style={styles.description}>{item.description}</Text>

                <View style={styles.checkbox} />

                <Animated.View
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 0,
                    opacity: checkAnim[item.id],
                    transform: [
                      {
                        scale: checkAnim[item.id].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 1.2],
                        }),
                      },
                    ],
                  }}
                >
                  <MaterialIcons name="check" size={45} color="#065f46" />
                </Animated.View>
              </Pressable>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  rowChecked: {
    backgroundColor: '#86efac',
  },
  rowPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 12,
    resizeMode: 'contain',
  },
  description: {
    flex: 1,
    fontSize: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#065f46',
  },
});
