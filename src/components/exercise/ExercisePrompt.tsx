"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor/CodeEditor";
import { useProgress } from "@/lib/learning/ProgressContext";
import { matchesExpectedOutput } from "@/lib/python/pyodideRunner";
import {
  recommendFromSingleAttempt,
  type AdaptiveRecommendation,
} from "@/lib/learning/AdaptiveLearningService";
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
  const [recommendation, setRecommendation] = useState<AdaptiveRecommendation | undefined>();
  // Dicas vistas desde a última tentativa deste exercício — vai junto com
  // a tentativa gravada em `exercise_attempts` (Fase 7), não é um estado
  // global: cada submissão registra quantas dicas levaram até ali.
  const [hintsUsed, setHintsUsed] = useState(0);

  async function handleAttempt(isCorrect: boolean) {
    setCorrect(isCorrect);
    setRecommendation(undefined); // aparece de novo assim que o histórico (Fase 8) responder

    const historyBased = await recordAttempt({
      exerciseId: exercise.id,
      concept: exercise.concept,
      conceptId: exercise.conceptId,
      difficulty: exercise.difficulty,
      correct: isCorrect,
      hintsUsed,
    });

    // Sem histórico disponível (sem sessão, escrita falhou, ou currículo
    // ainda no fallback mockado) — degrada para o sinal de uma tentativa
    // só, em vez de não dar feedback nenhum.
    setRecommendation(
      historyBased ??
        recommendFromSingleAttempt({
          concept: exercise.concept,
          difficulty: exercise.difficulty,
          correct: isCorrect,
          hintsUsed,
        }),
    );

    if (isCorrect) onSolved?.();
  }

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
              void handleAttempt(false);
              return;
            }
            void handleAttempt(matchesExpectedOutput(result.output, exercise.expectedOutput));
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
