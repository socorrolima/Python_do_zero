"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CodeEditor } from "@/components/code-editor/CodeEditor";
import { ExercisePrompt } from "@/components/exercise/ExercisePrompt";
import { useProgress } from "@/lib/learning/ProgressContext";
import type { Lesson } from "@/types/curriculum";

const DIFFICULTY_LABEL: Record<number, string> = {
  1: "Muito fácil",
  2: "Fácil",
  3: "Intermediário",
  4: "Desafiador",
  5: "Projeto",
};

export function LessonLayout({ lesson }: { lesson: Lesson }) {
  const { markLessonCompleted, completedLessons } = useProgress();
  const router = useRouter();
  const [solved, setSolved] = useState(completedLessons.has(lesson.slug));

  function handleFinish() {
    markLessonCompleted(lesson.slug);
    router.push(lesson.nextLessonSlug ? `/aula/${lesson.nextLessonSlug}` : "/aprender");
  }

  return (
    <div className="space-y-8">
      <header>
        <div className="mb-2 flex items-center gap-2">
          <Badge>{lesson.estimatedMinutes} min</Badge>
          <Badge>{DIFFICULTY_LABEL[lesson.difficulty]}</Badge>
        </div>
        <h1 className="text-2xl font-semibold">{lesson.title}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{lesson.objective}</p>
      </header>

      <Card>
        <h2 className="mb-2 text-lg font-semibold">Conceito</h2>
        <p>{lesson.concept}</p>
      </Card>

      <Card>
        <h2 className="mb-2 text-lg font-semibold">Exemplo</h2>
        <pre className="overflow-x-auto rounded-lg bg-foreground/5 p-3 font-mono text-sm">
          {lesson.example.code}
        </pre>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {lesson.example.explanation}
        </p>
      </Card>

      {lesson.challenge.kind === "code" && (
        <Card>
          <h2 className="mb-2 text-lg font-semibold">Experimente</h2>
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
            Altere o código do exemplo e execute — mudar e testar é a melhor forma de aprender.
          </p>
          <CodeEditor starterCode={lesson.example.code} />
        </Card>
      )}

      <Card>
        <h2 className="mb-2 text-lg font-semibold">Exercício guiado</h2>
        <ExercisePrompt exercise={lesson.challenge} onSolved={() => setSolved(true)} />
      </Card>

      {solved && lesson.miniProject && (
        <Card>
          <h2 className="mb-2 text-lg font-semibold">Mini-projeto: {lesson.miniProject.title}</h2>
          <p>{lesson.miniProject.description}</p>
        </Card>
      )}

      {solved && (
        <Card>
          <h2 className="mb-2 text-lg font-semibold">Resumo</h2>
          <p className="mb-4">{lesson.summary}</p>
          <Button onClick={handleFinish}>
            {lesson.nextLessonSlug ? "Concluir aula e ir para a próxima" : "Concluir aula"}
          </Button>
        </Card>
      )}
    </div>
  );
}
