"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgress } from "@/lib/learning/ProgressContext";
import type { Course } from "@/types/curriculum";

/**
 * Página `/aprender` — seletor de curso (multi-curso, ver DATABASE.md). A
 * trilha de aulas de cada curso propriamente dita fica em
 * `/aprender/[curso]` (`ModuleMap`, sem alterações).
 */
export function CourseSelector({ courses }: { courses: Course[] }) {
  const { courseProgress } = useProgress();

  return (
    <div className="space-y-4">
      {courses.map((course) => {
        const progress = courseProgress(course.slug);
        return (
          <Card key={course.slug}>
            <h2 className="mb-1 text-lg font-semibold">{course.title}</h2>
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">{course.description}</p>
            <ProgressBar
              percent={progress.percent}
              label={`${progress.completed} de ${progress.total} aulas`}
            />
            <Link
              href={`/aprender/${course.slug}`}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
            >
              Ver trilha
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
