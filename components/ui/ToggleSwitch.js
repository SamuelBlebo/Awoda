import React from "react";
import { Switch } from "react-native";
import { colors } from "../../lib/colors";

export default function ToggleSwitch({ value, onValueChange }) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#E4DFDB", true: colors.primary }}
      thumbColor="#fff"
    />
  );
}
