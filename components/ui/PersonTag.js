import React from "react";
import { Text } from "react-native";
import { colors } from "../../lib/colors";
import { dayNameFor } from "../../lib/dayNames";

// Shows the Akan day-name (e.g. "Kofi", "Ama") when the person has a known
// gender and birth year. Renders nothing otherwise (no relation fallback) —
// contacts imported without a birth year, or added before the gender field
// existed, just show the zodiac tag alone until edited in.
export default function PersonTag({ person }) {
  const dayName = dayNameFor(person.month, person.day, person.birthYear, person.gender);
  if (!dayName) return null;

  return (
    <Text
      style={{
        alignSelf: "flex-start",
        fontSize: 11,
        fontWeight: "600",
        paddingVertical: 3,
        paddingHorizontal: 9,
        borderRadius: 999,
        backgroundColor: colors.chip,
        color: colors.muted,
        overflow: "hidden",
      }}
    >
      {dayName}
    </Text>
  );
}
