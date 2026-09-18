"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor/CodeEditor";
import { useProgress } from "@/lib/learning/ProgressContext";
import { matchesExpectedOutput } from "@/lib/python/pyodideRunner";
import { recommendFromSingleAttempt } from "@/lib/learning/AdaptiveLearningService";
import type { Exercise } from "@/types/curriculum";
import { HintPanel } from "./HintPanel";
import { FeedbackCard } from "./FeedbackCard";
import { OrderChallenge } from "./OrderChallenge";

interface ExercisePromptProps {
  exercise: Exercise;
  onSolved?: () => void;
}

export function ExercisePrompt({ exercise, onSolved }: ExercisePromptProps) {
  const { recordAttempt } = useProgress();
  const [correct, setCorrect] = useState<boolean | null>(null);
  // Dicas vistas desde a última tentativa deste exercício — vai junto com
  // a tentativa gravada em `exercise_attempts` (Fase 7), não é um estado
  // global: cada submissão registra quantas dicas levaram até ali.
  const [hintsUsed, setHintsUsed] = useState(0);

  function handleAttempt(isCorrect: boolean) {
    setCorrect(isCorrect);
    recordAttempt({
      exerciseId: exercise.id,
      conceptId: exercise.conceptId,
      correct: isCorrect,
      hintsUsed,
    });
    if (isCorrect) onSolved?.();
  }

  const recommendation = correct === null
    ? undefined
    : recommendFromSingleAttempt({
        concept: exercise.concept,
        difficulty: exercise.difficulty,
        correct,
        hintsUsed,
      });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-500">Desafio</p>
        <p>{exercise.instruction}</p>
      </div>

      {exercise.kind === "code" ? (
        <CodeEditor
          starterCode={exercise.starterCode}
          onResult={(result) => {
            if (result.error) {
              handleAttempt(false);
              return;
            }
            handleAttempt(matchesExpectedOutput(result.output, exercise.expectedOutput));
          }}
        />
      ) : (
        <OrderChallenge correctOrder={exercise.correctOrder} onCheck={handleAttempt} />
      )}

      {correct !== null && <FeedbackCard correct={correct} recommendation={recommendation} />}

      {correct !== true && (
        <HintPanel hints={exercise.hints} onHintRevealed={() => setHintsUsed((n) => n + 1)} />
      )}
    </div>
  );
}
