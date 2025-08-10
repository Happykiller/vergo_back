import { BadgeRule, BadgeResult, BadgeContext } from '../models/badge.model';

/** FIRST_STEP: first completed session ever. */
export class FirstStepRule implements BadgeRule {
  readonly code = 'FIRST_STEP' as const;

  evaluate(ctx: BadgeContext): BadgeResult {
    const sorted = [...ctx.stats]
      .filter(s => s.completed)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    if (sorted.length === 0) {
      return { code: this.code, earned: false };
    }
    return { code: this.code, earned: true, earnedAt: new Date(sorted[0].start).toISOString() };
  }
}
