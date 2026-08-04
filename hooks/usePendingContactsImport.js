import { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dedupeDrafts } from "../lib/contactsImport";

const STORAGE_KEY = "pendingContactImport";

export async function stashPendingContactDrafts(drafts) {
  if (!drafts.length) return;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

// Flushes any contact-birthday drafts collected during onboarding (before
// the user was signed in) into Firestore/local storage now that the person
// list is available. Runs once per app session; dedupes against whatever
// people already exist so a re-run can't double-add the same contact.
//
// Waits for `peopleLoading` to be false before doing anything — usePeople()
// starts with an empty array while it's still loading (from Firestore or
// AsyncStorage), and deduping against that empty snapshot would think every
// contact is new even when it's already been imported.
export function usePendingContactsImport(addPersonFn, existingPeople = [], peopleLoading = false, onImported) {
  const flushed = useRef(false);

  useEffect(() => {
    if (flushed.current || peopleLoading) return;
    flushed.current = true;

    AsyncStorage.getItem(STORAGE_KEY).then(async (raw) => {
      if (!raw) return;
      // Clear the stash before importing, not after — if this effect ever
      // runs a second time for any reason (double-mount, fast refresh),
      // the second run finds nothing left to flush instead of re-adding
      // the same batch.
      await AsyncStorage.removeItem(STORAGE_KEY);
      const drafts = dedupeDrafts(JSON.parse(raw), existingPeople);
      for (const draft of drafts) {
        await addPersonFn(draft);
      }
      if (drafts.length && onImported) onImported();
    });
  }, [addPersonFn, existingPeople, peopleLoading, onImported]);
}
