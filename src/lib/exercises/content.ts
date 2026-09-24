import { createClient } from "@/lib/supabase/server";
import { MODULES as MOCK_MODULES } from "@/data/curriculum";
import { MODULES as MOCK_MODULES_INTERMEDIARIO } from "@/data/curriculum-intermediario";
import { COURSES as MOCK_COURSES } from "@/data/courses";
import type { Course, Difficulty, Exercise, Hint, Lesson, Module } from "@/types/curriculum";

/**
 * Camada que busca o currículo (cursos → módulos → aulas → conceitos →
 * exercícios → dicas) no Supabase e traduz para os mesmos tipos que os
 * componentes já usam (`@/types/curriculum`) — os componentes de UI não
 * sabem, e não precisam saber, se o conteúdo vem do banco ou de um mock
 * (item 21 do prompt mestre: conteúdo separado do código).
 *
 * Enquanto o projeto Supabase do usuário não tiver as tabelas populadas
 * (migração + seed — ver README.md), qualquer erro ou ausência de dados
 * cai de volta para o currículo mockado de `src/data/curriculum.ts` (curso
 * Python do Zero) e `src/data/curriculum-intermediario.ts` (curso Python
 * Intermediário), para que a ausência de configuração real não deixe o
 * site fora do ar.
 */

/** Curso ao qual módulo/aula pertence quando `courseSlug` vem ausente (conteúdo anterior ao multi-curso). */
const DEFAULT_COURSE_SLUG = "python-do-zero";

/** Garante `courseSlug` (em módulo e aulas) mesmo no currículo mockado mais antigo, que não o define. */
function withDefaultCourse(modules: Module[]): Module[] {
  return modules.map((m) => ({
    ...m,
    courseSlug: m.courseSlug ?? DEFAULT_COURSE_SLUG,
    lessons: m.lessons.map((l) => ({ ...l, courseSlug: l.courseSlug ?? DEFAULT_COURSE_SLUG })),
  }));
}

const MOCK_MODULES_ALL: Module[] = [...withDefaultCourse(MOCK_MODULES), ...MOCK_MODULES_INTERMEDIARIO];

interface HintRow {
  ordem: number;
  texto: string;
}

interface ExerciseRow {
  id: string;
  kind: "code" | "order";
  titulo: string;
  dificuldade: Difficulty;
  instrucao: string;
  starter_code: string;
  expected_output: string[];
  correct_order: string[];
  hints: HintRow[];
}

interface ConceptRow {
  id: string;
  chave: string;
  exercises: ExerciseRow[];
}

interface LessonConteudo {
  objective: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  concept: string;
  example: { code: string; explanation: string };
  miniProject?: { title: string; description: string };
  summary: string;
  nextLessonSlug: string | null;
}

interface LessonRow {
  id: string;
  ordem: number;
  slug: string;
  titulo: string;
  conteudo_json: LessonConteudo;
  concepts: ConceptRow[];
}

interface CourseRelation {
  slug: string;
}

interface ModuleRow {
  id: string;
  ordem: number;
  slug: string;
  titulo: string;
  descricao: string;
  /** Relação `modules.course_id -> courses.id`; o cliente Supabase pode devolver objeto único ou array de 1. */
  courses: CourseRelation | CourseRelation[] | null;
  lessons: LessonRow[];
}

interface CourseRow {
  ordem: number;
  slug: string;
  titulo: string;
  descricao: string;
}

function mapCourse(row: CourseRow): Course {
  return { slug: row.slug, order: row.ordem, title: row.titulo, description: row.descricao };
}

function mapHint(row: HintRow): Hint {
  return { order: row.ordem as Hint["order"], text: row.texto };
}

function mapExercise(row: ExerciseRow, conceptChave: string, conceptId: string): Exercise {
  const base = {
    id: row.id,
    title: row.titulo,
    difficulty: row.dificuldade,
    concept: conceptChave,
    conceptId,
    instruction: row.instrucao,
    hints: [...row.hints].sort((a, b) => a.ordem - b.ordem).map(mapHint),
  };

  if (row.kind === "code") {
    return { ...base, kind: "code", starterCode: row.starter_code, expectedOutput: row.expected_output };
  }
  return { ...base, kind: "order", correctOrder: row.correct_order };
}

/** Uma aula sem conceito/exercício cadastrado ainda não está pronta para exibir. */
function mapLesson(row: LessonRow, moduleSlug: string, courseSlug: string): Lesson | null {
  const concept = row.concepts[0];
  const exerciseRow = concept?.exercises[0];
  if (!concept || !exerciseRow) return null;

  const conteudo = row.conteudo_json;
  return {
    id: row.id,
    slug: row.slug,
    moduleSlug,
    courseSlug,
    order: row.ordem,
    title: row.titulo,
    objective: conteudo.objective,
    estimatedMinutes: conteudo.estimatedMinutes,
    difficulty: conteudo.difficulty,
    concept: conteudo.concept,
    example: conteudo.example,
    challenge: mapExercise(exerciseRow, concept.chave, concept.id),
    miniProject: conteudo.miniProject,
    summary: conteudo.summary,
    nextLessonSlug: conteudo.nextLessonSlug,
  };
}

function mapModule(row: ModuleRow): Module {
  const courseRelation = Array.isArray(row.courses) ? row.courses[0] : row.courses;
  const courseSlug = courseRelation?.slug ?? DEFAULT_COURSE_SLUG;

  const lessons = [...row.lessons]
    .sort((a, b) => a.ordem - b.ordem)
    .map((lessonRow) => mapLesson(lessonRow, row.slug, courseSlug))
    .filter((lesson): lesson is Lesson => lesson !== null);

  return {
    slug: row.slug,
    order: row.ordem,
    title: row.titulo,
    description: row.descricao,
    lessons,
    courseSlug,
  };
}

let warnedFallback = false;
function warnFallback(reason: string, err?: unknown) {
  if (warnedFallback) return;
  warnedFallback = true;
  console.warn(
    `[content] ${reason} — usando o currículo mockado de src/data/curriculum.ts / ` +
      "src/data/curriculum-intermediario.ts. Configure .env.local, rode as migrações " +
      "(supabase/migrations/) e o seed (npm run seed) para usar dados reais.",
    err ?? "",
  );
}

let cachedModules: Module[] | null = null;

/**
 * Busca todos os módulos de todos os cursos (com aulas, exercícios e
 * dicas) do Supabase. Cacheia em memória durante o tempo de vida do
 * processo do servidor — conteúdo pedagógico muda raramente, e uma futura
 * área administrativa (item 22) pode invalidar esse cache quando existir.
 */
async function loadAllModules(): Promise<Module[]> {
  if (cachedModules) return cachedModules;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("modules")
      .select(
        "id, ordem, slug, titulo, descricao, courses(slug), lessons(id, ordem, slug, titulo, conteudo_json, concepts(id, chave, exercises(id, kind, titulo, dificuldade, instrucao, starter_code, expected_output, correct_order, hints(ordem, texto))))",
      );

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error("Nenhum módulo cadastrado no Supabase ainda (rode o seed).");
    }

    const modules = (data as unknown as ModuleRow[])
      .slice()
      .sort((a, b) => a.ordem - b.ordem)
      .map(mapModule);

    cachedModules = modules;
    return modules;
  } catch (err) {
    warnFallback("Não foi possível carregar o currículo do Supabase", err);
    return MOCK_MODULES_ALL;
  }
}

/**
 * Módulos de todos os cursos, ou só de um curso quando `courseSlug` é
 * informado (ex.: a trilha em `/aprender/[curso]`). Sempre a partir do
 * mesmo cache de `loadAllModules` — filtrar em memória é suficiente para
 * o volume de conteúdo desta plataforma.
 */
export async function getModules(courseSlug?: string): Promise<Module[]> {
  const modules = await loadAllModules();
  return courseSlug ? modules.filter((m) => m.courseSlug === courseSlug) : modules;
}

let cachedCourses: Course[] | null = null;

/** Busca os cursos da plataforma (tabela `courses`), ordenados por `ordem`. */
export async function getCourses(): Promise<Course[]> {
  if (cachedCourses) return cachedCourses;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("ordem, slug, titulo, descricao")
      .order("ordem");

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error("Nenhum curso cadastrado no Supabase ainda (rode o seed).");
    }

    const courses = (data as CourseRow[]).map(mapCourse);
    cachedCourses = courses;
    return courses;
  } catch (err) {
    warnFallback("Não foi possível carregar os cursos do Supabase", err);
    return MOCK_COURSES;
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const courses = await getCourses();
  return courses.find((c) => c.slug === slug);
}

export async function getModuleBySlug(slug: string): Promise<Module | undefined> {
  const modules = await getModules();
  return modules.find((m) => m.slug === slug);
}

export async function getLessonBySlug(
  slug: string,
): Promise<{ module: Module; lesson: Lesson } | undefined> {
  const modules = await getModules();
  for (const currentModule of modules) {
    const lesson = currentModule.lessons.find((l) => l.slug === slug);
    if (lesson) return { module: currentModule, lesson };
  }
  return undefined;
}

export async function getAllLessonsInOrder(): Promise<Lesson[]> {
  const modules = await getModules();
  return modules.flatMap((m) => m.lessons);
}
