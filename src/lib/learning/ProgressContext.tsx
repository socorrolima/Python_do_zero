"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { getAllLessonsInOrder } from "@/data/curriculum";
import type { Lesson, Module } from "@/types/curriculum";
import {
  getSnapshot,
  getServerSnapshot,
  subscribe,
  updateProgress,
  resetProgress as resetStoredProgress,
} from "./mockProgress";

interface ProgressSummary {
  completed: number;
  total: number;
  percent: number;
}

interface ProgressContextValue {
  completedLessons: Set<string>;
  markLessonCompleted: (slug: string) => void;
  recordHintUsed: (exerciseId: string) => void;
  hintsUsedFor: (exerciseId: string) => number;
  isLessonUnlocked: (lesson: Lesson) => boolean;
  moduleProgress: (module: Module) => ProgressSummary;
  overallProgress: () => ProgressSummary;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const allLessons = useMemo(() => getAllLessonsInOrder(), []);

  const value = useMemo<ProgressContextValue>(() => {
    const completedLessons = new Set(state.completedLessons);

    const markLessonCompleted = (slug: string) => {
      updateProgress((prev) =>
        prev.completedLessons.includes(slug)
          ? prev
          : { ...prev, completedLessons: [...prev.completedLessons, slug] },
      );
    };

    const recordHintUsed = (exerciseId: string) => {
      updateProgress((prev) => ({
        ...prev,
        hintsUsedByExercise: {
          ...prev.hintsUsedByExercise,
          [exerciseId]: (prev.hintsUsedByExercise[exerciseId] ?? 0) + 1,
        },
      }));
    };

    const hintsUsedFor = (exerciseId: string) => state.hintsUsedByExercise[exerciseId] ?? 0;

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

    return {
      completedLessons,
      markLessonCompleted,
      recordHintUsed,
      hintsUsedFor,
      isLessonUnlocked,
      moduleProgress,
      overallProgress,
      resetProgress: resetStoredProgress,
    };
  }, [state, allLessons]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress precisa ser usado dentro de <ProgressProvider>.");
  }
  return ctx;
}
