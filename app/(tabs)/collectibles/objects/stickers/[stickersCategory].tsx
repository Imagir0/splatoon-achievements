import { COLORS } from '@/constants/colors';
import { useObjects } from '@/contexts/ObjectsContext';
import { STICKERS_CATEGORY_TITLES } from '@/data/categoryTitles/stickersCategoryTitles';
import { objectsFilters } from '@/data/filters/objectsFilters';
import { OBJECTS_DATA } from '@/data/objects';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function StickersCategoryScreen() {
    const { stickersCategory } = useLocalSearchParams<{ stickersCategory: string }>();

    const { isOwned, toggleObject, getObjectCount, setObjectCount } = useObjects();

    const title = STICKERS_CATEGORY_TITLES[stickersCategory ?? ''] ?? 'Catégorie';
    const filterFn = objectsFilters.stickers[stickersCategory ?? ''];

    const [search, setSearch] = useState('');
    const searchableCategories = ['spend', 'weapons'];
    const showSearch = stickersCategory ? searchableCategories.includes(stickersCategory) : false;

    const filteredStickers = useMemo(() => {
        if (!filterFn) return [];

        return OBJECTS_DATA.stickers
            .map(s => ({ ...s, category: 'stickers' as const }))
            .filter(
                sticker =>
                    filterFn(sticker) &&
                    (!showSearch || sticker.name.toLowerCase().includes(search.toLowerCase()))
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [filterFn, stickersCategory, search, showSearch]);

    const handlePress = (id: number, maxNumber: number) => {
        if (maxNumber === 1) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            toggleObject('stickers', id);
        }
    };

    const handleSliderChange = (id: number, value: number, maxNumber: number) => {
        setObjectCount('stickers', id, value);
        if (value === maxNumber) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title }} />

            {showSearch && (
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Rechercher un autocollant…"
                    style={styles.searchInput}
                />
            )}

            <FlatList
                data={filteredStickers}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => {
                    const maxNumber = Number(item.maxNumber ?? 1);
                    const minPrice = Number(item.price ?? 0);
                    const count = getObjectCount('stickers', item.id);
                    const isChecked = isOwned('stickers', item.id);
                    const shouldHighlightRow = count === maxNumber;

                    return (
                        <Pressable
                            style={[styles.row, shouldHighlightRow && styles.rowChecked]}
                            onPress={maxNumber === 1 ? () => handlePress(item.id, maxNumber) : undefined}
                        >
                            {maxNumber === 1 && (
                                <View style={styles.rowTop}>
                                    <Image source={item.image} style={styles.image} />
                                    <View style={styles.textContainer}>
                                        <Text style={styles.description}>{item.name}</Text>
                                    </View>
                                        {stickersCategory === 'tableturf' && (
                                        <View style={styles.tableturf}>
                                            <Text style={styles.price}>{item.note}</Text>
                                        </View>
                                        )}
                                    <View style={styles.checkbox}>
                                        {isChecked && <MaterialIcons name="check" size={22} color={COLORS.shades.black} />}
                                    </View>
                                </View>
                            )}

                            {maxNumber > 1 && (
                                <View>
                                    <View style={styles.rowTop}>
                                        <Image source={item.image} style={styles.image} />
                                        <View style={styles.textContainer}>
                                            <Text style={styles.description}>{item.name}</Text>
                                            {minPrice !== 0 && (
                                                <Text style={styles.price}>{minPrice.toLocaleString()}</Text>
                                            )}
                                        </View>
                                        {stickersCategory === 'salmon' && (
                                        <View style={styles.fishScalePrice}>
                                            <Text style={styles.price}>{item.fishScalePrice}</Text>
                                        </View>
                                        )}
                                        <View style={styles.slideCount}>
                                            {minPrice !== 0 && (
                                                <Text style={styles.price}>{(minPrice * count).toLocaleString()}</Text>
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
                                        onValueChange={value => handleSliderChange(item.id, value, maxNumber)}
                                        minimumTrackTintColor={COLORS.green.progress}
                                        maximumTrackTintColor={COLORS.shades.order}
                                        thumbTintColor={COLORS.green.progress}
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
    container: { flex: 1, padding: 16 },
    searchInput: {
        height: 44,
        borderRadius: 10,
        paddingHorizontal: 14,
        marginBottom: 12,
        backgroundColor: COLORS.shades.white,
        fontSize: 16,
    },
    row: {
        marginBottom: 12,
        borderRadius: 14,
        backgroundColor: COLORS.shades.white,
        overflow: 'hidden',
    },
    rowTop: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    rowChecked: {
        backgroundColor: COLORS.green.rowChecked,
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 12,
        resizeMode: 'contain',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    description: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.shades.black,
    },
    fishScalePrice: {
        width: 80,
    },
    tableturf: {
        width: 100,
    },
    checkbox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.shades.black,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    countTextInline: {
        fontSize: 14,
        fontWeight: '600',
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
        color: COLORS.shades.codeqr,
        marginBottom: 1,
    },
    slider: {
        height: 14,
        marginHorizontal: 0,
        marginBottom: 5,
    },
});
