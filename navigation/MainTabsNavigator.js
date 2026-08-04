import React, { useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBar from "../components/ui/TabBar";
import HomeScreen from "../screens/HomeScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { usePeople } from "../hooks/usePeople";
import { useSettings } from "../hooks/useSettings";
import { useNotificationScheduler } from "../hooks/useNotificationScheduler";
import { usePendingContactsImport } from "../hooks/usePendingContactsImport";

const Tab = createBottomTabNavigator();

// No UI of its own — keeps local notifications in sync with the current
// people list/settings, and flushes any contacts imported during onboarding
// (before the user had a uid to write Firestore docs under).
function NotificationSchedulerMount() {
  const { people, addPerson, loading } = usePeople();
  const { settings, updateSettings } = useSettings();
  useNotificationScheduler(people, settings);
  const markContactsSynced = useCallback(() => updateSettings({ contactSync: true }), [updateSettings]);
  usePendingContactsImport(addPerson, people, loading, markContactsSynced);
  return null;
}

export default function MainTabsNavigator() {
  return (
    <>
      <NotificationSchedulerMount />
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </>
  );
}
