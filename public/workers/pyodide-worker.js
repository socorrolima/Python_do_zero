/**
 * Worker "clássico" que carrega o Pyodide (Python via WebAssembly) e roda
 * o código do aluno isolado da thread principal — a aba continua
 * responsiva mesmo que o código trave ou entre em loop infinito, e
 * src/lib/python/pyodideRunner.ts consegue aplicar um timeout terminando
 * este worker (ver ARCHITECTURE.md, seção "Decisão: execução de código do
 * aluno").
 *
 * Por que este arquivo mora em public/ em vez de src/lib/python/: o
 * Turbopack deste projeto (Next.js 16) não compila um arquivo referenciado
 * por `new Worker(new URL("./arquivo.ts", import.meta.url))` — ele só
 * copia o `.ts` cru como um asset estático (do jeito que copiaria uma
 * imagem), e o navegador não consegue executar TypeScript/ESM diretamente
 * num worker clássico. Servindo daqui, o arquivo já é o que o navegador
 * vai rodar: JavaScript puro, sem import/export, carregado com
 * `importScripts()` (ver DEVELOPMENT.md).
 *
 * Protocolo de mensagens (espelha src/lib/python/workerMessages.ts):
 *   → { type: "run", code: string, stdinLines?: string[] }
 *   ← { type: "result", output: string[] }
 *   ← { type: "error", output: string[], raw: string }
 *
 * `stdinLines` (Fase 11 — Módulo 4, input()): respostas pré-digitadas para
 * os input() do código, uma por linha. Sem SharedArrayBuffer/Atomics (que
 * exigiria isolamento cross-origin em toda a página, inclusive no Pyodide
 * vindo do CDN), não dá para pausar a execução no meio para perguntar cada
 * resposta em tempo real — por isso elas são coletadas ANTES de rodar.
 *
 * O código do aluno roda só dentro deste WebAssembly, sem acesso a
 * servidor, banco de dados ou variáveis de ambiente (item 11 do prompt
 * mestre).
 */

const PYODIDE_VERSION = "0.26.4";
const PYODIDE_CDN_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise = null;

function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      importScripts(`${PYODIDE_CDN_BASE}pyodide.js`);
      if (typeof loadPyodide !== "function") {
        throw new Error("Pyodide não carregou corretamente do CDN.");
      }
      return loadPyodide({ indexURL: PYODIDE_CDN_BASE });
    })();
  }
  return pyodidePromise;
}

self.onmessage = async (event) => {
  if (!event.data || event.data.type !== "run") return;
  const output = [];

  try {
    const pyodide = await getPyodide();
    pyodide.setStdout({ batched: (msg) => output.push(msg) });
    // Tracebacks chegam pela exceção lançada por runPythonAsync, não pelo
    // stderr — por isso o stderr batido aqui é apenas descartado.
    pyodide.setStderr({ batched: () => {} });

    // Cada chamada devolve uma linha da fila (com \n, como um terminal
    // real entregaria) até acabar; depois disso, null sinaliza EOF — um
    // input() chamado além das respostas fornecidas levanta EOFError, que
    // errorMessages.ts traduz para o aluno.
    const stdinQueue = Array.isArray(event.data.stdinLines) ? [...event.data.stdinLines] : [];
    pyodide.setStdin({
      stdin: () => (stdinQueue.length > 0 ? `${stdinQueue.shift()}\n` : null),
    });

    await pyodide.runPythonAsync(event.data.code);
    self.postMessage({ type: "result", output });
  } catch (err) {
    const raw = err instanceof Error ? err.message : String(err);
    self.postMessage({ type: "error", output, raw });
  }
};

