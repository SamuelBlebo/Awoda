import React from "react";
import Svg, { Path } from "react-native-svg";

export default function CheckIcon({ size = 11, color = "#FFFFFF" }) {
  return (
    <Svg width={size} height={(size * 9) / 11} viewBox="0 0 11 9" fill="none">
      <Path d="M1 4.5L4 7.5L10 1" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
