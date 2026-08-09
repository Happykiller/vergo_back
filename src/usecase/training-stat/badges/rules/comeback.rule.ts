import { BadgeRule, BadgeResult, BadgeContext } from '../models/badge.model';
import { diffDays } from '../utils/date.util';

/** COMEBACK: a session after >= 7 days of inactivity. */
export class ComebackRule implements BadgeRule {
  readonly code = 'COMEBACK' as const;

  evaluate(ctx: BadgeContext): BadgeResult {
    const sorted = [...ctx.stats].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    if (sorted.length === 0) return { code: this.code, earned: false };

    let lastDate = new Date(sorted[0].start);
    for (let i = 1; i < sorted.length; i++) {
      const current = new Date(sorted[i].start);
      if (diffDays(current, lastDate) >= 7) {
        return { code: this.code, earned: true, earnedAt: current.toISOString() };
      }
      lastDate = current;
    }
    return { code: this.code, earned: false };
  }
}
