// All comments are in English for clarity.

export interface GamificationLeague {
  /** League machine name */
  code: 'UNRANKED' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'LEGEND';
  /** Minutes counted for the period (month or week) */
  minutes: number;
  /** Lower bound (inclusive) for this league in minutes */
  threshold: number;
  /** Next league label if any */
  next?: { code: GamificationLeague['code']; threshold: number } | null;
}

export interface GamificationUsecaseModel {
  /** XP total across all time */
  xp: number;
  /** Current level derived from XP */
  level: number;
  /** XP already gained within the current level */
  levelXp: number;
  /** XP needed to reach next level (delta from current level) */
  levelXpToNext: number;
  /** Progress (%) inside current level in [0,100] */
  levelProgressPct: number;
  /** League computed on a period (default: current month) */
  league: GamificationLeague;
  /** Optional alternative view on last 7 days */
  weeklyLeague?: GamificationLeague;
}
