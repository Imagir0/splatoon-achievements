import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  categoryKey: string;
  title: string;
  checked: number;
  total: number;
};

export default function CategoryScreen({ categoryKey, title, checked, total }: Props) {
  const router = useRouter();
  const progress = total > 0 ? checked / total : 0;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/(tabs)/collectibles/gears/[category]',
          params: { category: categoryKey },
        })
      }
    >
      <View style={styles.row}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.counter}>
          {checked} / {total}
        </Text>
      </View>

      <View style={styles.barBackground}>
        <Animated.View
          style={[
            styles.barProgress,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  counter: {
    fontSize: 16,
    fontWeight: '600',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#d1d5db',
    borderRadius: 4,
    marginTop: 6,
    overflow: 'hidden',
  },
  barProgress: {
    height: '100%',
    backgroundColor: '#16a34a',
  },
});
