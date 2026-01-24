import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  categoryKey: string;
  title: string;
  checked: number;
  total: number;
};

export default function CategoryCard({
  categoryKey,
  title,
  checked,
  total,
}: Props) {
  const router = useRouter();
  const progress = total > 0 ? checked / total : 0;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/(tabs)/collectibles/objects/[category]',
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
    backgroundColor: COLORS.shades.white,
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
    color: COLORS.shades.black,
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
  },
  barBackground: {
    height: 8,
    backgroundColor: COLORS.shades.order,
    borderRadius: 4,
    marginTop: 6,
    overflow: 'hidden',
  },
  barProgress: {
    height: '100%',
    backgroundColor: COLORS.green.progress,
    borderRadius: 4,
  },
});
