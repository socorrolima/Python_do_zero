/**
 * Formato das mensagens entre a thread principal (`pyodideRunner.ts`) e o
 * worker que roda o Pyodide (`public/workers/pyodide-worker.js`). O
 * worker em si é JavaScript puro (ver comentário nesse arquivo para o
 * motivo) e não importa estes tipos — eles documentam o contrato e
 * tipam apenas o lado da thread principal.
 */

export type WorkerRequest = { type: "run"; code: string };

export type WorkerResponse =
  | { type: "result"; output: string[] }
  | { type: "error"; output: string[]; raw: string };
