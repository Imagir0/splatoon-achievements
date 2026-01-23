import { useObjects } from '@/contexts/ObjectsContext';
import { FIGURES_CATEGORY_TITLES } from '@/data/categoryTitles/objectsCategoryTitles';
import { objectsFilters } from '@/data/filters/objectsFilters';
import { OBJECTS_DATA } from '@/data/objects';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';

export default function FiguresIndexScreen() {
    const router = useRouter();
    const { isOwned } = useObjects();
    const progressAnim = useRef<Record<string, Animated.Value>>({}).current;
    const categories = Object.entries(FIGURES_CATEGORY_TITLES);

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            {categories.map(([key, title]) => {
                if (!progressAnim[key]) {
                    progressAnim[key] = new Animated.Value(0);
                }

                const filtered = useMemo(() => {
                    const filterFn = objectsFilters.figures[key];
                    if (!filterFn) return [];
                    return OBJECTS_DATA.figures
                        .map(f => ({ ...f, category: 'figures' as const })) // fix type
                        .filter(filterFn);
                }, [key]);


                const total = filtered.length;
                const obtained = filtered.filter(f => isOwned('figures', f.id)).length;
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
                                pathname: '/(tabs)/collectibles/objects/figures/[figuresCategory]',
                                params: { figuresCategory: key },
                            })
                        }
                        style={{
                            padding: 16,
                            backgroundColor: '#e5e7eb',
                            borderRadius: 10,
                            marginBottom: 12,
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600' }}>{title}</Text>
                            <Text style={{ fontSize: 14, fontWeight: '600' }}>{obtained} / {total}</Text>
                        </View>

                        <View style={{ height: 6, backgroundColor: '#d1d5db', borderRadius: 4, overflow: 'hidden' }}>
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
