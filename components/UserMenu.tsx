import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function UserMenu() {
  const [visible, setVisible] = useState(false);
  const { theme, isDark, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        hitSlop={10}
      >
        <Ionicons
          name="menu-outline"
          size={24}
          color={theme.colors.text}
        />
      </Pressable>

      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.backdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setVisible(false)}
          />
          <View
            style={[
              styles.menu,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            {/*
            <Pressable
              style={styles.item}
              onPress={() => {
                setVisible(false);
                router.push('/account');
              }}
            >
              <Text style={[styles.text, { color: theme.colors.text }]}>
                👤 Compte
              </Text>
            </Pressable>
            */}
            
            <Pressable
              style={styles.item}
              onPress={() => {
                setVisible(false);
                router.push({ pathname: '/encyclopedia' });
              }}
            >
              <Text style={[styles.text, { color: theme.colors.text }]}>
                📖 Encyclopédie
              </Text>
            </Pressable>
            
            <Pressable
              style={styles.item}
              onPress={() => {
                toggleTheme();
                setVisible(false);
              }}
            >
              <Text style={[styles.text, { color: theme.colors.text }]}>
                {isDark ? '☀️ Thème clair' : '🌙 Thème sombre'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  menu: {
    position: 'absolute',
    top: 56,
    right: 12,
    width: 200,
    borderRadius: 8,
    paddingVertical: 6,
    elevation: 6,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
  },
});
