/**
 * Popula o Supabase com os cursos e o conteúdo de todos os módulos, a
 * partir da mesma fonte que serve de fallback em
 * src/lib/exercises/content.ts (src/data/courses.ts, src/data/curriculum.ts
 * e src/data/curriculum-intermediario.ts) — para não ter o conteúdo das
 * aulas transcrito em dois lugares diferentes.
 *
 * Rodar depois de aplicar as migrações em supabase/migrations/ (incluindo
 * 0002_courses.sql, que adiciona a tabela `courses` e `modules.course_id`)
 * e de preencher .env.local:
 *
 *   npm run seed
 *
 * Idempotente: pode ser rodado de novo a qualquer momento (upsert em
 * courses/modules/lessons; concepts/exercises/hints da aula são recriados
 * do zero a cada rodada). Precisa de SUPABASE_SERVICE_ROLE_KEY — a chave
 * anônima não tem permissão de escrita nas tabelas de conteúdo (só
 * leitura, ver as políticas de RLS em 0001_init.sql e 0002_courses.sql).
 */
import { createClient } from "@supabase/supabase-js";
import { COURSES } from "../src/data/courses";
import { MODULES as MODULES_PYTHON_DO_ZERO } from "../src/data/curriculum";
import { MODULES as MODULES_PYTHON_INTERMEDIARIO } from "../src/data/curriculum-intermediario";

const ALL_MODULES = [...MODULES_PYTHON_DO_ZERO, ...MODULES_PYTHON_INTERMEDIARIO];

try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local ausente — segue com variáveis já exportadas no ambiente.
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local antes de rodar o seed.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

/** Curso de um módulo quando `courseSlug` vem ausente (curriculum.ts é anterior ao multi-curso). */
const DEFAULT_COURSE_SLUG = "python-do-zero";

async function main() {
  const courseIdBySlug = new Map<string, string>();
  for (const course of COURSES) {
    const { data: courseRow, error: courseError } = await supabase
      .from("courses")
      .upsert(
        { slug: course.slug, ordem: course.order, titulo: course.title, descricao: course.description },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (courseError) throw courseError;
    courseIdBySlug.set(course.slug, courseRow.id);
    console.log(`✓ Curso ${course.slug}`);
  }

  for (const curriculumModule of ALL_MODULES) {
    if (curriculumModule.lessons.length === 0) continue; // fora do MVP — sem aulas ainda

    const courseId = courseIdBySlug.get(curriculumModule.courseSlug ?? DEFAULT_COURSE_SLUG);
    if (!courseId) {
      throw new Error(
        `Curso "${curriculumModule.courseSlug ?? DEFAULT_COURSE_SLUG}" não está em src/data/courses.ts (módulo ${curriculumModule.slug}).`,
      );
    }

    const { data: moduleRow, error: moduleError } = await supabase
      .from("modules")
      .upsert(
        {
          slug: curriculumModule.slug,
          ordem: curriculumModule.order,
          titulo: curriculumModule.title,
          descricao: curriculumModule.description,
          course_id: courseId,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (moduleError) throw moduleError;

    for (const lesson of curriculumModule.lessons) {
      const conteudo = {
        objective: lesson.objective,
        estimatedMinutes: lesson.estimatedMinutes,
        difficulty: lesson.difficulty,
        concept: lesson.concept,
        example: lesson.example,
        miniProject: lesson.miniProject,
        summary: lesson.summary,
        nextLessonSlug: lesson.nextLessonSlug,
      };

      const { data: lessonRow, error: lessonError } = await supabase
        .from("lessons")
        .upsert(
          {
            module_id: moduleRow.id,
            slug: lesson.slug,
            ordem: lesson.order,
            titulo: lesson.title,
            conteudo_json: conteudo,
          },
          { onConflict: "slug" },
        )
        .select("id")
        .single();
      if (lessonError) throw lessonError;

      // Idempotente: remove o conceito antigo (em cascata, o exercício e
      // as dicas) antes de recriar, para poder rodar o seed várias vezes.
      const { error: deleteError } = await supabase
        .from("concepts")
        .delete()
        .eq("lesson_id", lessonRow.id);
      if (deleteError) throw deleteError;

      const { data: conceptRow, error: conceptError } = await supabase
        .from("concepts")
        .insert({ lesson_id: lessonRow.id, chave: lesson.challenge.concept })
        .select("id")
        .single();
      if (conceptError) throw conceptError;

      const challenge = lesson.challenge;
      const { data: exerciseRow, error: exerciseError } = await supabase
        .from("exercises")
        .insert({
          concept_id: conceptRow.id,
          kind: challenge.kind,
          titulo: challenge.title,
          dificuldade: challenge.difficulty,
          instrucao: challenge.instruction,
          starter_code: challenge.kind === "code" ? challenge.starterCode : "",
          expected_output: challenge.kind === "code" ? challenge.expectedOutput : [],
          correct_order: challenge.kind === "order" ? challenge.correctOrder : [],
        })
        .select("id")
        .single();
      if (exerciseError) throw exerciseError;

      const hintsPayload = challenge.hints.map((hint) => ({
        exercise_id: exerciseRow.id,
        ordem: hint.order,
        texto: hint.text,
      }));
      const { error: hintsError } = await supabase.from("hints").insert(hintsPayload);
      if (hintsError) throw hintsError;

      console.log(`  ✓ ${lesson.slug}`);
    }
    console.log(`✓ Módulo ${curriculumModule.slug}`);
  }

  console.log("\nSeed concluído.");
}

main().catch((err) => {
  console.error("Erro ao popular o Supabase:", err);
  process.exit(1);
});
