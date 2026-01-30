import { useObjects } from '@/contexts/ObjectsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { allObjects } from '@/data/allObjects';
import { OBJECTS_DATA } from '@/data/objects';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ObjectType = keyof typeof OBJECTS_DATA;

const OBJECT_LABELS: Record<ObjectType, string> = {
  figures: 'Objets',
  lockers: 'Casiers',
  stickers: 'Autocollants',
};

const objectCategories = (Object.keys(OBJECTS_DATA) as ObjectType[]).map(type => ({
  key: type,
  title: OBJECT_LABELS[type],
}));

export default function ObjectsIndexScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { selectedObjects } = useObjects();

  const getCategoryCounters = (type: ObjectType) => {
    const data = OBJECTS_DATA[type];
    const total = data.length;

    const checked = data.filter(
      item => selectedObjects[`${type}-${item.id}`]
    ).length;

    return { total, checked };
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Pressable
        style={[
          styles.summaryCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() =>
          router.push('/(tabs)/collectibles/objects/list')
        }
      >
        <View style={styles.summaryTopRow}>
          <Text
            style={[
              styles.summaryTitle,
              { color: theme.colors.text },
            ]}
          >
            Objets / Autocollants / Casiers
          </Text>
          <Text
            style={[
              styles.summaryCounter,
              { color: theme.colors.text },
            ]}
          >
            {Object.values(selectedObjects).filter(Boolean).length}
            {' / '}
            {allObjects.length}
          </Text>
        </View>

        <Text
          style={[
            styles.summaryLink,
            { color: theme.colors.textMuted },
          ]}
        >
          Voir la collection
        </Text>
      </Pressable>

      {objectCategories.map(cat => {
        const { total, checked } = getCategoryCounters(cat.key);
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
            key={cat.key}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/collectibles/objects/[category]',
                params: { category: cat.key },
              })
            }
          >
            <View style={styles.row}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: theme.colors.text },
                ]}
              >
                {cat.title}
              </Text>
              <Text
                style={[
                  styles.counter,
                  { color: theme.colors.text },
                ]}
              >
                {checked} / {total}
              </Text>
            </View>
            <View
              style={[
                styles.barBackground,
                { backgroundColor: theme.colors.border },
              ]}
            >
              <Animated.View
                style={[
                  styles.barProgress,
                  {
                    backgroundColor: theme.colors.progressBar,
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
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
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
    fontSize: 14,
    fontWeight: '600',
  },
  barBackground: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    marginTop: 6,
    overflow: 'hidden',
  },
  barProgress: {
    height: '100%',
    borderRadius: 4,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  summaryCounter: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryLink: {
    marginTop: 4,
    fontSize: 12,
  },
});