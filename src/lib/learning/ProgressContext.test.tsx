import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { Module } from "@/types/curriculum";
import { ProgressProvider, useProgress } from "./ProgressContext";

const upsertLessonCompleted = vi.fn().mockResolvedValue(undefined);
const recordExerciseAttempt = vi.fn().mockResolvedValue(undefined);
const resetAllProgress = vi.fn().mockResolvedValue(undefined);

vi.mock("./progressClient", () => ({
  upsertLessonCompleted: (...args: unknown[]) => upsertLessonCompleted(...args),
  recordExerciseAttempt: (...args: unknown[]) => recordExerciseAttempt(...args),
  resetAllProgress: (...args: unknown[]) => resetAllProgress(...args),
}));

function makeModules(): Module[] {
  return [
    {
      slug: "modulo-1",
      order: 1,
      title: "Pensamento computacional",
      description: "",
      lessons: [
        {
          id: "lesson-1",
          slug: "aula-1",
          moduleSlug: "modulo-1",
          order: 1,
          title: "Aula 1",
          objective: "",
          estimatedMinutes: 10,
          difficulty: 1,
          concept: "algoritmo",
          example: { code: "", explanation: "" },
          challenge: {
            id: "ex-1",
            title: "",
            difficulty: 1,
            concept: "algoritmo",
            conceptId: "concept-1",
            instruction: "",
            hints: [],
            kind: "order",
            correctOrder: ["a", "b"],
          },
          summary: "",
          nextLessonSlug: "aula-2",
        },
        {
          id: "lesson-2",
          slug: "aula-2",
          moduleSlug: "modulo-1",
          order: 2,
          title: "Aula 2",
          objective: "",
          estimatedMinutes: 10,
          difficulty: 1,
          concept: "sequencia",
          example: { code: "", explanation: "" },
          challenge: {
            id: "ex-2",
            title: "",
            difficulty: 1,
            concept: "sequencia",
            conceptId: "concept-2",
            instruction: "",
            hints: [],
            kind: "order",
            correctOrder: ["a", "b"],
          },
          summary: "",
          nextLessonSlug: null,
        },
      ],
    },
  ];
}

function setup(initialCompletedLessons: string[] = []) {
  const modules = makeModules();
  return renderHook(() => useProgress(), {
    wrapper: ({ children }) => (
      <ProgressProvider modules={modules} initialCompletedLessons={initialCompletedLessons}>
        {children}
      </ProgressProvider>
    ),
  });
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("ProgressContext — regra de pré-requisito (item 32 do prompt mestre)", () => {
  it("a primeira aula do currículo está sempre liberada", () => {
    const { result } = setup();
    const firstLesson = { slug: "aula-1" } as never;
    expect(result.current.isLessonUnlocked(firstLesson)).toBe(true);
  });

  it("a segunda aula só libera depois que a anterior for concluída", () => {
    const { result } = setup();
    const secondLesson = { slug: "aula-2" } as never;
    expect(result.current.isLessonUnlocked(secondLesson)).toBe(false);
  });

  it("libera a segunda aula quando a primeira já está no progresso inicial (vindo do servidor)", () => {
    const { result } = setup(["aula-1"]);
    const secondLesson = { slug: "aula-2" } as never;
    expect(result.current.isLessonUnlocked(secondLesson)).toBe(true);
  });
});

describe("ProgressContext — markLessonCompleted", () => {
  it("marca a aula como concluída localmente (otimista) e grava no Supabase pelo id, não pelo slug", () => {
    const { result } = setup();
    act(() => {
      result.current.markLessonCompleted("aula-1");
    });
    expect(result.current.completedLessons.has("aula-1")).toBe(true);
    expect(upsertLessonCompleted).toHaveBeenCalledWith("lesson-1");
  });

  it("desbloqueia a próxima aula depois de marcar a anterior como concluída", () => {
    const { result } = setup();
    act(() => {
      result.current.markLessonCompleted("aula-1");
    });
    expect(result.current.isLessonUnlocked({ slug: "aula-2" } as never)).toBe(true);
  });
});

describe("ProgressContext — progresso agregado", () => {
  it("calcula moduleProgress e overallProgress com base nas aulas concluídas", () => {
    const { result } = setup(["aula-1"]);
    expect(result.current.overallProgress()).toEqual({ completed: 1, total: 2, percent: 50 });
    const firstModule = makeModules()[0];
    expect(result.current.moduleProgress(firstModule)).toEqual({ completed: 1, total: 2, percent: 50 });
  });
});

describe("ProgressContext — recordAttempt e resetProgress", () => {
  it("delega recordAttempt para progressClient.recordExerciseAttempt", async () => {
    const { result } = setup();
    const input = {
      exerciseId: "ex-1",
      concept: "algoritmo",
      conceptId: "concept-1",
      difficulty: 1 as const,
      correct: true,
      hintsUsed: 0,
    };
    await act(async () => {
      await result.current.recordAttempt(input);
    });
    expect(recordExerciseAttempt).toHaveBeenCalledWith(input);
  });

  it("resetProgress limpa o estado local imediatamente e chama resetAllProgress", () => {
    const { result } = setup(["aula-1"]);
    expect(result.current.completedLessons.size).toBe(1);
    act(() => {
      result.current.resetProgress();
    });
    expect(result.current.completedLessons.size).toBe(0);
    expect(resetAllProgress).toHaveBeenCalledTimes(1);
  });
});
