export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MS_PER_DAY = 86400000;

export function daysUntil(month, day, today = new Date()) {
  const y = today.getFullYear();
  let d = new Date(y, month - 1, day);
  const t = new Date(y, today.getMonth(), today.getDate());
  if (d < t) d = new Date(y + 1, month - 1, day);
  return Math.round((d - t) / MS_PER_DAY);
}

export function turningAge(month, day, birthYear, today = new Date()) {
  const y = today.getFullYear();
  const d = new Date(y, month - 1, day);
  const t = new Date(y, today.getMonth(), today.getDate());
  const nextYear = d < t ? y + 1 : y;
  return nextYear - birthYear;
}

export function dateLabel(month, day) {
  return `${(MONTHS[month - 1] || "").slice(0, 3)} ${day}`;
}

export function initialFor(name) {
  return (name || "").trim().charAt(0).toUpperCase();
}

export function defaultBirthYear(today = new Date()) {
  return today.getFullYear() - 30;
}

export const AVATAR_COLORS = ["#E2604A", "#4E6FB0", "#8C8580", "#4F9E72"];

export function avatarColorForIndex(i) {
  return AVATAR_COLORS[i % AVATAR_COLORS.length];
}

// Lead-time offsets, in days, keyed by the enum used in Firestore/settings.
export const LEAD_TIME_DAYS = {
  same_day: 0,
  one_day: 1,
  one_week: 7,
};

export const LEAD_TIME_OPTIONS = [
  { label: "Same day", value: "same_day" },
  { label: "1 day before", value: "one_day" },
  { label: "1 week before", value: "one_week" },
];

// Shifts a (month, day) pair back by `days`, rolling over month/year
// boundaries, so a notification trigger can be scheduled on the pre-birthday
// lead date (e.g. "1 week before" a Jan 2 birthday triggers on Dec 26).
export function shiftDateByDays(month, day, days, referenceYear = new Date().getFullYear()) {
  const d = new Date(referenceYear, month - 1, day);
  d.setDate(d.getDate() - days);
  return { month: d.getMonth() + 1, day: d.getDate() };
}

// "HH:mm" <-> Date helpers for the Settings reminder-time picker.
export function timeStringToDate(timeString) {
  const [hour, minute] = (timeString || "09:00").split(":").map(Number);
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

export function dateToTimeString(date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
