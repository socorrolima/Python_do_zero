import { createClient } from "@/lib/supabase/client";

/**
 * Escritas de progresso no Supabase, chamadas do navegador
 * (`ProgressContext.tsx`). Cada função busca o usuário logado via cookie
 * de sessão e grava só o que é dele — RLS garante isso mesmo se algo
 * aqui estiver errado.
 *
 * Tudo aqui é "melhor esforço": se a escrita falhar (rede, RLS, ou o
 * currículo ainda estar no fallback mockado — cujos ids não são uuids
 * reais do Supabase), a função avisa no console e retorna, em vez de
 * lançar um erro que travaria a interface. A Fase 8 (sistema adaptativo)
 * lê o que ficou gravado aqui em `exercise_attempts`/`concept_mastery`.
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
  conceptId: string;
  correct: boolean;
  hintsUsed: number;
}

/**
 * Regra de domínio de conceito da Fase 7: simples e explícita de
 * propósito — só o suficiente para `concept_mastery` ter dados reais.
 * A Fase 8 (`AdaptiveLearningService` completo) é o lugar certo para
 * refinar isso com histórico, tempo e o passo `recommendFromHistory` já
 * preparado em `AdaptiveLearningService.ts`.
 */
function nextMasteryLevel(current: number, correct: boolean, hintsUsed: number): number {
  const delta = correct ? (hintsUsed > 0 ? 10 : 20) : -10;
  return Math.max(0, Math.min(100, current + delta));
}

export async function recordExerciseAttempt(params: RecordAttemptParams): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const supabase = createClient();
  const { error: attemptError } = await supabase.from("exercise_attempts").insert({
    profile_id: userId,
    exercise_id: params.exerciseId,
    acertou: params.correct,
    dicas_usadas: params.hintsUsed,
  });

  if (attemptError) {
    console.warn("[progress] Não foi possível registrar a tentativa no Supabase.", attemptError);
    return;
  }

  const { data: existing, error: readError } = await supabase
    .from("concept_mastery")
    .select("nivel_dominio")
    .eq("profile_id", userId)
    .eq("concept_id", params.conceptId)
    .maybeSingle();

  if (readError) {
    console.warn("[progress] Não foi possível ler o domínio atual do conceito.", readError);
    return;
  }

  const nivel = nextMasteryLevel(existing?.nivel_dominio ?? 0, params.correct, params.hintsUsed);

  const { error: masteryError } = await supabase.from("concept_mastery").upsert(
    {
      profile_id: userId,
      concept_id: params.conceptId,
      nivel_dominio: nivel,
      ultima_revisao: new Date().toISOString(),
    },
    { onConflict: "profile_id,concept_id" },
  );

  if (masteryError) {
    console.warn("[progress] Não foi possível atualizar o domínio do conceito no Supabase.", masteryError);
  }
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
