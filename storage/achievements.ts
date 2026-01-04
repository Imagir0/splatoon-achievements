import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'achievements';

export async function loadAchievements() {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : {};
}

export async function saveAchievements(data: object) {
  return AsyncStorage.setItem(KEY, JSON.stringify(data));
}
