import { createClient } from "@/lib/supabase/server";

/**
 * Progresso inicial do aluno, buscado no servidor (junto com o currículo,
 * em `(app)/layout.tsx`) para já vir pronto na primeira renderização, sem
 * um "flash" de progresso vazio. Fase 7 troca o `localStorage` da Fase 3
 * por `student_progress` de verdade — RLS garante que cada aluno só lê o
 * próprio progresso.
 *
 * Sem sessão (usuário não logado — não deveria acontecer nestas rotas,
 * já protegidas por `src/proxy.ts`) ou sem Supabase configurado, devolve
 * progresso vazio em vez de derrubar a página.
 */
export interface InitialProgress {
  completedLessonSlugs: string[];
}

interface StudentProgressRow {
  lessons: { slug: string } | { slug: string }[] | null;
}

export async function getInitialProgress(): Promise<InitialProgress> {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return { completedLessonSlugs: [] };

    const { data, error } = await supabase
      .from("student_progress")
      .select("lessons(slug)")
      .eq("profile_id", user.id)
      .eq("status", "concluido");

    if (error) throw error;

    const slugs = ((data ?? []) as StudentProgressRow[])
      .map((row) => (Array.isArray(row.lessons) ? row.lessons[0] : row.lessons))
      .map((lesson) => lesson?.slug)
      .filter((slug): slug is string => Boolean(slug));

    return { completedLessonSlugs: slugs };
  } catch (err) {
    console.warn(
      "[progress] Não foi possível carregar o progresso do Supabase — começando vazio nesta sessão.",
      err,
    );
    return { completedLessonSlugs: [] };
  }
}
