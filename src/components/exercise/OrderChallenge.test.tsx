import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrderChallenge } from "./OrderChallenge";

const correctOrder = ["A", "B", "C"];

// O componente embaralha a lista ao montar (`shuffle`, baseado em Math.random).
// Fixamos Math.random em 0 para tornar o embaralhamento determinístico nos
// testes — sem isso, cada execução começaria numa ordem diferente e não
// daria para prever quantos cliques faltam para reordenar corretamente.
function withFixedShuffle<T>(run: () => T): T {
  const spy = vi.spyOn(Math, "random").mockReturnValue(0);
  try {
    return run();
  } finally {
    spy.mockRestore();
  }
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("OrderChallenge", () => {
  it("renderiza os itens embaralhados, não na ordem correta original", () => {
    withFixedShuffle(() => render(<OrderChallenge correctOrder={correctOrder} onCheck={() => {}} />));
    // Com Math.random travado em 0, o shuffle determinístico produz [B, C, A].
    const items = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(items[0]).toMatch(/^1\. B/);
    expect(items[1]).toMatch(/^2\. C/);
    expect(items[2]).toMatch(/^3\. A/);
  });

  it("chama onCheck(false) quando a ordem enviada está errada", async () => {
    const onCheck = vi.fn();
    const user = userEvent.setup();
    withFixedShuffle(() => render(<OrderChallenge correctOrder={correctOrder} onCheck={onCheck} />));

    await user.click(screen.getByRole("button", { name: /verificar ordem/i }));
    expect(onCheck).toHaveBeenCalledWith(false);
  });

  it("chama onCheck(true) depois que o aluno reordena corretamente com as setas", async () => {
    const onCheck = vi.fn();
    const user = userEvent.setup();
    withFixedShuffle(() => render(<OrderChallenge correctOrder={correctOrder} onCheck={onCheck} />));

    // Ordem inicial (shuffle fixo): B, C, A — mover "A" para cima duas vezes resulta em A, B, C.
    await user.click(screen.getByRole("button", { name: /mover "A" para cima/i }));
    await user.click(screen.getByRole("button", { name: /mover "A" para cima/i }));
    await user.click(screen.getByRole("button", { name: /verificar ordem/i }));

    expect(onCheck).toHaveBeenCalledWith(true);
  });

  it("desabilita a seta para cima no primeiro item e a seta para baixo no último", () => {
    withFixedShuffle(() => render(<OrderChallenge correctOrder={correctOrder} onCheck={() => {}} />));

    const items = screen.getAllByRole("listitem");
    const firstUp = items[0].querySelector('button[aria-label*="para cima"]');
    const lastDown = items[items.length - 1].querySelector('button[aria-label*="para baixo"]');

    expect(firstUp).toBeDisabled();
    expect(lastDown).toBeDisabled();
  });
});
