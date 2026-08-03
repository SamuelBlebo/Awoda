import React from "react";
import Svg, { Path } from "react-native-svg";

export default function BellIcon({ size = 18, color = "#221F1E" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a5 5 0 00-5 5v3.5c0 1-.4 1.9-1.1 2.6L5 15h14l-.9-.9c-.7-.7-1.1-1.6-1.1-2.6V8a5 5 0 00-5-5z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path d="M10 18a2 2 0 004 0" stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}
