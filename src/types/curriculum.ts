// Tipos do currículo. Espelham (de forma simplificada) o modelo de dados
// definido para o Supabase (ver DATABASE.md) — nesta fase os dados vêm de
// src/data/curriculum.ts, não do banco.

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Hint {
  order: 1 | 2 | 3;
  text: string;
}

interface ExerciseBase {
  id: string;
  title: string;
  difficulty: Difficulty;
  concept: string;
  instruction: string;
  hints: Hint[];
}

/** Exercício de código (Módulo 2 em diante) — validado pelo mock runner de Python. */
export interface CodeExercise extends ExerciseBase {
  kind: "code";
  starterCode: string;
  /** Saídas esperadas, linha a linha (Fase 6 troca a validação por Pyodide real). */
  expectedOutput: string[];
}

/** Exercício de sequenciamento (Módulo 1 — pensamento computacional, sem código ainda). */
export interface OrderExercise extends ExerciseBase {
  kind: "order";
  /** Passos na ordem correta; a UI embaralha para o aluno reordenar. */
  correctOrder: string[];
}

export type Exercise = CodeExercise | OrderExercise;

export interface Lesson {
  slug: string;
  moduleSlug: string;
  order: number;
  title: string;
  objective: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  concept: string;
  example: {
    code: string;
    explanation: string;
  };
  challenge: Exercise;
  miniProject?: {
    title: string;
    description: string;
  };
  summary: string;
  nextLessonSlug: string | null;
}

export interface Module {
  slug: string;
  order: number;
  title: string;
  description: string;
  /** Módulos fora do MVP (3 a 12) ainda não têm aulas reais cadastradas. */
  lessons: Lesson[];
}
