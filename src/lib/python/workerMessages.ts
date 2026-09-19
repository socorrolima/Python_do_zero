/**
 * Formato das mensagens entre a thread principal (`pyodideRunner.ts`) e o
 * worker que roda o Pyodide (`public/workers/pyodide-worker.js`). O
 * worker em si é JavaScript puro (ver comentário nesse arquivo para o
 * motivo) e não importa estes tipos — eles documentam o contrato e
 * tipam apenas o lado da thread principal.
 */

/**
 * `stdinLines`: respostas pré-digitadas para os `input()` do código do
 * aluno, uma por linha, na ordem em que os `input()` são chamados. Não dá
 * para pausar a execução no meio para pedir cada resposta em tempo real —
 * isso exigiria `SharedArrayBuffer`/`Atomics.wait` com o navegador em modo
 * "cross-origin isolated" (cabeçalhos COOP/COEP em toda resposta,
 * incluindo o Pyodide vindo do CDN), o que este projeto não configura.
 * Por isso o Laboratório pede as respostas antes de rodar (ver
 * `CodeEditor.tsx`) — é uma simulação de terminal, não um terminal real.
 */
export type WorkerRequest = { type: "run"; code: string; stdinLines?: string[] };

export type WorkerResponse =
  | { type: "result"; output: string[] }
  | { type: "error"; output: string[]; raw: string };
