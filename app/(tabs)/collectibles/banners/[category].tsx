import { COLORS } from '@/constants/colors';
import { useBanners } from '@/contexts/BannersContext';
import { banners } from '@/data/banners';
import { BANNER_CATEGORY_TITLES } from '@/data/categoryTitles/bannersCategoryTitles';
import { bannerFilters } from '@/data/filters/bannerFilters';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image, Modal, Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { selectedBanners, toggleBanner } = useBanners();
  const navigation = useNavigation();
  const title = BANNER_CATEGORY_TITLES[category ?? ''] ?? 'Catégorie';

  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedQr, setSelectedQr] = useState<any>(null);

  const [switchNewsModalVisible, setSwitchNewsModalVisible] = useState(false);
  const [selectedSwitchNews, setSelectedSwitchNews] = useState<any>(null);


  React.useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  const handlePress = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBanner(id);
  };

  const filteredBanners = useMemo(() => {
    const filterFn = bannerFilters[category ?? ''];
    return filterFn ? banners.filter(filterFn) : [];
  }, [category]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={filteredBanners}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedBanners[item.id];

          return (
            <Pressable
              onPress={() => handlePress(item.id)}
              style={[
                styles.row,
                isChecked && styles.rowChecked,
              ]}
            >
              <Image source={item.image} style={styles.image} />

              <View style={styles.content}>
                {category === 'salmonRun' && (
                  <Text style={styles.meta}>{item.fishScalePrice}</Text>
                )}
                {category === 'tableturf' && (
                  <Text style={styles.meta}>{item.note}</Text>
                )}
                {category === 'dlc' && (
                  <Text style={styles.meta}>{item.note}</Text>
                )}
                {category === 'codeQR' && (
                  <Pressable
                    onPress={() => {
                      setSelectedQr(item.codeQR);
                      setQrModalVisible(true);
                    }}
                  >
                    <Image style={styles.codeQR} source={item.codeQR} />
                  </Pressable>
                )}

                {category === 'nSwitchNews' && (
                  <Pressable
                    onPress={() => {
                      setSelectedSwitchNews(item);
                      setSwitchNewsModalVisible(true);
                    }}
                  >
                    <Text style={styles.link}>Informations</Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.checkbox}>
                {isChecked && (
                  <MaterialIcons name="check" size={22} />
                )}
              </View>
            </Pressable>

            
          );
          
        }}
      />
      <Modal
        visible={qrModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setQrModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text>Capture d'écran
              ➜ App Nintendo ➜ QR Code</Text>
            {selectedQr && (
              <Image
                source={selectedQr}
                style={styles.qrLarge}
              />
            )}
          </View>
        </Pressable>
      </Modal>
      <Modal
        visible={switchNewsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSwitchNewsModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSwitchNewsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {selectedSwitchNews && (
              <View>
                <Image
                  source={selectedSwitchNews.image}
                  style={styles.selectedSwitchNewsLarge}
                />
              <Text style={styles.switchNewsText}>{selectedSwitchNews.note}</Text>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.shades.white,
    borderRadius: 8,
    marginBottom: 8,
  },
  rowChecked: {
    backgroundColor: COLORS.green.rowChecked,
  },
  image: {
    width: 200,
    height: 50,
    resizeMode: 'contain',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  meta: {
    fontSize: 14,
    fontWeight: '500',
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blue.specialWeapons,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  codeQR: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.shades.white,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: '90%',
  },
  qrLarge: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  selectedSwitchNewsLarge: {
    width: 300,
    resizeMode: 'contain',
    height: 100,
  },
  switchNewsText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
  },
});
