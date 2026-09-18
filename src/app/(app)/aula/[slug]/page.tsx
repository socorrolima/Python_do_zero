import { notFound } from "next/navigation";
import { LessonLayout } from "@/components/lesson/LessonLayout";
import { getLessonBySlug } from "@/lib/exercises/content";

// Sem generateStaticParams: o conteúdo agora vem do Supabase (Fase 5) e
// pode mudar sem novo build assim que a área administrativa (item 22)
// existir; a rota já é renderizada dinamicamente e fica atrás do login
// (ver PROTECTED_PREFIXES em src/proxy.ts), então gerar estático aqui não
// traria ganho real.
export default async function AulaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getLessonBySlug(slug);

  if (!found) notFound();

  return <LessonLayout lesson={found.lesson} />;
}
