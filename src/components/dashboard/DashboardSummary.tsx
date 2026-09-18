"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgress } from "@/lib/learning/ProgressContext";
import { MODULES } from "@/data/curriculum";

export function DashboardSummary() {
  const { overallProgress, moduleProgress, completedLessons, resetProgress } = useProgress();
  const overall = overallProgress();

  const currentModule =
    MODULES.find((m) => m.lessons.length > 0 && moduleProgress(m).percent < 100) ??
    MODULES.find((m) => m.lessons.length > 0);

  const nextLesson = currentModule?.lessons.find((l) => !completedLessons.has(l.slug));

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-2 text-lg font-semibold">Seu progresso</h2>
        <ProgressBar percent={overall.percent} label={`${overall.completed} de ${overall.total} aulas do MVP`} />
      </Card>

      {currentModule && (
        <Card>
          <h2 className="mb-1 text-lg font-semibold">Módulo atual</h2>
          <p className="mb-3 text-slate-600 dark:text-slate-300">{currentModule.title}</p>
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
        </Card>
      )}

      <Card>
        <h2 className="mb-2 text-lg font-semibold">Aulas concluídas</h2>
        {completedLessons.size === 0 ? (
          <p className="text-sm text-slate-500">Você ainda não concluiu nenhuma aula.</p>
        ) : (
          <ul className="list-inside list-disc text-sm">
            {MODULES.flatMap((m) => m.lessons)
              .filter((l) => completedLessons.has(l.slug))
              .map((l) => (
                <li key={l.slug}>{l.title}</li>
              ))}
          </ul>
        )}
      </Card>

      <button
        type="button"
        onClick={resetProgress}
        className="text-xs text-slate-400 underline hover:text-slate-600"
      >
        Reiniciar progresso (apenas para teste — some com a Fase 4)
      </button>
    </div>
  );
}
