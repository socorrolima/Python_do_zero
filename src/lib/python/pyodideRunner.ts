/**
 * Fachada usada pelos componentes de UI (`CodeEditor`, `ExercisePrompt`)
 * para executar Python real. Delega para um worker dedicado
 * (`public/workers/pyodide-worker.js`) e aplica um timeout — protege a
 * aba de travar se o código do aluno entrar em loop infinito, já que
 * agora é Python de verdade, não mais o mock da Fase 3/5 que só entendia
 * print().
 *
 * O worker é servido de `public/` (JavaScript puro, sem import/export) em
 * vez de viver junto deste arquivo em `src/lib/python/` porque o
 * Turbopack deste projeto não compila um `.ts` referenciado via
 * `new Worker(new URL("./arquivo.ts", import.meta.url))` — ele só copia o
 * arquivo cru como asset estático, que o navegador não consegue executar
 * num worker. Ver o comentário no topo de `public/workers/pyodide-worker.js`.
 *
 * Substitui `mockRunner.ts` mantendo a mesma ideia de assinatura
 * (`RunResult { output, error? }`), só que assíncrona — carregar e
 * executar Python via WebAssembly não é instantâneo.
 */
import { translatePythonError, type TranslatedError } from "./errorMessages";
import type { WorkerRequest, WorkerResponse } from "./workerMessages";

export interface RunResult {
  output: string[];
  error?: TranslatedError;
}

// A primeira execução baixa e inicializa o Pyodide (dezenas de megabytes,
// cacheados pelo navegador depois); as próximas só executam o código. Em
// conexões mais lentas isso pode passar de 1 minuto sem que nada esteja
// realmente travado — por isso a margem é generosa (evita mostrar "demorou
// demais" para quem só está numa rede lenta e o download ainda está a
// caminho).
const LOAD_TIMEOUT_MS = 120_000;
const RUN_TIMEOUT_MS = 8_000;

let worker: Worker | null = null;
let pyodideReady = false;

function createWorker(): Worker {
  return new Worker("/workers/pyodide-worker.js");
}

/** Usado pela UI só para decidir a mensagem do botão ("Carregando…" vs "Executando…"). */
export function isPyodideLoaded(): boolean {
  return pyodideReady;
}

/**
 * `stdinLines`: respostas para os input() do código, uma por linha, na
 * ordem em que aparecem — ver o comentário em `workerMessages.ts` sobre
 * por que não dá para pedir cada uma em tempo real durante a execução.
 */
export function runPython(code: string, stdinLines: string[] = []): Promise<RunResult> {
  return new Promise((resolve) => {
    if (!worker) worker = createWorker();
    const activeWorker = worker;
    const timeoutMs = pyodideReady ? RUN_TIMEOUT_MS : LOAD_TIMEOUT_MS;

    const timeoutId = setTimeout(() => {
      activeWorker.removeEventListener("message", handleMessage);
      activeWorker.terminate();
      if (worker === activeWorker) worker = null;
      pyodideReady = false;
      resolve({
        output: [],
        error: {
          pythonError: "Tempo esgotado",
          pedagogicalMessage: pyodideReady
            ? "O código demorou demais para terminar — pode ter entrado em um loop infinito (por exemplo, um `while` cuja condição nunca vira falsa)."
            : "O interpretador Python demorou demais para carregar (mais de 2 minutos). Isso costuma ser conexão lenta ou instável — verifique sua internet e tente executar de novo.",
          hint: pyodideReady
            ? "Revise as condições dos seus loops: alguma variável usada nela precisa mudar dentro do loop."
            : "Na primeira vez, o navegador baixa o interpretador Python inteiro (alguns megabytes) — em conexões lentas isso pode levar mais de um minuto. Tente de novo; se persistir, teste com outra rede.",
          line: null,
        },
      });
    }, timeoutMs);

    function handleMessage(event: MessageEvent<WorkerResponse>) {
      clearTimeout(timeoutId);
      activeWorker.removeEventListener("message", handleMessage);
      pyodideReady = true;

      const data = event.data;
      if (data.type === "result") {
        resolve({ output: data.output });
      } else {
        resolve({ output: data.output, error: translatePythonError(data.raw) });
      }
    }

    activeWorker.addEventListener("message", handleMessage);
    const request: WorkerRequest = { type: "run", code, stdinLines };
    activeWorker.postMessage(request);
  });
}

export function matchesExpectedOutput(output: string[], expected: string[]): boolean {
  if (output.length !== expected.length) return false;
  return output.every((line, i) => line === expected[i]);
}
