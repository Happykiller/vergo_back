// src\usecases\badges\models\badge.model.ts
export type BadgeCode = 'FIRST_STEP' | 'COMEBACK' | 'MACHINE' | 'LOYAL' | 'SPRINTER' | 'MARATHONER' | 'UNSTOPPABLE' | 'FULL_BODY_WARRIOR';

export interface BadgeResult {
  code: BadgeCode;
  earned: boolean;
  /** ISO date when the condition was first met */
  earnedAt?: string;
  /** Optional metadata for UI (e.g., missingTypes) */
  meta?: Record<string, unknown>;
}

export interface BadgeContext {
  /** Raw user training stats */
  stats: Array<{
    id: string;
    training_id: string;
    start: string; // ISO
    end: string; // ISO
    durationInSeconds: number;
    completed: boolean;
    created_at: string;
    user_id?: string;
  }>;
  /** "now" override for tests/reproducibility */
  now?: Date;
  /** All exercise type codes to complete (for FULL_BODY_WARRIOR) */
  allExerciseTypeCodes?: string[];
  /** Exercise type codes the user already completed */
  completedExerciseTypeCodes?: string[];
}

export interface BadgeRule {
  /** Unique code for the badge */
  readonly code: BadgeCode;
  /** Evaluate the rule against the context */
  evaluate(ctx: BadgeContext): BadgeResult;
}
