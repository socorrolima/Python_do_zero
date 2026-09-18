"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface OrderChallengeProps {
  correctOrder: string[];
  onCheck: (isCorrect: boolean) => void;
}

export function OrderChallenge({ correctOrder, onCheck }: OrderChallengeProps) {
  const [items, setItems] = useState(() => shuffle(correctOrder));

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  }

  function handleCheck() {
    const isCorrect = items.every((item, i) => item === correctOrder[i]);
    onCheck(isCorrect);
  }

  return (
    <div>
      <ol className="mb-3 space-y-2">
        {items.map((item, index) => (
          <li
            key={item}
            className="flex items-center justify-between rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm"
          >
            <span>
              {index + 1}. {item}
            </span>
            <span className="flex gap-1">
              <button
                type="button"
                aria-label={`Mover "${item}" para cima`}
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="rounded px-2 py-1 hover:bg-foreground/10 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                aria-label={`Mover "${item}" para baixo`}
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                className="rounded px-2 py-1 hover:bg-foreground/10 disabled:opacity-30"
              >
                ↓
              </button>
            </span>
          </li>
        ))}
      </ol>
      <Button onClick={handleCheck}>Verificar ordem</Button>
    </div>
  );
}
