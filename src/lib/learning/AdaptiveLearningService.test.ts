import { describe, expect, it } from "vitest";
import {
  DEFAULT_ADAPTIVE_CONFIG,
  recommendFromHistory,
  recommendFromSingleAttempt,
} from "./AdaptiveLearningService";

describe("recommendFromSingleAttempt", () => {
  it("recomenda revisão quando o aluno erra, independente de dicas", () => {
    const result = recommendFromSingleAttempt({
      concept: "print",
      difficulty: 1,
      correct: false,
      hintsUsed: 0,
    });
    expect(result.action).toBe("review");
  });

  it("recomenda avançar quando acerta sem usar dicas", () => {
    const result = recommendFromSingleAttempt({
      concept: "print",
      difficulty: 1,
      correct: true,
      hintsUsed: 0,
    });
    expect(result.action).toBe("advance");
  });

  it("recomenda manter quando acerta mas usou dica — usar dica não é o mesmo que dominar", () => {
    const result = recommendFromSingleAttempt({
      concept: "print",
      difficulty: 1,
      correct: true,
      hintsUsed: 1,
    });
    expect(result.action).toBe("maintain");
    expect(result.reason).toContain("1 dica");
  });

  it("preserva concept e difficulty na recomendação", () => {
    const result = recommendFromSingleAttempt({
      concept: "variaveis",
      difficulty: 3,
      correct: true,
      hintsUsed: 0,
    });
    expect(result.concept).toBe("variaveis");
    expect(result.difficulty).toBe(3);
  });
});

describe("recommendFromHistory", () => {
  it("mantém quando não há tentativas registradas (não deve travar em nenhuma ação)", () => {
    const result = recommendFromHistory("if_else", 2, []);
    expect(result.action).toBe("maintain");
  });

  it("avança quando a taxa de acerto atinge o limiar configurado (85% por padrão)", () => {
    const attempts = [
      { correct: true },
      { correct: true },
      { correct: true },
      { correct: true },
      { correct: false },
    ]; // 4/5 = 80% — abaixo do limiar de 85%, não deve avançar
    const result = recommendFromHistory("if_else", 2, attempts);
    expect(result.action).toBe("maintain");
  });

  it("avança quando 100% de acerto no histórico", () => {
    const attempts = Array(5).fill({ correct: true });
    const result = recommendFromHistory("if_else", 2, attempts);
    expect(result.action).toBe("advance");
  });

  it("revisa quando a taxa de acerto fica abaixo do limiar de revisão (60% por padrão)", () => {
    const attempts = [{ correct: true }, { correct: false }, { correct: false }];
    // 1/3 ≈ 33%
    const result = recommendFromHistory("if_else", 2, attempts);
    expect(result.action).toBe("review");
  });

  it("mantém na faixa intermediária entre os dois limiares", () => {
    const attempts = [{ correct: true }, { correct: true }, { correct: false }];
    // 2/3 ≈ 67% — entre 60% e 85%
    const result = recommendFromHistory("if_else", 2, attempts);
    expect(result.action).toBe("maintain");
  });

  it("respeita um AdaptiveConfig customizado em vez do padrão", () => {
    const attempts = [{ correct: true }, { correct: false }];
    // 50% — abaixo do reviewThreshold padrão (60%), mas dentro de um customizado (40%)
    const result = recommendFromHistory("if_else", 2, attempts, {
      advanceThreshold: 0.9,
      reviewThreshold: 0.4,
    });
    expect(result.action).toBe("maintain");
  });

  it("usa exatamente os limiares padrão documentados", () => {
    expect(DEFAULT_ADAPTIVE_CONFIG.advanceThreshold).toBe(0.85);
    expect(DEFAULT_ADAPTIVE_CONFIG.reviewThreshold).toBe(0.6);
  });

  it("trata o limiar de avanço como inclusivo (>=)", () => {
    // 17/20 = 85% exatos
    const attempts = [
      ...Array(17).fill({ correct: true }),
      ...Array(3).fill({ correct: false }),
    ];
    const result = recommendFromHistory("if_else", 2, attempts);
    expect(result.action).toBe("advance");
  });

  it("trata o limiar de revisão como exclusivo (<)", () => {
    // 60% exatos não deve cair para "review"
    const attempts = [
      ...Array(3).fill({ correct: true }),
      ...Array(2).fill({ correct: false }),
    ];
    const result = recommendFromHistory("if_else", 2, attempts);
    expect(result.action).toBe("maintain");
  });
});
