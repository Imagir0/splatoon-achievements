import { useObjects } from '@/contexts/ObjectsContext';
import { FIGURES_CATEGORY_TITLES } from '@/data/categoryTitles/objectsCategoryTitles';
import { objectsFilters } from '@/data/filters/objectsFilters';
import { OBJECTS_DATA } from '@/data/objects';
import Slider from '@react-native-community/slider';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function FiguresCategoryScreen() {
    const { figuresCategory } =
        useLocalSearchParams<{ figuresCategory: string }>();

    const {
        isOwned,
        toggleObject,
        getObjectCount,
        setObjectCount,
    } = useObjects();

    const title =
        FIGURES_CATEGORY_TITLES[figuresCategory ?? ''] ?? 'Catégorie';
    const filterFn = objectsFilters.figures[figuresCategory ?? ''];
    const [search, setSearch] = useState('');
    const searchableCategories = ['spend'];
    const showSearch = figuresCategory
        ? searchableCategories.includes(figuresCategory)
        : false;

    const filteredFigures = useMemo(() => {
        if (!filterFn) return [];

        return OBJECTS_DATA.figures
            .map(f => ({ ...f, category: 'figures' as const }))
            .filter(
                figure =>
                    filterFn(figure) &&
                    (!showSearch ||
                        figure.name
                            .toLowerCase()
                            .includes(search.toLowerCase()))
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [filterFn, figuresCategory, search, showSearch]);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Stack.Screen options={{ title }} />

            {showSearch && (
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Rechercher un objet…"
                    style={styles.searchInput}
                />
            )}

            <FlatList
                data={filteredFigures}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => {
                    const maxNumber = Number(item.maxNumber);
                    const minPrice = Number(item.price ?? 0);
                    const count = getObjectCount('figures', item.id);
                    const isChecked = isOwned('figures', item.id);
                    const shouldHighlightRow =
                        count === maxNumber;
                    return (
                        <Pressable
                            style={[
                                styles.row,
                                shouldHighlightRow && styles.rowChecked,
                            ]}
                            onPress={
                                maxNumber === 1
                                    ? () => toggleObject('figures', item.id)
                                    : undefined
                            }
                        >
                            {maxNumber === 1 && (
                                <View style={styles.rowTop}>
                                    <Image source={item.image} style={styles.image} />
                                    <View style={styles.textContainer}>
                                        <Text style={styles.description}>
                                            {item.name}
                                        </Text>
                                    </View>
                                    <View style={styles.checkbox}>
                                        {isChecked && <Text>✔</Text>}
                                    </View>
                                </View>
                            )}

                            {maxNumber > 1 && (
                                <View>
                                    <View style={styles.rowTop}>
                                        <Image source={item.image} style={styles.image} />
                                        <View style={styles.textContainer}>
                                            <Text style={styles.description}>
                                                {item.name}
                                            </Text>
                                            {minPrice != 0 && (
                                                <Text style={styles.price}>
                                                    {Number(item.price).toLocaleString()}
                                                </Text>
                                            )}
                                        </View>
                                            <View style={styles.slideCount}>
                                                {minPrice != 0 && (
                                                        <Text style={styles.price}>
                                                            {Number(item.price) * count}
                                                        </Text>
                                                )}
                                                <Text style={styles.countTextInline}>
                                                    {count} / {maxNumber}
                                                </Text>
                                            </View>
                                    </View>
                                    <Slider
                                        minimumValue={0}
                                        maximumValue={maxNumber}
                                        step={1}
                                        value={count}
                                        onValueChange={value =>
                                            setObjectCount('figures', item.id, value)
                                        }
                                        minimumTrackTintColor="#22c55e"
                                        maximumTrackTintColor="#d1d5db"
                                        thumbTintColor="#22c55e"
                                        style={styles.slider}
                                    />
                                </View>
                            )}
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchInput: {
        height: 44,
        borderRadius: 10,
        paddingHorizontal: 14,
        marginBottom: 12,
        backgroundColor: '#e5e7eb',
        fontSize: 16,
    },
    row: {
        marginBottom: 12,
        borderRadius: 14,
        backgroundColor: '#f9fafb',
        overflow: 'hidden',
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 12,
        resizeMode: 'contain',
    },
    rowTop: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    rowChecked: {
        backgroundColor: '#dcfce7',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    description: {
        fontSize: 16,
        fontWeight: '500',
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#065f46',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    countTextInline: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
        marginLeft: 8,
    },
    slideCount: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginLeft: 8,
    },
    price: {
        fontSize: 12,
        fontWeight: '600',
        color: '#949494',
        marginBottom: 1,
    },
    slider: {
        height: 14,
        marginHorizontal: 0,
        marginBottom: 5,
    },
});
