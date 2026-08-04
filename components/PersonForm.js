import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform,
} from "react-native";
import SegmentedControl from "./ui/SegmentedControl";
import RadioRow from "./ui/RadioRow";
import { defaultBirthYear, LEAD_TIME_OPTIONS } from "../lib/date";
import { colors } from "../lib/colors";

const RELATION_OPTIONS = [
  { label: "Family", value: "family" },
  { label: "Friend", value: "friend" },
  { label: "Colleague", value: "colleague" },
  { label: "Other", value: "other" },
];

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
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

// Shared by AddPersonScreen and EditPersonScreen — same fields either way,
// just different initial values, submit label, and what onSubmit does with
// the result (create vs. update).
export default function PersonForm({ initialValues = {}, submitLabel, onSubmit }) {
  const [name, setName] = useState(initialValues.name ?? "");
  const [relation, setRelation] = useState(initialValues.relation ?? "friend");
  const [gender, setGender] = useState(initialValues.gender ?? "male");
  const [month, setMonth] = useState(initialValues.month ? String(initialValues.month) : "");
  const [day, setDay] = useState(initialValues.day ? String(initialValues.day) : "");
  const [year, setYear] = useState(initialValues.birthYear ? String(initialValues.birthYear) : "");
  const [leadTime, setLeadTime] = useState(initialValues.leadTime ?? "one_week");
  const [notes, setNotes] = useState(initialValues.notes ?? "");

  const handleSubmit = () => {
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    if (!name.trim() || !monthNum || !dayNum || monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
      return;
    }
    onSubmit({
      name: name.trim(),
      relation,
      gender,
      month: monthNum,
      day: dayNum,
      birthYear: year ? parseInt(year, 10) : defaultBirthYear(),
      notes,
      leadTime,
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 18 }}>
        <Field label="Name">
          <TextInput placeholder="Full name" value={name} onChangeText={setName} style={inputStyle} />
        </Field>

        <Field label="Relationship">
          <SegmentedControl options={RELATION_OPTIONS} value={relation} onChange={setRelation} />
        </Field>

        <Field label="Gender">
          <SegmentedControl options={GENDER_OPTIONS} value={gender} onChange={setGender} />
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
          onPress={handleSubmit}
          style={{ width: "100%", paddingVertical: 16, borderRadius: 999, backgroundColor: colors.primary, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{submitLabel}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
