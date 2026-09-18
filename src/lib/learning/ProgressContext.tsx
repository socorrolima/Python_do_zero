"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Lesson, Module } from "@/types/curriculum";
import { upsertLessonCompleted, recordExerciseAttempt, resetAllProgress } from "./progressClient";

interface ProgressSummary {
  completed: number;
  total: number;
  percent: number;
}

interface RecordAttemptInput {
  exerciseId: string;
  conceptId: string;
  correct: boolean;
  hintsUsed: number;
}

interface ProgressContextValue {
  completedLessons: Set<string>;
  markLessonCompleted: (slug: string) => void;
  recordAttempt: (input: RecordAttemptInput) => void;
  isLessonUnlocked: (lesson: Lesson) => boolean;
  moduleProgress: (module: Module) => ProgressSummary;
  overallProgress: () => ProgressSummary;
  resetProgress: () => void;
}

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

    const recordAttempt = (input: RecordAttemptInput) => {
      void recordExerciseAttempt(input);
    };

    const isLessonUnlocked = (lesson: Lesson) => {
      const index = allLessons.findIndex((l) => l.slug === lesson.slug);
      if (index <= 0) return true; // primeira aula do MVP sempre liberada
      if (completedLessons.has(lesson.slug)) return true;
      const previous = allLessons[index - 1];
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
