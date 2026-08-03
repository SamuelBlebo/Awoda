import { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dedupeDrafts } from "../lib/contactsImport";

const STORAGE_KEY = "pendingContactImport";

export async function stashPendingContactDrafts(drafts) {
  if (!drafts.length) return;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

// Flushes any contact-birthday drafts collected during onboarding (before
// the user was signed in) into Firestore now that a uid is available.
// Runs once per app session; dedupes against whatever people already exist
// so a re-run (e.g. a second cold start before the flag clears) can't
// double-add the same contact.
export function usePendingContactsImport(addPersonFn, existingPeople = []) {
  const flushed = useRef(false);

  useEffect(() => {
    if (flushed.current) return;
    flushed.current = true;

    AsyncStorage.getItem(STORAGE_KEY).then(async (raw) => {
      if (!raw) return;
      const drafts = dedupeDrafts(JSON.parse(raw), existingPeople);
      for (const draft of drafts) {
        await addPersonFn(draft);
      }
      await AsyncStorage.removeItem(STORAGE_KEY);
    });
  }, [addPersonFn, existingPeople]);
}
