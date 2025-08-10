// src\usecase\training-stat\badges\get.user-badges.usecase.ts
import { LoyalRule } from './rules/loyal.rule';
import { MachineRule } from './rules/machine.rule';
import { Inversify } from '@src/inversify/investify';
import { ComebackRule } from './rules/comeback.rule';
import { SprinterRule } from './rules/sprinter.rule';
import { FirstStepRule } from './rules/first-step.rule';
import { MarathonerRule } from './rules/marathoner.rule';
import { UnstoppableRule } from './rules/unstoppable.rule';
import { FullBodyWarriorRule } from './rules/full-body-warrior.rule';
import { BadgeContext, BadgeResult, BadgeRule } from './models/badge.model';
import { TrainingStatUsecaseModel } from '@usecase/training-stat/model/training-stat.usecase.model';

export interface GetUserBadgesParams {
  /** Now override for deterministic tests */
  now?: Date;
  /** Full set of exercise types (universe) */
  allExerciseTypeCodes?: string[];
  /** User-completed exercise types */
  completedExerciseTypeCodes?: string[];
}

export class GetUserBadgesUsecase {
  inversify: Inversify;
  private rules: BadgeRule[];

  constructor(inversify: Inversify) {
    this.inversify = inversify;
    // Register rules here. Easy to add new ones.
    this.rules = [
      new FirstStepRule(),
      new ComebackRule(),
      new MachineRule(),
      new LoyalRule(),
      new SprinterRule(),
      new MarathonerRule(),
      new UnstoppableRule(),
      new FullBodyWarriorRule(),
    ];
  }

  /** Public entry point: pull stats then evaluate rules. */
  async execute(userId: string, params: GetUserBadgesParams = {}): Promise<BadgeResult[]> {
    const stats: TrainingStatUsecaseModel[] =
      await this.inversify.getTrainingStatsByUserIdUsecase.execute(userId);

    const ctx: BadgeContext = {
      stats,
      now: params.now,
      allExerciseTypeCodes: params.allExerciseTypeCodes,
      completedExerciseTypeCodes: params.completedExerciseTypeCodes,
    };

    const results = this.rules.map((r) => r.evaluate(ctx));

    // --- Ordering: earned first, most recent first, then code as tiebreaker ---
    const scored = results.map((r) => ({
      r,
      earnedScore: r.earned ? 1 : 0,
      ts: r.earned && r.earnedAt ? new Date(r.earnedAt).getTime() : -1,
    }));

    scored.sort((a, b) =>
      // 1) earned desc
      b.earnedScore - a.earnedScore ||
      // 2) earnedAt desc
      b.ts - a.ts ||
      // 3) code asc (deterministic)
      a.r.code.localeCompare(b.r.code)
    );

    return scored.map((s) => s.r);
  }
}
