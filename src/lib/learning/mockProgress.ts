/**
 * Progresso do aluno mockado em localStorage (Fase 3), exposto como um
 * "external store" (para uso com `useSyncExternalStore` em
 * ProgressContext.tsx) — evita `setState` dentro de `useEffect` e mantém
 * várias instâncias do contexto sincronizadas na mesma aba.
 *
 * A partir da Fase 4, isto é substituído por leitura/escrita nas tabelas
 * `student_progress` e `exercise_attempts` do Supabase — os nomes públicos
 * (`getSnapshot`, `subscribe`, `updateProgress`) foram pensados para que a
 * troca não exija mudar quem os consome.
 */

const STORAGE_KEY = "pdz_progress_v1";

export interface ProgressState {
  completedLessons: string[];
  hintsUsedByExercise: Record<string, number>;
}

const SERVER_SNAPSHOT: ProgressState = Object.freeze({
  completedLessons: [],
  hintsUsedByExercise: {},
});

function defaultProgress(): ProgressState {
  return { completedLessons: [], hintsUsedByExercise: {} };
}

function readFromStorage(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      hintsUsedByExercise:
        typeof parsed.hintsUsedByExercise === "object" && parsed.hintsUsedByExercise
          ? parsed.hintsUsedByExercise
          : {},
    };
  } catch {
    return defaultProgress();
  }
}

let cache: ProgressState | null = null;
const listeners = new Set<() => void>();

export function getSnapshot(): ProgressState {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  if (cache === null) cache = readFromStorage();
  return cache;
}

export function getServerSnapshot(): ProgressState {
  return SERVER_SNAPSHOT;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateProgress(
  updater: (prev: ProgressState) => ProgressState,
): void {
  const next = updater(getSnapshot());
  cache = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  listeners.forEach((listener) => listener());
}

export function resetProgress(): void {
  updateProgress(() => defaultProgress());
}
