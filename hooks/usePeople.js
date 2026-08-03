import { useEffect, useMemo, useState } from "react";
import {
  collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { daysUntil, turningAge, dateLabel, initialFor, avatarColorForIndex } from "../lib/date";

export function usePeople() {
  const { user } = useAuth();
  const [people, setPeople] = useState([]);

  useEffect(() => {
    if (!user) {
      setPeople([]);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, "users", user.uid, "people"),
      (snap) => setPeople(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return unsubscribe;
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
      }))
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .map((p, i) => ({ ...p, avatarColor: avatarColorForIndex(i) }));
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

  async function addPerson({ name, relation, month, day, birthYear, notes, leadTime }) {
    if (!user) return;
    await addDoc(peopleCollection(), {
      name, relation, month, day,
      birthYear: birthYear ?? null,
      notes: notes || "",
      leadTime: leadTime ?? null,
      gifts: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async function updatePerson(personId, patch) {
    if (!user) return;
    await updateDoc(personDoc(personId), { ...patch, updatedAt: serverTimestamp() });
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

  return {
    people, withMeta, todayList, weekList, monthList, laterList, heroPerson,
    addPerson, updatePerson, toggleGift, addGift,
  };
}
