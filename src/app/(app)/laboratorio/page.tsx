import { CodeEditor } from "@/components/code-editor/CodeEditor";

const EXEMPLO = 'print("Olá! Este é o Laboratório.")\nprint("Escreva o que quiser abaixo.")';

export default function LaboratorioPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold">Laboratório</h1>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        Espaço livre para praticar. Python de verdade, rodando inteiramente no
        seu navegador — nada do que você escrever aqui chega a algum
        servidor. Na primeira execução, o interpretador leva alguns segundos
        para carregar; depois disso fica salvo no navegador.
      </p>
      <CodeEditor starterCode={EXEMPLO} exampleCode={EXEMPLO} />
    </div>
  );
}
