import { useSalmonSkins } from '@/contexts/SalmonRunContext';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { theme } = useTheme();
  const { selectedSalmonSkins, toggleSalmonSkins } = useSalmonSkins();

  const [switchNewsModalVisible, setSwitchNewsModalVisible] = useState(false);
  const [selectedSwitchNews, setSelectedSwitchNews] = useState<any>(null);

  const handlePress = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSalmonSkins(id);
  };

  return (
    <View style={[styles.view, { backgroundColor: theme.colors.background }]}>
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
                {
                  backgroundColor: isChecked
                    ? theme.colors.rowChecked
                    : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Image source={item.image} style={styles.image} />

              <View style={styles.content}>
                <Text style={[styles.name, { color: theme.colors.text }]}>
                  {item.name}
                </Text>
              </View>

              {!item.note && (
                <View style={styles.content}>
                  <Text style={[styles.price, { color: theme.colors.text }]}>
                    {item.fishScalePrice}
                  </Text>
                </View>
              )}

              {item.note && (
                <Pressable
                  onPress={() => {
                    setSelectedSwitchNews(item);
                    setSwitchNewsModalVisible(true);
                  }}
                >
                  <Text style={[styles.link, { color: theme.colors.primary }]}>
                    Informations
                  </Text>
                </Pressable>
              )}

              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: isChecked
                      ? theme.colors.white
                      : theme.colors.icon,
                  },
                ]}
              >
                {isChecked && (
                  <MaterialIcons
                    name="check"
                    size={24}
                    color={theme.colors.white}
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
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            {selectedSwitchNews && (
              <View>
                <Image
                  source={selectedSwitchNews.image}
                  style={styles.selectedSwitchNewsLarge}
                />
                <Text style={[styles.switchNewsText, { color: theme.colors.text }]}>
                  {selectedSwitchNews.note}
                </Text>
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
    paddingBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
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
    width: 130,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
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