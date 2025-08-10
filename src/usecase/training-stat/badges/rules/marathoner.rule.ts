import { BadgeRule, BadgeResult, BadgeContext } from '../models/badge.model';

/** MARATHONER: total >= 10 hours (600 minutes). */
export class MarathonerRule implements BadgeRule {
  readonly code = 'MARATHONER' as const;

  evaluate(ctx: BadgeContext): BadgeResult {
    let acc = 0;
    const sorted = [...ctx.stats].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    for (const s of sorted) {
      acc += Math.max(0, Math.floor((s.durationInSeconds || 0) / 60));
      if (acc >= 600) {
        return { code: this.code, earned: true, earnedAt: new Date(s.start).toISOString() };
      }
    }
    return { code: this.code, earned: false };
  }
}
