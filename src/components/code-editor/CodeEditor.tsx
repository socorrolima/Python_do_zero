"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { runPython, isPyodideLoaded, type RunResult } from "@/lib/python/pyodideRunner";
import { OutputConsole } from "./OutputConsole";

interface CodeEditorProps {
  starterCode: string;
  exampleCode?: string;
  onResult?: (result: RunResult) => void;
}

type Status = "idle" | "loading" | "running";

export function CodeEditor({ starterCode, exampleCode, onResult }: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [stdin, setStdin] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const editorId = useId();
  const stdinId = useId();

  async function handleRun() {
    setStatus(isPyodideLoaded() ? "running" : "loading");
    try {
      // Uma resposta por linha, na ordem dos input() do código — ver o
      // comentário em workerMessages.ts sobre por que não dá pra pedir
      // cada uma em tempo real durante a execução (não é um terminal
      // real). Campo vazio = nenhuma resposta pré-carregada.
      const stdinLines = stdin === "" ? [] : stdin.split("\n");
      const next = await runPython(code, stdinLines);
      setResult(next);
      onResult?.(next);
    } finally {
      setStatus("idle");
    }
  }

  function handleReset() {
    setCode(starterCode);
    setStdin("");
    setResult(null);
  }

  function handleClear() {
    setCode("");
    setStdin("");
    setResult(null);
  }

  const busy = status !== "idle";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label htmlFor={editorId} className="mb-1 block text-sm font-medium">
          Editor de código
        </label>
        <textarea
          id={editorId}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          rows={8}
          className="w-full rounded-lg border border-foreground/10 bg-foreground/5 p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-foreground/30"
        />

        <label htmlFor={stdinId} className="mb-1 mt-3 block text-sm font-medium">
          Entradas (input){" "}
          <span className="font-normal text-slate-500">— opcional</span>
        </label>
        <textarea
          id={stdinId}
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          spellCheck={false}
          rows={2}
          placeholder={"Se o código usa input(), escreva aqui uma resposta por linha,\nna mesma ordem em que os input() aparecem no código."}
          className="w-full rounded-lg border border-foreground/10 bg-foreground/5 p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-foreground/30"
        />
        <p className="mb-2 mt-1 text-xs text-slate-500">
          O Laboratório não é um terminal de verdade: ele não consegue parar no meio
          para perguntar. Por isso, se seu código usa input(), escreva a resposta
          aqui antes de executar.
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          <Button onClick={handleRun} disabled={busy}>
            {status === "loading"
              ? "Carregando Python…"
              : status === "running"
                ? "Executando…"
                : "Executar"}
          </Button>
          <Button variant="secondary" onClick={handleReset} disabled={busy}>
            Reiniciar
          </Button>
          <Button variant="ghost" onClick={handleClear} disabled={busy}>
            Limpar
          </Button>
          {exampleCode && (
            <Button variant="ghost" onClick={() => setCode(exampleCode)} disabled={busy}>
              Carregar exemplo
            </Button>
          )}
        </div>
      </div>
      <OutputConsole result={result} status={status} />
    </div>
  );
}
