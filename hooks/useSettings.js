import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

const DEFAULT_SETTINGS = { leadTime: "one_week", contactSync: false, reminderTime: "09:00" };

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snap) => {
      const data = snap.data();
      if (data?.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
    });
    return unsubscribe;
  }, [user]);

  async function updateSettings(patch) {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      settings: { ...settings, ...patch },
    });
  }

  return { settings, updateSettings };
}
