import React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { colors } from "../../../lib/colors";

export default function ContactsIcon({ size = 52 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="8" r="3" fill={colors.primary} />
      <Path d="M4 20c0-3 2.5-5 5-5s5 2 5 5" stroke={colors.primary} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="17" cy="9" r="2" fill={colors.gold} />
      <Path d="M14 19c0-1.8 1.4-3.2 3-3.2s3 1.4 3 3.2" stroke={colors.gold} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}
