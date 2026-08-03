import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import * as Notifications from "expo-notifications";
import CakeIcon from "../components/ui/icons/CakeIcon";
import ContactsIcon from "../components/ui/icons/ContactsIcon";
import BellFilledIcon from "../components/ui/icons/BellFilledIcon";
import { colors } from "../lib/colors";
import { requestAndFetchContactBirthdays } from "../lib/contactsImport";
import { stashPendingContactDrafts } from "../hooks/usePendingContactsImport";

const STEPS = [
  {
    Icon: CakeIcon,
    headline: "Never miss a birthday again",
    body: "Awoda keeps every birthday close, with just enough notice to do something about it.",
    buttonLabel: "Continue",
    skipLabel: "Skip",
  },
  {
    Icon: ContactsIcon,
    headline: "Import your contacts",
    body: "We'll pull birthdays already sitting in your contacts, so you don't start from zero.",
    buttonLabel: "Allow contacts access",
    skipLabel: "I'll add birthdays myself",
  },
  {
    Icon: BellFilledIcon,
    headline: "Get gentle reminders",
    body: "A quiet nudge a week before, and again on the day. You choose the timing later.",
    buttonLabel: "Enable notifications",
    skipLabel: "Skip",
  },
];

export default function OnboardingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.Icon;

  const advance = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onDone();
  };

  const handlePrimary = async () => {
    if (step === 1) {
      const { drafts } = await requestAndFetchContactBirthdays();
      await stashPendingContactDrafts(drafts);
    } else if (step === 2) {
      await Notifications.requestPermissionsAsync();
    }
    advance();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, padding: 16, paddingHorizontal: 28, paddingBottom: 20 }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 24 }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 32,
              backgroundColor: colors.tint,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon />
          </View>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "700",
                marginBottom: 10,
                color: colors.ink,
                textAlign: "center",
              }}
            >
              {current.headline}
            </Text>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: colors.muted,
                maxWidth: 250,
                textAlign: "center",
              }}
            >
              {current.body}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", gap: 7, marginVertical: 18 }}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === step ? colors.primary : "#E4DFDB",
              }}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handlePrimary}
          style={{
            width: "100%",
            paddingVertical: 16,
            borderRadius: 999,
            backgroundColor: colors.primary,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{current.buttonLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={advance} style={{ padding: 12, alignItems: "center" }}>
          <Text style={{ color: colors.muted, fontSize: 14, fontWeight: "600" }}>{current.skipLabel}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
