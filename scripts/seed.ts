/**
 * Popula o Supabase com o conteúdo dos Módulos 1 e 2, a partir da mesma
 * fonte que serve de fallback em src/lib/exercises/content.ts
 * (src/data/curriculum.ts) — para não ter o conteúdo das aulas
 * transcrito em dois lugares diferentes.
 *
 * Rodar depois de aplicar supabase/migrations/0001_init.sql e de
 * preencher .env.local:
 *
 *   npm run seed
 *
 * Idempotente: pode ser rodado de novo a qualquer momento (upsert em
 * modules/lessons; concepts/exercises/hints da aula são recriados do
 * zero a cada rodada). Precisa de SUPABASE_SERVICE_ROLE_KEY — a chave
 * anônima não tem permissão de escrita nas tabelas de conteúdo (só
 * leitura, ver as políticas de RLS em 0001_init.sql).
 */
import { createClient } from "@supabase/supabase-js";
import { MODULES } from "../src/data/curriculum";

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

async function main() {
  for (const curriculumModule of MODULES) {
    if (curriculumModule.lessons.length === 0) continue; // fora do MVP — sem aulas ainda

    const { data: moduleRow, error: moduleError } = await supabase
      .from("modules")
      .upsert(
        {
          slug: curriculumModule.slug,
          ordem: curriculumModule.order,
          titulo: curriculumModule.title,
          descricao: curriculumModule.description,
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
