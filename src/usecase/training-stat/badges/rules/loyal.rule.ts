import { BadgeRule, BadgeResult, BadgeContext } from '../models/badge.model';
import { toDateOnly } from '../utils/date.util';

/** LOYAL: active on >= 30 distinct days within the last 60 days (rolling). */
export class LoyalRule implements BadgeRule {
  readonly code = 'LOYAL' as const;

  evaluate(ctx: BadgeContext): BadgeResult {
    const now = ctx.now ? new Date(ctx.now) : new Date();
    const from = new Date(now);
    from.setDate(from.getDate() - 59); // include today => 60 days window

    const activeDays = new Set<string>();
    ctx.stats.forEach(s => {
      const d = new Date(s.start);
      if (d >= from && d <= now) activeDays.add(toDateOnly(d));
    });

    if (activeDays.size >= 30) {
      // Find the 30th day chronologically to mark earnedAt
      const sorted = Array.from(activeDays).map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
      const idx = 29; // 30th item
      const earnedAt = sorted[Math.min(idx, sorted.length - 1)].toISOString();
      return { code: this.code, earned: true, earnedAt };
    }
    return { code: this.code, earned: false };
  }
}
