import { notFound } from "next/navigation";
import { ModuleMap } from "@/components/progress/ModuleMap";
import { getCourseBySlug, getModules } from "@/lib/exercises/content";

/**
 * Trilha de aprendizagem de um curso específico (multi-curso — ver
 * DATABASE.md). Antes desta rota existir, `/aprender` mostrava a trilha
 * diretamente; agora `/aprender` virou o seletor de curso
 * (`CourseSelector`) e esta página, movida para cá, é a mesma trilha de
 * sempre — só filtrada para o curso do `[curso]` da URL.
 */
export default async function TrilhaDoCursoPage({
  params,
}: {
  params: Promise<{ curso: string }>;
}) {
  const { curso } = await params;
  const course = await getCourseBySlug(curso);
  if (!course) notFound();

  const modules = await getModules(curso);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold">{course.title}</h1>
      <p className="mb-6 text-slate-600 dark:text-slate-300">{course.description}</p>
      <ModuleMap modules={modules} />
    </div>
  );
}
