// 100 авторских аффирмаций-медитаций BeHappyDay (собственный голос)
// Единый настрой на прекрасный день — без деления на темы/разделы.
const BASE = "https://gkhfifuggxhwdsdecglg.supabase.co/storage/v1/object/public/meditations";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export interface Meditation {
  id: number;
  name: string;
  file: string;
}

export const MEDITATIONS: Meditation[] = Array.from({ length: 100 }, (_, i) => {
  const id = i + 1;
  return { id, name: "Аффирмация дня", file: `${BASE}/affirmation-${pad(id)}.m4a` };
});

export function getTodayMeditationIndex(): number {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dayOfYear % MEDITATIONS.length;
}

export function getTodayMeditation(): Meditation {
  return MEDITATIONS[getTodayMeditationIndex()];
}
