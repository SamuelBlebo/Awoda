import { initializeApp, getApps, getApp } from "firebase/app";
// getReactNativePersistence only exists in @firebase/auth's dedicated
// "react-native" build — the top-level "firebase/auth" package re-export
// does not carry a react-native export condition, so it must be imported
// from @firebase/auth directly (added as an explicit top-level dependency
// so Metro's "react-native" condition can actually resolve to it).
import { initializeAuth, getAuth, getReactNativePersistence } from "@firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "../firebaseConfig";

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Plain getAuth() does not persist sessions across app restarts on React
// Native — it needs an explicit AsyncStorage-backed persistence layer.
// initializeAuth() throws if called twice (e.g. on Fast Refresh), so fall
// back to getAuth() for the app instance that's already been set up.
let auth;
try {
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch (e) {
  auth = getAuth(app);
}
export { auth };

export const db = getFirestore(app);
export default app;
