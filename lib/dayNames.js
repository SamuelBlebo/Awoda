// Akan (Twi) day-names — the traditional name given based on the day of the
// week a person was born, distinct per gender. Indexed to match JS
// `Date.getDay()` (0 = Sunday ... 6 = Saturday).
const DAY_NAMES = [
  { male: "Kwasi", female: "Akosua" }, // Sunday
  { male: "Kwadwo", female: "Adwoa" }, // Monday
  { male: "Kwabena", female: "Abena" }, // Tuesday
  { male: "Kwaku", female: "Akua" }, // Wednesday
  { male: "Yaw", female: "Yaa" }, // Thursday
  { male: "Kofi", female: "Efua" }, // Friday
  { male: "Kwame", female: "Ama" }, // Saturday
];

// Day-of-week depends on the full date, so this needs an actual birth year,
// not just month/day — and a known gender. Returns null when either is
// missing (contacts imported without a birth year, or no gender set yet),
// so callers can fall back to something else.
export function dayNameFor(month, day, birthYear, gender) {
  if (!birthYear || !month || !day || (gender !== "male" && gender !== "female")) {
    return null;
  }
  const dayOfWeek = new Date(birthYear, month - 1, day).getDay();
  return DAY_NAMES[dayOfWeek][gender];
}
