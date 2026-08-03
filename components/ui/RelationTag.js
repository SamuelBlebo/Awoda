import React from "react";
import { Text } from "react-native";
import { colors } from "../../lib/colors";

const LABELS = { family: "Family", friend: "Friend", colleague: "Colleague", other: "Other" };

export default function RelationTag({ relation }) {
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
      {LABELS[relation] || relation}
    </Text>
  );
}
