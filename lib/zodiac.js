// Western zodiac — only needs month/day, so unlike the day-name it's
// available for every person immediately, no gender/birth-year required.
const ZODIAC_SIGNS = [
  { name: "Capricorn", symbol: "♑", endMonth: 1, endDay: 19 },
  { name: "Aquarius", symbol: "♒", endMonth: 2, endDay: 18 },
  { name: "Pisces", symbol: "♓", endMonth: 3, endDay: 20 },
  { name: "Aries", symbol: "♈", endMonth: 4, endDay: 19 },
  { name: "Taurus", symbol: "♉", endMonth: 5, endDay: 20 },
  { name: "Gemini", symbol: "♊", endMonth: 6, endDay: 20 },
  { name: "Cancer", symbol: "♋", endMonth: 7, endDay: 22 },
  { name: "Leo", symbol: "♌", endMonth: 8, endDay: 22 },
  { name: "Virgo", symbol: "♍", endMonth: 9, endDay: 22 },
  { name: "Libra", symbol: "♎", endMonth: 10, endDay: 22 },
  { name: "Scorpio", symbol: "♏", endMonth: 11, endDay: 21 },
  { name: "Sagittarius", symbol: "♐", endMonth: 12, endDay: 21 },
  { name: "Capricorn", symbol: "♑", endMonth: 12, endDay: 31 },
];

export function zodiacFor(month, day) {
  if (!month || !day) return null;
  return ZODIAC_SIGNS.find((z) => month < z.endMonth || (month === z.endMonth && day <= z.endDay));
}
