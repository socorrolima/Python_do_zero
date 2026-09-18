import type { MockRunResult } from "@/lib/python/mockRunner";

export function OutputConsole({ result }: { result: MockRunResult | null }) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium">Resultado</p>
      <div
        role="status"
        aria-live="polite"
        className="h-48 overflow-auto rounded-lg border border-foreground/10 bg-slate-950 p-3 font-mono text-sm text-slate-100"
      >
        {!result && (
          <p className="text-slate-500">
            Clique em &quot;Executar&quot; para ver o resultado aqui.
          </p>
        )}
        {result?.output.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
        {result?.error && (
          <div className="mt-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-amber-200">
            <p className="font-semibold">⚠️ Algo aconteceu.</p>
            <p>{result.error.pedagogicalMessage}</p>
            <p className="mt-1 text-amber-300">💡 Dica: {result.error.hint}</p>
            <p className="mt-1 text-xs text-slate-400">
              Erro do Python: {result.error.pythonError} (linha {result.error.line})
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
