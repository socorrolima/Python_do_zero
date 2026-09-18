import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HintPanel } from "./HintPanel";

const hints = [
  { order: 1 as const, text: "Orientação conceitual." },
  { order: 2 as const, text: "Orientação mais específica." },
  { order: 3 as const, text: "Orientação quase resolutiva." },
];

describe("HintPanel", () => {
  it("não revela nenhuma dica inicialmente (item 10 do prompt mestre: nunca entregar de graça)", () => {
    render(<HintPanel hints={hints} />);
    expect(screen.queryByText(/orientação/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ver dica 1/i })).toBeInTheDocument();
  });

  it("revela as dicas em ordem, uma por clique, e chama onHintRevealed a cada uma", async () => {
    const onHintRevealed = vi.fn();
    const user = userEvent.setup();
    render(<HintPanel hints={hints} onHintRevealed={onHintRevealed} />);

    await user.click(screen.getByRole("button", { name: /ver dica 1/i }));
    expect(screen.getByText(/orientação conceitual/i)).toBeInTheDocument();
    expect(onHintRevealed).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /ver dica 2/i }));
    expect(screen.getByText(/orientação mais específica/i)).toBeInTheDocument();
    expect(onHintRevealed).toHaveBeenCalledTimes(2);

    await user.click(screen.getByRole("button", { name: /ver dica 3/i }));
    expect(screen.getByText(/orientação quase resolutiva/i)).toBeInTheDocument();
    expect(onHintRevealed).toHaveBeenCalledTimes(3);
  });

  it("some com o botão de dica e avisa que acabaram as dicas depois da última", async () => {
    const user = userEvent.setup();
    render(<HintPanel hints={hints} />);

    for (let i = 0; i < hints.length; i++) {
      await user.click(screen.getByRole("button", { name: new RegExp(`ver dica ${i + 1}`, "i") }));
    }

    expect(screen.queryByRole("button", { name: /ver dica/i })).not.toBeInTheDocument();
    expect(screen.getByText(/já viu todas as dicas/i)).toBeInTheDocument();
  });

  it("respeita a ordem declarada em `order`, mesmo se o array vier fora de ordem", async () => {
    const shuffled = [hints[2], hints[0], hints[1]];
    const user = userEvent.setup();
    render(<HintPanel hints={shuffled} />);

    await user.click(screen.getByRole("button", { name: /ver dica 1/i }));
    expect(screen.getByText(/orientação conceitual/i)).toBeInTheDocument();
  });
});
