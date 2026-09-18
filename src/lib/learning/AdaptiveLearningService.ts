import type { Difficulty } from "@/types/curriculum";

/**
 * AdaptiveLearningService — módulo único e configurável (item 8 do prompt
 * mestre). Nesta fase (3) só recebe o resultado de UMA tentativa, porque
 * ainda não há histórico persistido (`exercise_attempts` chega na Fase 4).
 * A partir da Fase 8, `recommend()` passa a receber o histórico recente do
 * aluno para aquele conceito e aplicar a regra de 85%/60% descrita em
 * ARCHITECTURE.md — a assinatura pública deste serviço já é pensada para
 * essa troca sem alterar quem o consome.
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
 * Recomendação a partir de um histórico de tentativas (formato usado a
 * partir da Fase 8, já implementado para permitir testes desde já).
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
