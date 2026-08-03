import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { usePeople } from "../hooks/usePeople";
import { useSettings } from "../hooks/useSettings";
import SegmentedControl from "../components/ui/SegmentedControl";
import RadioRow from "../components/ui/RadioRow";
import BackChevronIcon from "../components/ui/icons/BackChevronIcon";
import { defaultBirthYear, LEAD_TIME_OPTIONS } from "../lib/date";
import { colors } from "../lib/colors";
import { goBackOrHome } from "../lib/navigation";

const RELATION_OPTIONS = [
  { label: "Family", value: "family" },
  { label: "Friend", value: "friend" },
  { label: "Colleague", value: "colleague" },
  { label: "Other", value: "other" },
];

function Field({ label, children }) {
  return (
    <View>
      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted, marginBottom: 6 }}>{label}</Text>
      {children}
    </View>
  );
}

const inputStyle = {
  width: "100%",
  borderWidth: 1.5,
  borderColor: colors.border,
  borderRadius: 12,
  paddingVertical: 11,
  paddingHorizontal: 12,
  fontSize: 14.5,
  color: colors.ink,
  backgroundColor: "#fff",
};

export default function AddPersonScreen({ navigation }) {
  const { addPerson } = usePeople();
  const { settings } = useSettings();

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("friend");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [leadTime, setLeadTime] = useState(settings.leadTime);
  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    if (!name.trim() || !monthNum || !dayNum || monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
      return;
    }
    await addPerson({
      name: name.trim(),
      relation,
      month: monthNum,
      day: dayNum,
      birthYear: year ? parseInt(year, 10) : defaultBirthYear(),
      notes,
      leadTime,
    });
    goBackOrHome(navigation);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 14 }}>
        <TouchableOpacity
          onPress={() => goBackOrHome(navigation)}
          style={{
            width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff",
            alignItems: "center", justifyContent: "center",
            shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 },
          }}
        >
          <BackChevronIcon />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.ink }}>Add person</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 18 }}>
          <Field label="Name">
            <TextInput placeholder="Full name" value={name} onChangeText={setName} style={inputStyle} />
          </Field>

          <Field label="Relationship">
            <SegmentedControl options={RELATION_OPTIONS} value={relation} onChange={setRelation} />
          </Field>

          <Field label="Birthday">
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput
                placeholder="MM" value={month} onChangeText={setMonth}
                keyboardType="number-pad" maxLength={2} style={[inputStyle, { flex: 1 }]}
              />
              <TextInput
                placeholder="DD" value={day} onChangeText={setDay}
                keyboardType="number-pad" maxLength={2} style={[inputStyle, { flex: 1 }]}
              />
              <TextInput
                placeholder="YYYY" value={year} onChangeText={setYear}
                keyboardType="number-pad" maxLength={4} style={[inputStyle, { flex: 1 }]}
              />
            </View>
          </Field>

          <Field label="Remind me">
            <RadioRow options={LEAD_TIME_OPTIONS} value={leadTime} onChange={setLeadTime} />
          </Field>

          <Field label="Notes">
            <TextInput
              placeholder="Interests, gift ideas, anything worth remembering"
              value={notes}
              onChangeText={setNotes}
              multiline
              style={[inputStyle, { minHeight: 80, textAlignVertical: "top" }]}
            />
          </Field>

          <TouchableOpacity
            onPress={handleSave}
            style={{ width: "100%", paddingVertical: 16, borderRadius: 999, backgroundColor: colors.primary, alignItems: "center" }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Save birthday</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
