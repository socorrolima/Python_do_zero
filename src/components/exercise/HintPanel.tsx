"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Hint } from "@/types/curriculum";

interface HintPanelProps {
  hints: Hint[];
  onHintRevealed?: () => void;
}

export function HintPanel({ hints, onHintRevealed }: HintPanelProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const sorted = [...hints].sort((a, b) => a.order - b.order);
  const nextHint = sorted[revealedCount];

  return (
    <div className="rounded-lg border border-foreground/10 p-4">
      <p className="mb-2 text-sm font-medium">Dicas</p>
      <ul className="mb-2 space-y-2">
        {sorted.slice(0, revealedCount).map((hint) => (
          <li key={hint.order} className="text-sm text-slate-600 dark:text-slate-300">
            💡 Dica {hint.order}: {hint.text}
          </li>
        ))}
      </ul>
      {nextHint ? (
        <Button
          variant="secondary"
          onClick={() => {
            setRevealedCount((c) => c + 1);
            onHintRevealed?.();
          }}
        >
          Ver dica {nextHint.order}
        </Button>
      ) : (
        <p className="text-sm text-slate-500">Você já viu todas as dicas deste desafio.</p>
      )}
    </div>
  );
}
