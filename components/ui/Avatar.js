import React from "react";
import { View, Text } from "react-native";

export default function Avatar({ initial, color, size = 40 }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "700", fontSize: size * 0.375 }}>{initial}</Text>
    </View>
  );
}
