"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Difficulty, Lesson, Module } from "@/types/curriculum";
import type { AdaptiveRecommendation } from "./AdaptiveLearningService";
import { upsertLessonCompleted, recordExerciseAttempt, resetAllProgress } from "./progressClient";

interface ProgressSummary {
  completed: number;
  total: number;
  percent: number;
}

interface RecordAttemptInput {
  exerciseId: string;
  concept: string;
  conceptId: string;
  difficulty: Difficulty;
  correct: boolean;
  hintsUsed: number;
}

interface ProgressContextValue {
  completedLessons: Set<string>;
  markLessonCompleted: (slug: string) => void;
  /** Grava a tentativa e devolve a recomendação do sistema adaptativo (Fase 8) — `undefined` se não deu para calcular. */
  recordAttempt: (input: RecordAttemptInput) => Promise<AdaptiveRecommendation | undefined>;
  isLessonUnlocked: (lesson: Lesson) => boolean;
  moduleProgress: (module: Module) => ProgressSummary;
  overallProgress: () => ProgressSummary;
  /** Progresso só das aulas de um curso (multi-curso — ver DATABASE.md) — usado no seletor de cursos e no dashboard. */
  courseProgress: (courseSlug: string) => ProgressSummary;
  resetProgress: () => void;
}

/** Curso de uma aula quando `courseSlug` vem ausente (conteúdo/testes anteriores ao multi-curso). */
const DEFAULT_COURSE_SLUG = "python-do-zero";

const ProgressContext = createContext<ProgressContextValue | null>(null);

interface ProgressProviderProps {
  children: React.ReactNode;
  /** Currículo (do Supabase, com fallback mockado) buscado no layout do servidor. */
  modules: Module[];
  /** Slugs das aulas já concluídas, buscados de `student_progress` no layout do servidor (Fase 7). */
  initialCompletedLessons: string[];
}

export function ProgressProvider({
  children,
  modules,
  initialCompletedLessons,
}: ProgressProviderProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    () => new Set(initialCompletedLessons),
  );
  const allLessons = useMemo(() => modules.flatMap((m) => m.lessons), [modules]);

  const value = useMemo<ProgressContextValue>(() => {
    const markLessonCompleted = (slug: string) => {
      setCompletedLessons((prev) => {
        if (prev.has(slug)) return prev;
        const next = new Set(prev);
        next.add(slug);
        return next;
      });

      const lesson = allLessons.find((l) => l.slug === slug);
      if (lesson) void upsertLessonCompleted(lesson.id);
    };

    const recordAttempt = (input: RecordAttemptInput) => recordExerciseAttempt(input);

    const isLessonUnlocked = (lesson: Lesson) => {
      // Desbloqueio sequencial é por curso: a primeira aula do Python
      // Intermediário não pode ficar trancada esperando o aluno terminar
      // o Python do Zero inteiro. `courseSlug` ausente (currículo/teste de
      // antes do multi-curso) cai no curso padrão — comportamento idêntico
      // ao de antes quando só existe um curso.
      const courseSlug = lesson.courseSlug ?? DEFAULT_COURSE_SLUG;
      const courseLessons = allLessons.filter((l) => (l.courseSlug ?? DEFAULT_COURSE_SLUG) === courseSlug);
      const index = courseLessons.findIndex((l) => l.slug === lesson.slug);
      if (index <= 0) return true; // primeira aula do curso sempre liberada
      if (completedLessons.has(lesson.slug)) return true;
      const previous = courseLessons[index - 1];
      return completedLessons.has(previous.slug);
    };

    const moduleProgress = (module: Module): ProgressSummary => {
      const total = module.lessons.length;
      const completed = module.lessons.filter((l) => completedLessons.has(l.slug)).length;
      return { completed, total, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
    };

    const overallProgress = (): ProgressSummary => {
      const total = allLessons.length;
      const completed = allLessons.filter((l) => completedLessons.has(l.slug)).length;
      return { completed, total, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
    };

    const courseProgress = (courseSlug: string): ProgressSummary => {
      const lessons = allLessons.filter((l) => (l.courseSlug ?? DEFAULT_COURSE_SLUG) === courseSlug);
      const total = lessons.length;
      const completed = lessons.filter((l) => completedLessons.has(l.slug)).length;
      return { completed, total, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
    };

    const resetProgress = () => {
      setCompletedLessons(new Set());
      void resetAllProgress();
    };

    return {
      completedLessons,
      markLessonCompleted,
      recordAttempt,
      isLessonUnlocked,
      moduleProgress,
      overallProgress,
      courseProgress,
      resetProgress,
    };
  }, [completedLessons, allLessons]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress precisa ser usado dentro de <ProgressProvider>.");
  }
  return ctx;
}
