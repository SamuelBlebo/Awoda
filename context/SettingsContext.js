import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";
import { readLocalSettings, writeLocalSettings } from "../lib/localStore";

const DEFAULT_SETTINGS = { leadTime: "one_week", contactSync: false, reminderTime: "09:00" };

const SettingsContext = createContext(null);

// Shared for the whole app, same reasoning as PeopleContext — local (guest)
// settings have no live-subscription mechanism, so per-screen state would
// go out of sync the moment one screen updated settings the other hadn't
// re-read yet.
export function SettingsProvider({ children }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    if (user) {
      const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snap) => {
        const data = snap.data();
        if (data?.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        setLoading(false);
      });
      return unsubscribe;
    }

    readLocalSettings().then((local) => {
      if (cancelled) return;
      setSettings({ ...DEFAULT_SETTINGS, ...local });
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  async function updateSettings(patch) {
    const next = { ...settings, ...patch };
    if (user) {
      await updateDoc(doc(db, "users", user.uid), { settings: next });
      return;
    }
    setSettings(next);
    await writeLocalSettings(next);
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
