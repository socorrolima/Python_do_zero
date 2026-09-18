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
  const [result, setResult] = useState<RunResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const editorId = useId();

  async function handleRun() {
    setStatus(isPyodideLoaded() ? "running" : "loading");
    try {
      const next = await runPython(code);
      setResult(next);
      onResult?.(next);
    } finally {
      setStatus("idle");
    }
  }

  function handleReset() {
    setCode(starterCode);
    setResult(null);
  }

  function handleClear() {
    setCode("");
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
