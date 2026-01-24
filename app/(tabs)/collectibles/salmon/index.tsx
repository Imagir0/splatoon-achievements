import { COLORS } from '@/constants/colors';
import { useSalmonSkins } from '@/contexts/SalmonRunContext';
import { salmonSkins } from '@/data/salmonSkins';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function SalmonScreen() {
  const { selectedSalmonSkins, toggleSalmonSkins } = useSalmonSkins();

  const [switchNewsModalVisible, setSwitchNewsModalVisible] = useState(false);
  const [selectedSwitchNews, setSelectedSwitchNews] = useState<any>(null);

  const handlePress = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSalmonSkins(id);
  };

  return (
    <View style={styles.view}>
      <FlatList
        data={salmonSkins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isChecked = !!selectedSalmonSkins[item.id];

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
                <Text style={styles.name}>
                  {item.name}
                </Text>
              </View>
              {!item.note && 
              <View style={styles.content}>
                <Text style={styles.price}>
                  {item.fishScalePrice}
                </Text>
              </View>
              }
              {item.note && (
                <Pressable
                  onPress={() => {
                    setSelectedSwitchNews(item);
                    setSwitchNewsModalVisible(true);
                  }}
                >
                  <Text style={styles.link}>Informations</Text>
                </Pressable>
              )}

              <View style={styles.checkbox}>
                {isChecked && (
                  <MaterialIcons
                    name="check"
                    size={24}
                  />
                )}
              </View>
            </Pressable>
          );
        }}
      />
      
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
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
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
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blue.specialWeapons,
    width: 130,
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
