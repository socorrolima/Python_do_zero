import { CodeEditor } from "@/components/code-editor/CodeEditor";

const EXEMPLO = 'print("Olá! Este é o Laboratório.")\nprint("Escreva o que quiser abaixo.")';

export default function LaboratorioPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold">Laboratório</h1>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        Espaço livre para praticar. Nesta fase, o editor entende apenas{" "}
        <code className="rounded bg-foreground/10 px-1">print(&quot;texto&quot;)</code> e
        comentários (<code className="rounded bg-foreground/10 px-1">#</code>) — o
        suficiente para os Módulos 1 e 2. Python completo chega na Fase 6, com
        execução real no navegador via Pyodide.
      </p>
      <CodeEditor starterCode={EXEMPLO} exampleCode={EXEMPLO} />
    </div>
  );
}
