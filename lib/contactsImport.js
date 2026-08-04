import * as Contacts from "expo-contacts";

function normalizeName(name) {
  return (name || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function dedupeKey(p) {
  return `${normalizeName(p.name)}|${p.month}|${p.day}`;
}

// Filters drafts against a list of already-known people (existing Firestore
// records, or earlier drafts in the same batch). Contacts synced across
// multiple accounts (Google + iCloud + WhatsApp, etc.) are often "merged" in
// the phone's own Contacts app but still exposed as separate raw records by
// the Contacts API, so a single fetch can already contain the same person
// twice — hence deduping within the batch itself, not just against Firestore.
function dedupeDrafts(drafts, existingPeople = []) {
  const seen = new Set(existingPeople.map(dedupeKey));
  const result = [];
  for (const draft of drafts) {
    const key = dedupeKey(draft);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(draft);
  }
  return result;
}

// Requests contacts permission and reads the address book, returning plain
// person-draft objects (no Firestore write here — this needs to work
// during onboarding, before the user is signed in). Best-effort: many
// contacts won't have a birthday field, especially on Android.
export async function requestAndFetchContactBirthdays() {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== "granted") {
    return { granted: false, drafts: [] };
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Birthday, Contacts.Fields.Name],
  });

  const rawDrafts = data
    .filter((c) => c.birthday && c.birthday.month != null && c.birthday.day != null)
    .map((c) => {
      const name = c.name || [c.firstName, c.lastName].filter(Boolean).join(" ").trim();
      return name
        ? {
            name,
            relation: "other",
            // expo-contacts doesn't expose gender — falls back to showing
            // the relation label instead of a day-name until edited.
            gender: null,
            // expo-contacts' birthday.month is 0-indexed (JS Date convention:
            // 0 = January); our own `month` field is 1-indexed everywhere else.
            month: c.birthday.month + 1,
            day: c.birthday.day,
            birthYear: c.birthday.year || null,
            notes: "",
            leadTime: null,
          }
        : null;
    })
    .filter(Boolean);

  return { granted: true, drafts: dedupeDrafts(rawDrafts) };
}

// Used once a user is signed in (e.g. from the Settings "Sync contacts"
// toggle): fetches and writes only drafts that don't already match an
// existing person (by name + birthday), so re-syncing doesn't pile up
// duplicates.
export async function importContactsAsBirthdays(addPersonFn, existingPeople = []) {
  const { granted, drafts } = await requestAndFetchContactBirthdays();
  if (!granted) return { granted: false, imported: 0 };
  const newDrafts = dedupeDrafts(drafts, existingPeople);
  for (const draft of newDrafts) {
    await addPersonFn(draft);
  }
  return { granted: true, imported: newDrafts.length };
}

export { dedupeDrafts };
