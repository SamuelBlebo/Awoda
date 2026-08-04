import AsyncStorage from "@react-native-async-storage/async-storage";

// Shared by hooks/usePeople.js, hooks/useSettings.js, and context/AuthContext.js.
// Living here (rather than inside the hooks themselves) avoids a circular
// import, since those hooks already import useAuth from AuthContext.js.
export const LOCAL_PEOPLE_KEY = "localPeople";
export const LOCAL_SETTINGS_KEY = "localSettings";

export function genLocalId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function readLocalPeople() {
  const raw = await AsyncStorage.getItem(LOCAL_PEOPLE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function writeLocalPeople(list) {
  await AsyncStorage.setItem(LOCAL_PEOPLE_KEY, JSON.stringify(list));
}

export async function clearLocalPeople() {
  await AsyncStorage.removeItem(LOCAL_PEOPLE_KEY);
}

export async function readLocalSettings() {
  const raw = await AsyncStorage.getItem(LOCAL_SETTINGS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function writeLocalSettings(obj) {
  await AsyncStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(obj));
}

export async function clearLocalSettings() {
  await AsyncStorage.removeItem(LOCAL_SETTINGS_KEY);
}
