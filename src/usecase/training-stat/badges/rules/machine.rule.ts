import { BadgeRule, BadgeResult, BadgeContext } from '../models/badge.model';
import { toDateOnly } from '../utils/date.util';

/** MACHINE: 7 consecutive active days (>=1 session/day). */
export class MachineRule implements BadgeRule {
  readonly code = 'MACHINE' as const;

  evaluate(ctx: BadgeContext): BadgeResult {
    const days = new Set<string>();
    ctx.stats.forEach(s => days.add(toDateOnly(new Date(s.start))));
    if (days.size === 0) return { code: this.code, earned: false };

    const allDays = Array.from(days).map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
    let streak = 1;
    for (let i = 1; i < allDays.length; i++) {
      const prev = allDays[i - 1];
      const cur = allDays[i];
      const delta = Math.round((cur.getTime() - prev.getTime()) / 86400000);
      if (delta === 1) {
        streak++;
        if (streak >= 7) {
          return { code: this.code, earned: true, earnedAt: allDays[i].toISOString() };
        }
      } else if (delta > 1) {
        streak = 1;
      }
    }
    return { code: this.code, earned: false };
  }
}
