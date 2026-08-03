import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "hasOnboarded";

export function useHasOnboarded() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      setHasOnboarded(value === "true");
      setLoading(false);
    });
  }, []);

  const markOnboarded = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEY, "true");
    setHasOnboarded(true);
  }, []);

  return { hasOnboarded, loading, markOnboarded };
}
