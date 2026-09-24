"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgress } from "@/lib/learning/ProgressContext";
import type { Course, Module } from "@/types/curriculum";

/** Curso de um módulo quando `courseSlug` vem ausente (conteúdo anterior ao multi-curso). */
const DEFAULT_COURSE_SLUG = "python-do-zero";

export function DashboardSummary({ courses, modules }: { courses: Course[]; modules: Module[] }) {
  const { overallProgress, moduleProgress, courseProgress, completedLessons, resetProgress } = useProgress();
  const overall = overallProgress();

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-2 text-lg font-semibold">Progresso geral</h2>
        <ProgressBar percent={overall.percent} label={`${overall.completed} de ${overall.total} aulas em todos os cursos`} />
      </Card>

      {courses.map((course) => {
        // "Módulo atual" e "Continuar" são calculados por curso — misturar
        // os módulos de dois cursos numa única conta faria o botão
        // "Continuar" pular entre cursos diferentes sem aviso.
        const courseModules = modules.filter(
          (m) => (m.courseSlug ?? DEFAULT_COURSE_SLUG) === course.slug,
        );
        const progress = courseProgress(course.slug);
        const currentModule =
          courseModules.find((m) => m.lessons.length > 0 && moduleProgress(m).percent < 100) ??
          courseModules.find((m) => m.lessons.length > 0);
        const nextLesson = currentModule?.lessons.find((l) => !completedLessons.has(l.slug));

        return (
          <Card key={course.slug}>
            <h2 className="mb-1 text-lg font-semibold">{course.title}</h2>
            <ProgressBar percent={progress.percent} label={`${progress.completed} de ${progress.total} aulas`} />

            {currentModule && (
              <div className="mt-4">
                <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
                  Módulo atual: {currentModule.title}
                </p>
                {nextLesson ? (
                  <Link
                    href={`/aula/${nextLesson.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
                  >
                    Continuar
                  </Link>
                ) : (
                  <p className="text-sm text-slate-500">Módulo concluído — parabéns!</p>
                )}
              </div>
            )}
          </Card>
        );
      })}

      <Card>
        <h2 className="mb-2 text-lg font-semibold">Aulas concluídas</h2>
        {completedLessons.size === 0 ? (
          <p className="text-sm text-slate-500">Você ainda não concluiu nenhuma aula.</p>
        ) : (
          <ul className="list-inside list-disc text-sm">
            {modules
              .flatMap((m) => m.lessons)
              .filter((l) => completedLessons.has(l.slug))
              .map((l) => (
                <li key={l.slug}>{l.title}</li>
              ))}
          </ul>
        )}
      </Card>

      <button
        type="button"
        onClick={() => {
          if (window.confirm("Isso apaga todo o seu progresso salvo (aulas, tentativas e domínio de conceitos). Continuar?")) {
            resetProgress();
          }
        }}
        className="text-xs text-slate-400 underline hover:text-slate-600"
      >
        Reiniciar progresso (apaga de verdade — use só para testar)
      </button>
    </div>
  );
}
