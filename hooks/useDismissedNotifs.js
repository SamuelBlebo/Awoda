import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "dismissedNotifs";

// Device-local, ephemeral UI state — not worth putting in Firestore. Keyed
// by year so dismissals reset naturally when next year's reminder appears.
export function useDismissedNotifs() {
  const [dismissedByYear, setDismissedByYear] = useState({});
  const year = String(new Date().getFullYear());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setDismissedByYear(JSON.parse(raw));
    });
  }, []);

  const dismiss = useCallback((personId) => {
    setDismissedByYear((prev) => {
      const next = {
        ...prev,
        [year]: [...(prev[year] || []), personId],
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [year]);

  const isDismissed = useCallback(
    (personId) => (dismissedByYear[year] || []).includes(personId),
    [dismissedByYear, year]
  );

  return { isDismissed, dismiss };
}
