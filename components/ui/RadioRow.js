import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../lib/colors";

export default function RadioRow({ options, value, onChange }) {
  return (
    <View style={{ flexDirection: "column", gap: 10 }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: active ? colors.primary : colors.border,
                backgroundColor: active ? colors.primary : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {active && (
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" }} />
              )}
            </View>
            <Text style={{ fontSize: 14, color: colors.ink }}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
