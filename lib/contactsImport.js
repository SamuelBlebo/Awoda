import * as Contacts from "expo-contacts";

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

  const drafts = data
    .filter((c) => c.birthday && c.birthday.month && c.birthday.day)
    .map((c) => {
      const name = c.name || [c.firstName, c.lastName].filter(Boolean).join(" ").trim();
      return name
        ? {
            name,
            relation: "other",
            month: c.birthday.month,
            day: c.birthday.day,
            birthYear: c.birthday.year || null,
            notes: "",
            leadTime: null,
          }
        : null;
    })
    .filter(Boolean);

  return { granted: true, drafts };
}

// Used once a user is signed in (e.g. from the Settings "Sync contacts"
// toggle): fetches and immediately writes each draft via addPersonFn.
export async function importContactsAsBirthdays(addPersonFn) {
  const { granted, drafts } = await requestAndFetchContactBirthdays();
  if (!granted) return { granted: false, imported: 0 };
  for (const draft of drafts) {
    await addPersonFn(draft);
  }
  return { granted: true, imported: drafts.length };
}
