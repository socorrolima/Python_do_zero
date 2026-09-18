import type { Difficulty } from "@/types/curriculum";

/**
 * AdaptiveLearningService — módulo único e configurável (item 8 do prompt
 * mestre): toda a regra de avançar/manter/revisar dificuldade mora aqui,
 * nunca espalhada pelos componentes.
 *
 * `recommendFromHistory` é a regra real, em uso desde a Fase 8:
 * `src/lib/learning/progressClient.ts` busca as últimas tentativas do
 * aluno para o conceito (de `exercise_attempts`, via Supabase) e aplica a
 * regra de 85%/60% descrita em ARCHITECTURE.md.
 *
 * `recommendFromSingleAttempt` continua existindo como modo degradado:
 * `ExercisePrompt` usa ela quando não há histórico disponível (sem
 * sessão, escrita no Supabase falhou, ou o currículo ainda está no
 * fallback mockado) — sinal isolado é melhor do que nenhum feedback.
 */

export interface AdaptiveConfig {
  /** % de acerto a partir do qual a dificuldade avança. */
  advanceThreshold: number;
  /** % de acerto abaixo do qual o conceito deve ser revisado. */
  reviewThreshold: number;
}

export const DEFAULT_ADAPTIVE_CONFIG: AdaptiveConfig = {
  advanceThreshold: 0.85,
  reviewThreshold: 0.6,
};

export interface AttemptSignal {
  concept: string;
  difficulty: Difficulty;
  correct: boolean;
  hintsUsed: number;
}

export interface AdaptiveRecommendation {
  action: "advance" | "maintain" | "review";
  concept: string;
  difficulty: Difficulty;
  reason: string;
}

/**
 * Recomendação a partir de uma única tentativa (Fase 3). Usar dicas conta
 * como sinal de dificuldade, mesmo quando o aluno acerta no fim — por isso
 * "acertou usando dica" resulta em "maintain", não em "advance".
 */
export function recommendFromSingleAttempt(
  signal: AttemptSignal,
): AdaptiveRecommendation {
  if (!signal.correct) {
    return {
      action: "review",
      concept: signal.concept,
      difficulty: signal.difficulty,
      reason: "não acertou na tentativa atual",
    };
  }
  if (signal.hintsUsed === 0) {
    return {
      action: "advance",
      concept: signal.concept,
      difficulty: signal.difficulty,
      reason: "acertou sem usar dicas",
    };
  }
  return {
    action: "maintain",
    concept: signal.concept,
    difficulty: signal.difficulty,
    reason: `acertou usando ${signal.hintsUsed} dica(s)`,
  };
}

/**
 * Recomendação a partir de um histórico de tentativas — a regra real,
 * usada em produção desde a Fase 8 (ver `progressClient.ts`).
 */
export function recommendFromHistory(
  concept: string,
  difficulty: Difficulty,
  attempts: { correct: boolean }[],
  config: AdaptiveConfig = DEFAULT_ADAPTIVE_CONFIG,
): AdaptiveRecommendation {
  if (attempts.length === 0) {
    return { action: "maintain", concept, difficulty, reason: "sem tentativas registradas" };
  }
  const accuracy =
    attempts.filter((a) => a.correct).length / attempts.length;

  if (accuracy >= config.advanceThreshold) {
    return { action: "advance", concept, difficulty, reason: `${Math.round(accuracy * 100)}% de acerto` };
  }
  if (accuracy < config.reviewThreshold) {
    return { action: "review", concept, difficulty, reason: `${Math.round(accuracy * 100)}% de acerto` };
  }
  return { action: "maintain", concept, difficulty, reason: `${Math.round(accuracy * 100)}% de acerto` };
}
