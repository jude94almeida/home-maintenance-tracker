import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadJson(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : (fallback ?? null);
  } catch {
    return fallback ?? null;
  }
}

export async function saveJson(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
