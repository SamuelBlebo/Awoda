import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import {
  readLocalPeople, readLocalSettings, clearLocalPeople, clearLocalSettings,
} from "../lib/localStore";

const AuthContext = createContext({
  user: null,
  loading: true,
  migrating: false,
  signUpWithEmail: async () => {},
  signInWithEmail: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const ensuredUid = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user || ensuredUid.current === user.uid) return;
    ensuredUid.current = user.uid;

    const userRef = doc(db, "users", user.uid);

    (async () => {
      setMigrating(true);
      try {
        const snap = await getDoc(userRef);
        if (snap.exists()) return;

        const localPeople = await readLocalPeople();
        const localSettings = await readLocalSettings();

        await setDoc(userRef, {
          displayName: user.displayName || "",
          email: user.email || "",
          onboarded: false,
          settings: {
            leadTime: "one_week",
            contactSync: false,
            reminderTime: "09:00",
            ...localSettings,
          },
          createdAt: serverTimestamp(),
        });

        if (localPeople.length) {
          const peopleCol = collection(db, "users", user.uid, "people");
          for (const person of localPeople) {
            const { id, ...rest } = person;
            await addDoc(peopleCol, {
              ...rest,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        }

        await clearLocalPeople();
        await clearLocalSettings();
      } catch (e) {
        console.error("Guest-to-cloud migration failed, local data kept:", e);
      } finally {
        setMigrating(false);
      }
    })();
  }, [user]);

  const value = {
    user,
    loading,
    migrating,
    signUpWithEmail: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    signInWithEmail: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signOut: () => firebaseSignOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
