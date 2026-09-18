"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { runMockPython, type MockRunResult } from "@/lib/python/mockRunner";
import { OutputConsole } from "./OutputConsole";

interface CodeEditorProps {
  starterCode: string;
  exampleCode?: string;
  onResult?: (result: MockRunResult) => void;
}

export function CodeEditor({ starterCode, exampleCode, onResult }: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState<MockRunResult | null>(null);
  const editorId = useId();

  function handleRun() {
    const next = runMockPython(code);
    setResult(next);
    onResult?.(next);
  }

  function handleReset() {
    setCode(starterCode);
    setResult(null);
  }

  function handleClear() {
    setCode("");
    setResult(null);
  }

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
          <Button onClick={handleRun}>Executar</Button>
          <Button variant="secondary" onClick={handleReset}>
            Reiniciar
          </Button>
          <Button variant="ghost" onClick={handleClear}>
            Limpar
          </Button>
          {exampleCode && (
            <Button variant="ghost" onClick={() => setCode(exampleCode)}>
              Carregar exemplo
            </Button>
          )}
        </div>
      </div>
      <OutputConsole result={result} />
    </div>
  );
}
