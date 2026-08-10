// 100 авторских аффирмаций-медитаций BeHappyDay (собственный голос)
const BASE = "https://gkhfifuggxhwdsdecglg.supabase.co/storage/v1/object/public/meditations";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

const THEME_RANGES: { name: string; start: number; end: number }[] = [
  { name: "Женское счастье", start: 1, end: 18 },
  { name: "Тело", start: 19, end: 34 },
  { name: "Разум", start: 35, end: 50 },
  { name: "Сердце и любовь", start: 51, end: 66 },
  { name: "Душа и гармония", start: 67, end: 83 },
  { name: "Изобилие и богатство", start: 84, end: 100 },
];

function themeFor(id: number): string {
  return THEME_RANGES.find((t) => id >= t.start && id <= t.end)!.name;
}

export interface Meditation {
  id: number;
  name: string;
  file: string;
}

export const MEDITATIONS: Meditation[] = Array.from({ length: 100 }, (_, i) => {
  const id = i + 1;
  return { id, name: themeFor(id), file: `${BASE}/affirmation-${pad(id)}.m4a` };
});

// Порядок показа по дням: round-robin через все 6 тем, чтобы не было
// нескольких дней подряд с одной и той же темой.
const DAY_ORDER: number[] = [
  1, 19, 35, 51, 67, 84, 2, 20, 36, 52, 68, 85, 3, 21, 37, 53, 69, 86, 4, 22,
  38, 54, 70, 87, 5, 23, 39, 55, 71, 88, 6, 24, 40, 56, 72, 89, 7, 25, 41, 57,
  73, 90, 8, 26, 42, 58, 74, 91, 9, 27, 43, 59, 75, 92, 10, 28, 44, 60, 76,
  93, 11, 29, 45, 61, 77, 94, 12, 30, 46, 62, 78, 95, 13, 31, 47, 63, 79, 96,
  14, 32, 48, 64, 80, 97, 15, 33, 49, 65, 81, 98, 16, 34, 50, 66, 82, 99, 17,
  83, 100, 18,
];

const MEDITATIONS_BY_ID: Record<number, Meditation> = Object.fromEntries(
  MEDITATIONS.map((m) => [m.id, m])
);

export function getTodayMeditationIndex(): number {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dayOfYear % DAY_ORDER.length;
}

export function getTodayMeditation(): Meditation {
  const id = DAY_ORDER[getTodayMeditationIndex()];
  return MEDITATIONS_BY_ID[id];
}
