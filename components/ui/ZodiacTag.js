import React from "react";
import { Text } from "react-native";
import { colors } from "../../lib/colors";
import { zodiacFor } from "../../lib/zodiac";

export default function ZodiacTag({ person }) {
  const zodiac = zodiacFor(person.month, person.day);
  if (!zodiac) return null;

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
      {zodiac.symbol} {zodiac.name}
    </Text>
  );
}
