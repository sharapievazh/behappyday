/**
 * Единый формат ключа дня для всего проекта: UTC-дата вида "2026-08-06".
 */
export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
