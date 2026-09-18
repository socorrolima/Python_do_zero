import { createClient } from "@/lib/supabase/client";
import type { Difficulty } from "@/types/curriculum";
import { recommendFromHistory, type AdaptiveRecommendation } from "./AdaptiveLearningService";

/**
 * Escritas de progresso no Supabase, chamadas do navegador
 * (`ProgressContext.tsx`). Cada função busca o usuário logado via cookie
 * de sessão e grava só o que é dele — RLS garante isso mesmo se algo
 * aqui estiver errado.
 *
 * Tudo aqui é "melhor esforço": se a escrita falhar (rede, RLS, ou o
 * currículo ainda estar no fallback mockado — cujos ids não são uuids
 * reais do Supabase), a função avisa no console e retorna, em vez de
 * lançar um erro que travaria a interface. `ExercisePrompt` cai de volta
 * para `recommendFromSingleAttempt` quando isso acontece.
 */

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function upsertLessonCompleted(lessonId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const supabase = createClient();
  const { error } = await supabase.from("student_progress").upsert(
    {
      profile_id: userId,
      lesson_id: lessonId,
      status: "concluido",
      percentual: 100,
      atualizado_em: new Date().toISOString(),
    },
    { onConflict: "profile_id,lesson_id" },
  );

  if (error) {
    console.warn("[progress] Não foi possível salvar a conclusão da aula no Supabase.", error);
  }
}

interface RecordAttemptParams {
  exerciseId: string;
  /** Chave legível do conceito (ex.: "print") — só para exibição na recomendação. */
  concept: string;
  /** id do registro em `concepts` no Supabase — chave real usada nas consultas. */
  conceptId: string;
  difficulty: Difficulty;
  correct: boolean;
  hintsUsed: number;
}

/** Quantas tentativas recentes daquele conceito entram na recomendação (ver ARCHITECTURE.md). */
const HISTORY_WINDOW = 5;

interface AttemptHistoryRow {
  acertou: boolean;
}

/**
 * Grava a tentativa em `exercise_attempts`, busca as últimas tentativas
 * do aluno para aquele conceito e usa `AdaptiveLearningService` (regra de
 * 85%/60% do item 8 do prompt mestre) para decidir avançar, manter ou
 * revisar — e para atualizar `concept_mastery` com a taxa de acerto real,
 * não mais um contador ad-hoc.
 *
 * Devolve `undefined` quando não há como calcular (sem sessão, escrita
 * falhou, ou histórico ilegível) — `ExercisePrompt` sabe cair de volta
 * para `recommendFromSingleAttempt` nesse caso.
 */
export async function recordExerciseAttempt(
  params: RecordAttemptParams,
): Promise<AdaptiveRecommendation | undefined> {
  const userId = await getCurrentUserId();
  if (!userId) return undefined;

  const supabase = createClient();
  const { error: attemptError } = await supabase.from("exercise_attempts").insert({
    profile_id: userId,
    exercise_id: params.exerciseId,
    acertou: params.correct,
    dicas_usadas: params.hintsUsed,
  });

  if (attemptError) {
    console.warn("[progress] Não foi possível registrar a tentativa no Supabase.", attemptError);
    return undefined;
  }

  // Junção com `exercises` para filtrar por concept_id: todas as
  // tentativas do aluno em qualquer exercício daquele conceito, não só
  // deste exercício específico.
  const { data: historyRows, error: historyError } = await supabase
    .from("exercise_attempts")
    .select("acertou, exercises!inner(concept_id)")
    .eq("profile_id", userId)
    .eq("exercises.concept_id", params.conceptId)
    .order("criado_em", { ascending: false })
    .limit(HISTORY_WINDOW);

  if (historyError) {
    console.warn("[progress] Não foi possível ler o histórico de tentativas.", historyError);
    return undefined;
  }

  const attempts = ((historyRows ?? []) as AttemptHistoryRow[]).map((row) => ({
    correct: row.acertou,
  }));
  const recommendation = recommendFromHistory(params.concept, params.difficulty, attempts);
  const accuracy = attempts.filter((a) => a.correct).length / attempts.length;

  const { error: masteryError } = await supabase.from("concept_mastery").upsert(
    {
      profile_id: userId,
      concept_id: params.conceptId,
      nivel_dominio: Math.round(accuracy * 100),
      ultima_revisao: new Date().toISOString(),
    },
    { onConflict: "profile_id,concept_id" },
  );

  if (masteryError) {
    console.warn("[progress] Não foi possível atualizar o domínio do conceito no Supabase.", masteryError);
  }

  return recommendation;
}

/** Apaga todo o progresso do aluno logado — usado pelo botão de teste em "Meu progresso". */
export async function resetAllProgress(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const supabase = createClient();
  const results = await Promise.all([
    supabase.from("student_progress").delete().eq("profile_id", userId),
    supabase.from("exercise_attempts").delete().eq("profile_id", userId),
    supabase.from("concept_mastery").delete().eq("profile_id", userId),
  ]);

  for (const { error } of results) {
    if (error) console.warn("[progress] Erro ao reiniciar progresso no Supabase.", error);
  }
}
