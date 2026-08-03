import React from "react";
import Svg, { Path } from "react-native-svg";

export default function BackChevronIcon({ size = 16, color = "#221F1E" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 5l-7 7 7 7" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
