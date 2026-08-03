import React from "react";
import Svg, { Path } from "react-native-svg";

export default function HouseIcon({ size = 21, color = "#221F1E" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 21V8l8-5 8 5v13" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M9 21v-7h6v7" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}
