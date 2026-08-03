import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../lib/colors";

export default function SegmentedControl({ options, value, onChange }) {
  return (
    <View style={{ flexDirection: "row", gap: 6, backgroundColor: colors.chip, borderRadius: 999, padding: 4 }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 9,
              paddingHorizontal: 8,
              borderRadius: 999,
              backgroundColor: active ? "#fff" : "transparent",
              shadowColor: "#000",
              shadowOpacity: active ? 0.08 : 0,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 1 },
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: active ? colors.primaryDarkest : colors.muted,
              }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
