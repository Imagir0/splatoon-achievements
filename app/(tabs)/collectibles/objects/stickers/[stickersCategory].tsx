import { useObjects } from '@/contexts/ObjectsContext';
import { OBJECTS_DATA } from '@/data/objects';
import { objectsFilters } from '@/data/objectsFilters';
import { STICKERS_CATEGORY_TITLES } from '@/data/stickersCategoryTitles';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function StickersCategoryScreen() {
    const { stickersCategory } = useLocalSearchParams<{ stickersCategory: string }>();
    const { isOwned, toggleObject } = useObjects();

    // Récupérer le titre de la catégorie
    const title = STICKERS_CATEGORY_TITLES[stickersCategory ?? ''] ?? 'Catégorie';

    // Récupérer le filtre correspondant à cette catégorie
    const filterFn = objectsFilters.stickers[stickersCategory ?? ''];

    // Barre de recheche
    const [search, setSearch] = useState('');
    const searchableCategories = [
        'spend',
        'weapons',
    ];

    const showSearch = stickersCategory
        ? searchableCategories.includes(stickersCategory)
        : false;

    // Filtrage des figurines selon le filtre
    const filteredStickers = useMemo(() => {
        if (!filterFn) return [];

        return OBJECTS_DATA.stickers
            .map(f => ({ ...f, category: 'stickers' as const }))
            .filter(
                (sticker) =>
                    filterFn(sticker) &&
                    (
                        !showSearch ||
                        sticker.name.toLowerCase().includes(search.toLowerCase())
                    )
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [filterFn, stickersCategory, search, showSearch]);

    return (
        <View style={{ flex: 1, padding: 16 }}>
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
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const isChecked = isOwned('stickers', item.id);

                    return (
                        <Pressable
                            style={[styles.row, isChecked && styles.rowChecked]}
                            onPress={() => toggleObject('stickers', item.id)}
                        >
                            <Image source={item.image} style={styles.image} />
                            <Text style={styles.description}>{item.name}</Text>
                            <View style={styles.checkbox}>
                                {isChecked && <Text>✔</Text>}
                            </View>
                        </Pressable>
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    rowChecked: {
        backgroundColor: '#86efac',
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
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
    },
    searchInput: {
        height: 44,
        borderRadius: 10,
        paddingHorizontal: 14,
        marginBottom: 12,
        backgroundColor: '#e5e7eb',
        fontSize: 16,
    },
});
