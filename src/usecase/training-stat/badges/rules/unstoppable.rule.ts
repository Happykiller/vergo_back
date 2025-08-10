import { BadgeRule, BadgeResult, BadgeContext } from '../models/badge.model';
import { isoWeekKey } from '../utils/date.util';

/** UNSTOPPABLE: >= 4 sessions in the same ISO week. */
export class UnstoppableRule implements BadgeRule {
  readonly code = 'UNSTOPPABLE' as const;

  evaluate(ctx: BadgeContext): BadgeResult {
    const buckets = new Map<string, number>();
    const earliestInWeek = new Map<string, Date>();

    for (const s of ctx.stats) {
      const d = new Date(s.start);
      const key = isoWeekKey(d);
      buckets.set(key, (buckets.get(key) || 0) + 1);
      const earliest = earliestInWeek.get(key);
      if (!earliest || d < earliest) earliestInWeek.set(key, d);
    }

    for (const [key, count] of buckets.entries()) {
      if (count >= 4) {
        const d = earliestInWeek.get(key)!;
        return { code: this.code, earned: true, earnedAt: d.toISOString(), meta: { week: key, count } };
      }
    }
    return { code: this.code, earned: false };
  }
}
