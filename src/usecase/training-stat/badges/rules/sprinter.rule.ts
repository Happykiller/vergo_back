import { BadgeRule, BadgeResult, BadgeContext } from '../models/badge.model';

/** SPRINTER: a single session of >= 60 minutes. */
export class SprinterRule implements BadgeRule {
  readonly code = 'SPRINTER' as const;

  evaluate(ctx: BadgeContext): BadgeResult {
    const sixty = 60;
    const qualifying = [...ctx.stats]
      .filter((s) => Math.floor((s.durationInSeconds || 0) / 60) >= sixty)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    if (qualifying.length === 0) return { code: this.code, earned: false };
    return { code: this.code, earned: true, earnedAt: new Date(qualifying[0].start).toISOString() };
  }
}
