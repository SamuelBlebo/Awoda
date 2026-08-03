import React from "react";
import Svg, { Rect, Path } from "react-native-svg";
import { colors } from "../../../lib/colors";

export default function CakeIcon({ size = 52 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="10" width="16" height="9" rx="2" fill={colors.primary} />
      <Path
        d="M4 10c0-1.5 1-2.5 2-2.5s2 1.5 2 2.5m4 0c0-1.5 1-2.5 2-2.5s2 1.5 2 2.5m4 0c0-1.5 1-2.5 2-2.5s2 1.5 2 2.5"
        stroke={colors.primary}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Rect x="10.5" y="3" width="3" height="4" rx="1" fill={colors.gold} />
    </Svg>
  );
}
