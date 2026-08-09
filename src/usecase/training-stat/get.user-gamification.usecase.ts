// src\usecase\training-stat\get.user-gamification.usecase.ts
import { Inversify } from '@src/inversify/investify';
import { GamificationUsecaseModel, GamificationLeague } from './model/gamification.usecase.model';
import { TrainingStatUsecaseModel } from '@usecase/training-stat/model/training-stat.usecase.model';

type LeagueCode = GamificationLeague['code'];

interface Params {
  /** If true, compute an additional weekly league snapshot */
  includeWeekly?: boolean;
  /** Factor tuning for level curve */
  base?: number; // default 45
  growth?: number; // default 1.35
}

export class GetUserGamificationUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  /** Public entry point */
  async execute(userId: string, params: Params = {}): Promise<GamificationUsecaseModel> {
    const { includeWeekly = true, base = 45, growth = 1.35 } = params;

    const stats: TrainingStatUsecaseModel[] = await this.inversify.getTrainingStatsByUserIdUsecase.execute(userId);

    // --- XP total (in minutes) ---
    const totalMinutes = this.sumMinutes(stats);
    const xp = Math.floor(totalMinutes);

    // --- Level ---
    const level = this.levelFromXp(xp, base, growth);
    const prevLevelXp = this.xpNeededForLevel(level, base, growth);
    const nextLevelXp = this.xpNeededForLevel(level + 1, base, growth);
    const levelXp = xp - prevLevelXp;
    const levelXpToNext = Math.max(nextLevelXp - xp, 0);
    const levelProgressPct = nextLevelXp === prevLevelXp ? 100 : Math.max(0, Math.min(100, (levelXp / (nextLevelXp - prevLevelXp)) * 100));

    // --- League (rolling 30-day window) ---
    const rolling30DayMinutes = this.sumMinutes(this.filterLastDays(stats, 30));
    const league = this.computeLeague(rolling30DayMinutes);

    // --- Weekly optional ---
    let weeklyLeague: GamificationLeague | undefined;
    if (includeWeekly) {
      const weeklyMinutes = this.sumMinutes(this.filterLast7Days(stats));
      weeklyLeague = this.computeLeague(weeklyMinutes, 'WEEKLY');
    }

    return {
      xp,
      level,
      levelXp,
      levelXpToNext,
      levelProgressPct: Math.round(levelProgressPct),
      league,
      weeklyLeague,
    };
  }

  // ---------- Internals ----------

  /** Sums minutes from durationInSeconds */
  private sumMinutes(stats: TrainingStatUsecaseModel[]): number {
    // Robustness: ignore negative or invalid durations.
    return stats.reduce((acc, s) => acc + Math.max(0, Math.floor((s.durationInSeconds || 0) / 60)), 0);
  }

  /** Filter stats in the last N days (rolling window) */
  private filterLastDays(stats: TrainingStatUsecaseModel[], days: number): TrainingStatUsecaseModel[] {
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - days);

    return stats.filter((s) => {
      const d = new Date(s.start);
      return d >= from;
    });
  }

  /** Filter stats in the last 7 days (rolling window) */
  private filterLast7Days(stats: TrainingStatUsecaseModel[]): TrainingStatUsecaseModel[] {
    return this.filterLastDays(stats, 7);
  }

  /** Level from XP using soft exponential curve with closed-form inverse */
  private levelFromXp(xp: number, base: number, growth: number): number {
    // level 1 starts at xp=0
    const inner = (xp / base) * (growth - 1) + 1;
    if (inner <= 1) return 1;
    const lvl = Math.floor(Math.log(inner) / Math.log(growth)) + 1;
    return Math.max(1, lvl);
  }

  /** Total XP needed to *reach* a given level */
  private xpNeededForLevel(level: number, base: number, growth: number): number {
    if (level <= 1) return 0;
    return Math.floor(base * ((Math.pow(growth, level - 1) - 1) / (growth - 1)));
  }

  /** Compute league by thresholds; mode is label-only (monthly vs weekly) */
  private computeLeague(minutes: number, mode: 'MONTHLY' | 'WEEKLY' = 'MONTHLY'): GamificationLeague {
    // Thresholds are minutes; tuning friendly & readable.
    const bands: Array<{ code: LeagueCode; threshold: number }> = [
      { code: 'UNRANKED', threshold: 0 },
      { code: 'BRONZE', threshold: mode === 'MONTHLY' ? 60 : 15 },
      { code: 'SILVER', threshold: mode === 'MONTHLY' ? 180 : 45 },
      { code: 'GOLD', threshold: mode === 'MONTHLY' ? 360 : 90 },
      { code: 'PLATINUM', threshold: mode === 'MONTHLY' ? 720 : 180 },
      { code: 'DIAMOND', threshold: mode === 'MONTHLY' ? 1200 : 300 },
      { code: 'LEGEND', threshold: mode === 'MONTHLY' ? 1800 : 450 },
    ];

    // Find the highest band not exceeding minutes
    let current = bands[0];
    for (const b of bands) {
      if (minutes >= b.threshold) current = b;
    }

    // Compute next band if any
    const idx = bands.findIndex((b) => b.code === current.code);
    const next = idx < bands.length - 1 ? bands[idx + 1] : null;

    return {
      code: current.code,
      minutes,
      threshold: current.threshold,
      next: next ? { code: next.code, threshold: next.threshold } : null,
    };
  }
}
