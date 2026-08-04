import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";
import { daysUntil, turningAge, dateLabel, initialFor } from "../lib/date";
import { colors } from "../lib/colors";
import { genLocalId, readLocalPeople, writeLocalPeople } from "../lib/localStore";

const PeopleContext = createContext(null);

// A single shared instance of the people list for the whole app — not one
// per screen. Firestore's onSnapshot naturally keeps every subscriber in
// sync with each other, but local (guest) storage has no such mechanism;
// with one usePeople() call per screen, each screen held its own private
// copy that only updated when THAT screen made a change itself, so e.g.
// contacts imported via a background flush in one component never showed
// up on Home until the app restarted. Provider-based state fixes this by
// construction — there's only ever one copy to be out of sync with.
export function PeopleProvider({ children }) {
  const { user } = useAuth();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    if (user) {
      const unsubscribe = onSnapshot(
        collection(db, "users", user.uid, "people"),
        (snap) => {
          setPeople(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoading(false);
        }
      );
      return unsubscribe;
    }

    readLocalPeople().then((local) => {
      if (cancelled) return;
      setPeople(local);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  const withMeta = useMemo(() => {
    const today = new Date();
    return [...people]
      .map((p) => ({
        ...p,
        initial: initialFor(p.name),
        label: dateLabel(p.month, p.day),
        daysUntil: daysUntil(p.month, p.day, today),
        age: turningAge(p.month, p.day, p.birthYear, today),
        avatarColor: colors.primary,
      }))
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [people]);

  const todayList = useMemo(() => withMeta.filter((p) => p.daysUntil === 0), [withMeta]);
  const weekList = useMemo(() => withMeta.filter((p) => p.daysUntil > 0 && p.daysUntil <= 7), [withMeta]);
  const monthList = useMemo(() => withMeta.filter((p) => p.daysUntil > 7 && p.daysUntil <= 31), [withMeta]);
  const laterList = useMemo(() => withMeta.filter((p) => p.daysUntil > 31), [withMeta]);
  const heroPerson = todayList[0] ?? null;

  function peopleCollection() {
    return collection(db, "users", user.uid, "people");
  }
  function personDoc(personId) {
    return doc(db, "users", user.uid, "people", personId);
  }

  async function addPerson({ name, relation, month, day, birthYear, gender, notes, leadTime }) {
    if (user) {
      await addDoc(peopleCollection(), {
        name, relation, month, day,
        birthYear: birthYear ?? null,
        gender: gender ?? null,
        notes: notes || "",
        leadTime: leadTime ?? null,
        gifts: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return;
    }

    const now = new Date().toISOString();
    const record = {
      id: genLocalId(),
      name, relation, month, day,
      birthYear: birthYear ?? null,
      gender: gender ?? null,
      notes: notes || "",
      leadTime: leadTime ?? null,
      gifts: [],
      createdAt: now,
      updatedAt: now,
    };
    const current = await readLocalPeople();
    const next = [...current, record];
    setPeople(next);
    await writeLocalPeople(next);
  }

  async function updatePerson(personId, patch) {
    if (user) {
      await updateDoc(personDoc(personId), { ...patch, updatedAt: serverTimestamp() });
      return;
    }

    const current = await readLocalPeople();
    const next = current.map((p) =>
      p.id === personId ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
    );
    setPeople(next);
    await writeLocalPeople(next);
  }

  async function deletePerson(personId) {
    if (user) {
      await deleteDoc(personDoc(personId));
      return;
    }

    const current = await readLocalPeople();
    const next = current.filter((p) => p.id !== personId);
    setPeople(next);
    await writeLocalPeople(next);
  }

  async function toggleGift(personId, giftId) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    const gifts = (person.gifts || []).map((g) =>
      g.id === giftId ? { ...g, bought: !g.bought } : g
    );
    await updatePerson(personId, { gifts });
  }

  async function addGift(personId, text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return;
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    const gifts = [...(person.gifts || []), { id: `g${Date.now()}`, text: trimmed, bought: false }];
    await updatePerson(personId, { gifts });
  }

  const value = {
    people, withMeta, todayList, weekList, monthList, laterList, heroPerson,
    addPerson, updatePerson, deletePerson, toggleGift, addGift, loading,
  };

  return <PeopleContext.Provider value={value}>{children}</PeopleContext.Provider>;
}

export function usePeople() {
  return useContext(PeopleContext);
}
