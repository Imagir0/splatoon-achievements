import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeEventEmitter } from 'react-native';

export const badgesEmitter = new NativeEventEmitter();

const STORAGE_KEY = 'userBadges';

export async function loadBadges(): Promise<Record<string, Record<number, boolean>>> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : {};
}

export async function saveCategoryBadges(
  category: string,
  data: Record<number, boolean>
) {
  const saved = await loadBadges();
  saved[category] = data;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

  // Utiliser addListener dans les composants, ici on émet juste l'événement
  badgesEmitter.emit('change', category, saved[category]);
}
