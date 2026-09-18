"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor/CodeEditor";
import { useProgress } from "@/lib/learning/ProgressContext";
import { matchesExpectedOutput } from "@/lib/python/mockRunner";
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
  const { recordHintUsed, hintsUsedFor } = useProgress();
  const [correct, setCorrect] = useState<boolean | null>(null);

  function handleAttempt(isCorrect: boolean) {
    setCorrect(isCorrect);
    if (isCorrect) onSolved?.();
  }

  const recommendation = correct === null
    ? undefined
    : recommendFromSingleAttempt({
        concept: exercise.concept,
        difficulty: exercise.difficulty,
        correct,
        hintsUsed: hintsUsedFor(exercise.id),
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
        <HintPanel
          hints={exercise.hints}
          onHintRevealed={() => recordHintUsed(exercise.id)}
        />
      )}
    </div>
  );
}
