// Hex approximations of the design's oklch() palette — React Native doesn't
// support oklch(), so these are converted once here as the source of truth.
export const colors = {
  bg: "#FAF7F5",
  ink: "#221F1E",
  muted: "#8A8582",
  mutedFaint: "#B3ADA9",
  border: "#ECE7E3",
  chip: "#F0ECE9",

  primary: "#E2604A",
  primaryPressed: "#C14934",
  primaryBorder: "#B23F2C",
  primaryDarkest: "#9E3626",

  tint: "#F3E6E2",
  gold: "#C99A2E",

  white: "#FFFFFF",
  avatars: ["#E2604A", "#4E6FB0", "#8C8580", "#4F9E72"],
};

export const cardShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
};
