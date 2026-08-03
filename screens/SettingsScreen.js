import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform } from "react-native";
import Constants from "expo-constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSettings } from "../hooks/useSettings";
import { usePeople } from "../hooks/usePeople";
import { useAuth } from "../context/AuthContext";
import SegmentedControl from "../components/ui/SegmentedControl";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import { LEAD_TIME_OPTIONS, timeStringToDate, dateToTimeString } from "../lib/date";
import { importContactsAsBirthdays } from "../lib/contactsImport";
import { colors } from "../lib/colors";

function Field({ label, hint, children }) {
  return (
    <View>
      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted, marginBottom: 8 }}>{label}</Text>
      {children}
      {!!hint && <Text style={{ fontSize: 12.5, color: colors.muted, marginTop: 4 }}>{hint}</Text>}
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettings();
  const { addPerson } = usePeople();
  const { signOut } = useAuth();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleContactSyncToggle = async (value) => {
    if (!value) {
      updateSettings({ contactSync: false });
      return;
    }
    setSyncing(true);
    const result = await importContactsAsBirthdays(addPerson);
    setSyncing(false);
    if (result.granted) updateSettings({ contactSync: true });
  };

  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedDate) updateSettings({ reminderTime: dateToTimeString(selectedDate) });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: colors.ink, letterSpacing: -0.4 }}>
          Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 22 }}>
        <Field label="Default reminder lead time">
          <SegmentedControl
            options={LEAD_TIME_OPTIONS}
            value={settings.leadTime}
            onChange={(value) => updateSettings({ leadTime: value })}
          />
        </Field>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ fontWeight: "600", fontSize: 14.5, color: colors.ink }}>Sync contacts</Text>
            <Text style={{ fontSize: 12.5, color: colors.muted, marginTop: 2 }}>
              Pull birthdays from your address book
            </Text>
          </View>
          <ToggleSwitch value={settings.contactSync} onValueChange={handleContactSyncToggle} />
        </View>
        {syncing && <Text style={{ fontSize: 12.5, color: colors.muted }}>Syncing contacts…</Text>}

        <Field label="Reminder time">
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={{
              borderWidth: 1.5, borderColor: colors.border, borderRadius: 12,
              paddingVertical: 10, paddingHorizontal: 12, maxWidth: 140, backgroundColor: "#fff",
            }}
          >
            <Text style={{ fontSize: 14, color: colors.ink }}>{settings.reminderTime}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={timeStringToDate(settings.reminderTime)}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </Field>

        <View>
          <Text style={{ fontWeight: "600", fontSize: 14.5, color: colors.ink, marginBottom: 2 }}>
            About Awoda
          </Text>
          <Text style={{ fontSize: 12.5, color: colors.muted }}>
            Version {Constants.expoConfig?.version ?? "1.0.0"}
          </Text>
        </View>

        <TouchableOpacity onPress={signOut} style={{ paddingVertical: 12 }}>
          <Text style={{ color: colors.primaryBorder, fontWeight: "600", fontSize: 14.5 }}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
