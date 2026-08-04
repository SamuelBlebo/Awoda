import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Avatar from "./Avatar";
import PersonTag from "./PersonTag";
import ZodiacTag from "./ZodiacTag";
import { colors, cardShadow } from "../../lib/colors";

export default function PersonRow({ person, onPress, daysUntilColor = colors.muted }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 14,
        },
        cardShadow,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Avatar initial={person.initial} color={person.avatarColor} />
        <View>
          <Text style={{ fontWeight: "600", fontSize: 14.5, color: colors.ink, marginBottom: 3 }}>
            {person.name}
          </Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <ZodiacTag person={person} />
            <PersonTag person={person} />
          </View>
        </View>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontSize: 13, color: colors.ink, fontWeight: "500" }}>{person.label}</Text>
        <Text style={{ fontSize: 11.5, color: daysUntilColor, fontWeight: "600" }}>
          in {person.daysUntil}d
        </Text>
      </View>
    </TouchableOpacity>
  );
}
