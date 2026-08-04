import "react-native-gesture-handler";
import "./global.css";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./context/AuthContext";
import { PeopleProvider } from "./context/PeopleContext";
import { SettingsProvider } from "./context/SettingsContext";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SettingsProvider>
          <PeopleProvider>
            <RootNavigator />
          </PeopleProvider>
        </SettingsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
