import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CodeExercise, OrderExercise } from "@/types/curriculum";
import type { RunResult } from "@/lib/python/pyodideRunner";

const recordAttempt = vi.fn();

vi.mock("@/lib/learning/ProgressContext", () => ({
  useProgress: () => ({ recordAttempt }),
}));

// CodeEditor depende de Pyodide/Web Worker (só existem num navegador real —
// ver ressalva em README.md). Para testar ExercisePrompt isoladamente,
// substituímos por um stub que expõe um botão para disparar `onResult`
// manualmente, como se o aluno tivesse executado um código.
let lastCodeEditorResult: RunResult | undefined;
vi.mock("@/components/code-editor/CodeEditor", () => ({
  CodeEditor: ({ onResult }: { onResult?: (r: RunResult) => void }) => (
    <button onClick={() => onResult?.(lastCodeEditorResult!)}>Simular execução</button>
  ),
}));

const { ExercisePrompt } = await import("./ExercisePrompt");

afterEach(() => {
  vi.clearAllMocks();
});

const orderExercise: OrderExercise = {
  id: "ex-order",
  title: "Ordene os passos",
  difficulty: 1,
  concept: "algoritmo",
  conceptId: "concept-algoritmo",
  instruction: "Coloque os passos na ordem certa.",
  hints: [{ order: 1, text: "Comece pelo início." }],
  kind: "order",
  correctOrder: ["primeiro", "segundo"],
};

const codeExercise: CodeExercise = {
  id: "ex-code",
  title: "Imprima seu nome",
  difficulty: 1,
  concept: "print",
  conceptId: "concept-print",
  instruction: "Use print() para mostrar seu nome.",
  hints: [{ order: 1, text: "Use aspas." }],
  kind: "code",
  starterCode: "",
  expectedOutput: ["Maria"],
};

describe("ExercisePrompt — exercício de ordenação", () => {
  it("grava a tentativa correta, mostra feedback de acerto e chama onSolved", async () => {
    recordAttempt.mockResolvedValue({ action: "advance", concept: "algoritmo", difficulty: 1, reason: "" });
    const onSolved = vi.fn();
    const user = userEvent.setup();
    render(<ExercisePrompt exercise={orderExercise} onSolved={onSolved} />);

    // Já vem na ordem correta só por acaso é improvável; forçamos via handleCheck
    // clicando "Verificar ordem" pode dar certo ou errado dependendo do shuffle,
    // então aqui testamos via reordenação determinística não é necessário:
    // OrderChallenge já tem teste próprio. Aqui simulamos diretamente o caminho
    // de sucesso reordenando com as setas até bater com correctOrder.
    const items = screen.getAllByRole("listitem").map((li) => li.textContent ?? "");
    const isAlreadyCorrect = items[0]?.startsWith("1. primeiro");
    if (!isAlreadyCorrect) {
      await user.click(screen.getByRole("button", { name: /mover "primeiro" para cima/i }));
    }
    await user.click(screen.getByRole("button", { name: /verificar ordem/i }));

    expect(recordAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        exerciseId: "ex-order",
        concept: "algoritmo",
        conceptId: "concept-algoritmo",
        correct: true,
        hintsUsed: 0,
      }),
    );
    expect(await screen.findByText(/você acertou/i)).toBeInTheDocument();
    expect(onSolved).toHaveBeenCalledTimes(1);
  });

  it("não chama onSolved quando a tentativa está incorreta, e mostra as dicas", async () => {
    recordAttempt.mockResolvedValue(undefined);
    const onSolved = vi.fn();
    const user = userEvent.setup();
    // correctOrder invertível: forçamos erro verificando sem mexer (50% de chance
    // de já estar certo com 2 itens) — usamos um array de 3 itens para tornar
    // "já sair correto" improvável de atrapalhar o teste, e conferimos o resultado
    // registrado em vez de assumir o estado inicial.
    const threeStep: OrderExercise = {
      ...orderExercise,
      correctOrder: ["um", "dois", "tres"],
    };
    render(<ExercisePrompt exercise={threeStep} onSolved={onSolved} />);
    await user.click(screen.getByRole("button", { name: /verificar ordem/i }));

    const call = recordAttempt.mock.calls[0][0];
    if (call.correct) {
      // Shuffle coincidiu com a ordem certa — não há caso de erro para validar aqui.
      expect(onSolved).toHaveBeenCalledTimes(1);
      return;
    }
    expect(onSolved).not.toHaveBeenCalled();
    expect(await screen.findByText(/ainda não é isso/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ver dica 1/i })).toBeInTheDocument();
  });

  it("cai para recommendFromSingleAttempt quando recordAttempt não devolve histórico (undefined)", async () => {
    recordAttempt.mockResolvedValue(undefined);
    const user = userEvent.setup();
    const singleItem: OrderExercise = { ...orderExercise, correctOrder: ["único"] };
    render(<ExercisePrompt exercise={singleItem} />);

    await user.click(screen.getByRole("button", { name: /verificar ordem/i }));

    // Um único item nunca sai fora de ordem → sempre correto → sem dicas usadas → "advance".
    expect(await screen.findByText(/pronto para avançar/i)).toBeInTheDocument();
  });
});

describe("ExercisePrompt — exercício de código", () => {
  it("considera correto quando a saída bate com o esperado e grava a tentativa", async () => {
    lastCodeEditorResult = { output: ["Maria"] };
    recordAttempt.mockResolvedValue({ action: "advance", concept: "print", difficulty: 1, reason: "" });
    const onSolved = vi.fn();
    const user = userEvent.setup();
    render(<ExercisePrompt exercise={codeExercise} onSolved={onSolved} />);

    await user.click(screen.getByRole("button", { name: /simular execução/i }));

    expect(recordAttempt).toHaveBeenCalledWith(
      expect.objectContaining({ exerciseId: "ex-code", correct: true }),
    );
    expect(await screen.findByText(/você acertou/i)).toBeInTheDocument();
    expect(onSolved).toHaveBeenCalledTimes(1);
  });

  it("considera incorreto quando a saída não bate, sem chamar onSolved", async () => {
    lastCodeEditorResult = { output: ["nome errado"] };
    recordAttempt.mockResolvedValue(undefined);
    const onSolved = vi.fn();
    const user = userEvent.setup();
    render(<ExercisePrompt exercise={codeExercise} onSolved={onSolved} />);

    await user.click(screen.getByRole("button", { name: /simular execução/i }));

    expect(recordAttempt).toHaveBeenCalledWith(expect.objectContaining({ correct: false }));
    expect(onSolved).not.toHaveBeenCalled();
  });

  it("considera incorreto quando o código executado gera um erro Python", async () => {
    lastCodeEditorResult = {
      output: [],
      error: { pythonError: "NameError", pedagogicalMessage: "x", hint: "y", line: 1 },
    };
    recordAttempt.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ExercisePrompt exercise={codeExercise} />);

    await user.click(screen.getByRole("button", { name: /simular execução/i }));

    expect(recordAttempt).toHaveBeenCalledWith(expect.objectContaining({ correct: false }));
  });
});
