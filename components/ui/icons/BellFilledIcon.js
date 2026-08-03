import React from "react";
import Svg, { Path } from "react-native-svg";
import { colors } from "../../../lib/colors";

export default function BellFilledIcon({ size = 52 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4a4 4 0 00-4 4v4l-2 4h12l-2-4V8a4 4 0 00-4-4z" fill={colors.primary} />
      <Path d="M10 20a2 2 0 004 0" stroke={colors.primary} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
