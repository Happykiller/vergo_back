import { BadgeRule, BadgeResult, BadgeContext } from '../models/badge.model';

/**
 * FULL_BODY_WARRIOR: user has completed ALL exercise types.
 * - The full set of types is provided via context: allExerciseTypeCodes
 * - The user's completed set is provided via context: completedExerciseTypeCodes
 * Note: Collection logic is outside (adapter/service); this rule stays pure.
 */
export class FullBodyWarriorRule implements BadgeRule {
  readonly code = 'FULL_BODY_WARRIOR' as const;

  evaluate(ctx: BadgeContext): BadgeResult {
    const universe = new Set((ctx.allExerciseTypeCodes ?? []).filter(Boolean));
    const done = new Set((ctx.completedExerciseTypeCodes ?? []).filter(Boolean));

    if (universe.size === 0) {
      // Unknown/Assumption: without a universe, we cannot earn this badge.
      return { code: this.code, earned: false, meta: { reason: 'NO_UNIVERSE' } };
    }

    const missing: string[] = [];
    for (const t of universe) if (!done.has(t)) missing.push(t);

    if (missing.length === 0) {
      // earnedAt cannot be computed precisely without per-type completion timestamps.
      return { code: this.code, earned: true };
    }
    return { code: this.code, earned: false, meta: { missing } };
  }
}
