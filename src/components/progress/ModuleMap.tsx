"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgress } from "@/lib/learning/ProgressContext";
import type { Module } from "@/types/curriculum";

export function ModuleMap({ modules }: { modules: Module[] }) {
  const { completedLessons, isLessonUnlocked, moduleProgress } = useProgress();

  return (
    <div className="space-y-4">
      {modules.map((module) => {
        const isImplemented = module.lessons.length > 0;
        const progress = moduleProgress(module);

        return (
          <Card key={module.slug}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">
                Módulo {module.order} — {module.title}
              </h2>
              {!isImplemented && <Badge tone="locked">Em breve</Badge>}
            </div>
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
              {module.description}
            </p>

            {isImplemented && (
              <>
                <ProgressBar percent={progress.percent} />
                <ul className="mt-3 space-y-1.5">
                  {module.lessons.map((lesson) => {
                    const completed = completedLessons.has(lesson.slug);
                    const unlocked = isLessonUnlocked(lesson);
                    return (
                      <li key={lesson.slug} className="flex items-center gap-2 text-sm">
                        {completed ? (
                          <Badge tone="success">✓</Badge>
                        ) : unlocked ? (
                          <Badge>→</Badge>
                        ) : (
                          <Badge tone="locked">🔒</Badge>
                        )}
                        {unlocked ? (
                          <Link href={`/aula/${lesson.slug}`} className="hover:underline">
                            {lesson.title}
                          </Link>
                        ) : (
                          <span className="text-foreground/40">{lesson.title}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}
