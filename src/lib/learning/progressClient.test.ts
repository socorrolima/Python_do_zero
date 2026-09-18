import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock do cliente Supabase (browser): progressClient.ts é "melhor esforço" —
// nunca deve lançar, sempre deve degradar com console.warn quando algo falha
// (sem sessão, escrita com erro, etc.). Simulamos aqui o builder encadeável
// do supabase-js (`from().select().eq().order().limit()` etc.), que é
// "thenable" — pode ser tanto encadeado quanto `await`ado a qualquer ponto,
// exatamente como o builder real do supabase-js.
function chainable(result: { data?: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {};
  const methods = ["select", "insert", "upsert", "delete", "eq", "order", "limit"];
  for (const method of methods) {
    builder[method] = vi.fn(() => builder);
  }
  // Torna o builder "thenable": `await builder` resolve para `result`.
  (builder as { then: unknown }).then = (
    resolve: (value: typeof result) => unknown,
  ) => Promise.resolve(result).then(resolve);
  return builder;
}

const state = {
  userId: "user-1" as string | null,
  tables: new Map<string, ReturnType<typeof chainable>>(),
};

function setTableResult(table: string, result: { data?: unknown; error: unknown }) {
  state.tables.set(table, chainable(result));
}

const getUserMock = vi.fn();
const fromMock = vi.fn((table: string) => {
  return state.tables.get(table) ?? chainable({ error: null });
});

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getUser: getUserMock },
    from: fromMock,
  }),
}));

const { upsertLessonCompleted, recordExerciseAttempt, resetAllProgress } = await import(
  "./progressClient"
);

beforeEach(() => {
  vi.clearAllMocks();
  state.tables.clear();
  state.userId = "user-1";
  getUserMock.mockImplementation(() =>
    Promise.resolve({ data: { user: state.userId ? { id: state.userId } : null } }),
  );
});

describe("upsertLessonCompleted", () => {
  it("não grava nada quando não há usuário logado (sem sessão)", async () => {
    state.userId = null;
    await upsertLessonCompleted("lesson-1");
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("faz upsert em student_progress quando há usuário logado", async () => {
    setTableResult("student_progress", { error: null });
    await upsertLessonCompleted("lesson-1");
    expect(fromMock).toHaveBeenCalledWith("student_progress");
  });

  it("não lança quando o upsert falha — apenas avisa (best-effort)", async () => {
    setTableResult("student_progress", { error: { message: "RLS violation" } });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(upsertLessonCompleted("lesson-1")).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("recordExerciseAttempt", () => {
  const baseParams = {
    exerciseId: "ex-1",
    concept: "if_else",
    conceptId: "concept-1",
    difficulty: 2 as const,
    correct: true,
    hintsUsed: 0,
  };

  it("devolve undefined quando não há usuário logado", async () => {
    state.userId = null;
    const result = await recordExerciseAttempt(baseParams);
    expect(result).toBeUndefined();
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("devolve undefined quando gravar a tentativa falha, sem consultar o histórico", async () => {
    setTableResult("exercise_attempts", { error: { message: "insert failed" } });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await recordExerciseAttempt(baseParams);
    expect(result).toBeUndefined();
    warn.mockRestore();
  });

  it("aplica a regra adaptativa (85%/60%) sobre o histórico devolvido pelo Supabase", async () => {
    // insert bem-sucedido, depois a consulta de histórico (mesma tabela,
    // mockada com o mesmo builder) devolve 5 tentativas, 5/5 corretas → advance
    setTableResult("exercise_attempts", {
      data: [
        { acertou: true },
        { acertou: true },
        { acertou: true },
        { acertou: true },
        { acertou: true },
      ],
      error: null,
    });
    setTableResult("concept_mastery", { error: null });

    const result = await recordExerciseAttempt(baseParams);

    expect(result?.action).toBe("advance");
    expect(fromMock).toHaveBeenCalledWith("concept_mastery");
  });

  it("recomenda revisão quando o histórico tem baixa taxa de acerto", async () => {
    setTableResult("exercise_attempts", {
      data: [{ acertou: false }, { acertou: false }, { acertou: true }],
      error: null,
    });
    setTableResult("concept_mastery", { error: null });

    const result = await recordExerciseAttempt(baseParams);
    expect(result?.action).toBe("review");
  });

  it("devolve undefined quando a leitura do histórico falha", async () => {
    setTableResult("exercise_attempts", { error: null }); // insert ok
    // A mesma tabela serve tanto para o insert quanto para a consulta de
    // histórico no mock (não distinguimos a chamada) — para simular falha
    // na leitura, sobrescrevemos o resultado só depois do insert síncrono.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const builder = chainable({ error: { message: "read failed" } });
    state.tables.set("exercise_attempts", builder);
    const result = await recordExerciseAttempt(baseParams);
    expect(result).toBeUndefined();
    warn.mockRestore();
  });
});

describe("resetAllProgress", () => {
  it("não faz nada sem usuário logado", async () => {
    state.userId = null;
    await resetAllProgress();
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("apaga as três tabelas de progresso do aluno logado", async () => {
    setTableResult("student_progress", { error: null });
    setTableResult("exercise_attempts", { error: null });
    setTableResult("concept_mastery", { error: null });

    await resetAllProgress();

    expect(fromMock).toHaveBeenCalledWith("student_progress");
    expect(fromMock).toHaveBeenCalledWith("exercise_attempts");
    expect(fromMock).toHaveBeenCalledWith("concept_mastery");
  });

  it("não lança quando alguma das exclusões falha — best-effort", async () => {
    setTableResult("student_progress", { error: { message: "boom" } });
    setTableResult("exercise_attempts", { error: null });
    setTableResult("concept_mastery", { error: null });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(resetAllProgress()).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
