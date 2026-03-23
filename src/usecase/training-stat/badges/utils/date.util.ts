// src\usecases\badges\utils\date.util.ts

export function toDateOnly(d: Date): string {
  // Returns YYYY-MM-DD in local time (for day-bucketing).
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

export function diffDays(a: Date, b: Date): number {
  // Returns |a - b| in full days (floor).
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.floor(Math.abs(ms) / (24 * 60 * 60 * 1000));
}

export function isoWeekKey(d: Date): string {
  // Compute ISO week-year + week-number key like "2025-W32".
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Thursday in current week decides the year.
  const dayNum = (dt.getUTCDay() + 6) % 7;
  dt.setUTCDate(dt.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(dt.getUTCFullYear(), 0, 4));
  const weekNo = 1 + Math.round(((dt.getTime() - firstThursday.getTime()) / 86400000 - 3) / 7);
  const year = dt.getUTCFullYear();
  return `${year}-W${weekNo.toString().padStart(2, '0')}`;
}
