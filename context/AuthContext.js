import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext({
  user: null,
  loading: true,
  signUpWithEmail: async () => {},
  signInWithEmail: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    getDoc(userRef).then((snap) => {
      if (snap.exists()) return;
      setDoc(userRef, {
        displayName: user.displayName || "",
        email: user.email || "",
        onboarded: false,
        settings: {
          leadTime: "one_week",
          contactSync: false,
          reminderTime: "09:00",
        },
        createdAt: serverTimestamp(),
      });
    });
  }, [user]);

  const value = {
    user,
    loading,
    signUpWithEmail: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    signInWithEmail: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signOut: () => firebaseSignOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
