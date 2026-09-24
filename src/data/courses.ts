import type { Course } from "@/types/curriculum";

/**
 * Fonte única dos metadados de cada curso da plataforma (tabela `courses`
 * no Supabase — ver `supabase/migrations/0002_courses.sql` e DATABASE.md).
 *
 * `scripts/seed.ts` lê este arquivo para popular a tabela `courses`, e
 * `src/lib/exercises/content.ts` cai de volta para ele se o Supabase ainda
 * não tiver sido configurado/migrado — o mesmo padrão já usado para o
 * currículo em `src/data/curriculum.ts`.
 */
export const COURSES: Course[] = [
  {
    slug: "python-do-zero",
    order: 1,
    title: "Python do Zero",
    description:
      "Do pensamento computacional ao seu primeiro projeto completo em Python — para quem nunca programou.",
  },
  {
    slug: "python-intermediario",
    order: 2,
    title: "Python Intermediário",
    description:
      "Para quem já concluiu o Python do Zero: organizar projetos, tratar erros, consumir APIs e conectar Python a banco de dados.",
  },
];

export function getCourseBySlugSync(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}
