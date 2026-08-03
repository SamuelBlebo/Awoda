import { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "pendingContactImport";

export async function stashPendingContactDrafts(drafts) {
  if (!drafts.length) return;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

// Flushes any contact-birthday drafts collected during onboarding (before
// the user was signed in) into Firestore now that a uid is available.
// Runs once per app session.
export function usePendingContactsImport(addPersonFn) {
  const flushed = useRef(false);

  useEffect(() => {
    if (flushed.current) return;
    flushed.current = true;

    AsyncStorage.getItem(STORAGE_KEY).then(async (raw) => {
      if (!raw) return;
      const drafts = JSON.parse(raw);
      for (const draft of drafts) {
        await addPersonFn(draft);
      }
      await AsyncStorage.removeItem(STORAGE_KEY);
    });
  }, [addPersonFn]);
}
