/**
 * Mock runner de Python (Fase 3). Os Módulos 1 e 2 do MVP ensinam apenas
 * `print("texto")` e comentários (`#`) — por isso um interpretador mínimo,
 * rodando em JavaScript puro, já é suficiente e honesto pedagogicamente.
 *
 * Na Fase 6 este arquivo é substituído por `pyodideRunner.ts`, que executa
 * Python real (via Pyodide/WebAssembly) inteiramente no navegador — sem
 * acesso a servidor, banco ou variáveis de ambiente, conforme o item 11 do
 * prompt mestre. A assinatura de `runMockPython` foi pensada para que essa
 * troca não exija mudar os componentes que a chamam.
 */

export interface MockRunError {
  line: number;
  raw: string;
  pythonError: string;
  pedagogicalMessage: string;
  hint: string;
}

export interface MockRunResult {
  output: string[];
  error?: MockRunError;
}

const PRINT_WITH_QUOTES = /^print\(\s*(["'])([\s\S]*?)\1\s*\)$/;
const PRINT_WITHOUT_QUOTES = /^print\(\s*([^"'()]+?)\s*\)$/;

export function runMockPython(code: string): MockRunResult {
  const lines = code.split("\n");
  const output: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (line === "" || line.startsWith("#")) continue;

    const withQuotes = line.match(PRINT_WITH_QUOTES);
    if (withQuotes) {
      output.push(withQuotes[2]);
      continue;
    }

    const withoutQuotes = line.match(PRINT_WITHOUT_QUOTES);
    if (withoutQuotes) {
      const name = withoutQuotes[1].trim();
      return {
        output,
        error: {
          line: i + 1,
          raw,
          pythonError: "NameError",
          pedagogicalMessage: `O Python está procurando uma variável chamada "${name}", mas ela não existe. Você queria escrever um texto?`,
          hint: `Textos precisam estar entre aspas: print("${name}")`,
        },
      };
    }

    return {
      output,
      error: {
        line: i + 1,
        raw,
        pythonError: "SyntaxError (mock)",
        pedagogicalMessage:
          'Este laboratório mockado só entende print("texto") e comentários (#) — o suficiente para os Módulos 1 e 2. A execução completa de Python chega na Fase 6.',
        hint: 'Use o formato: print("seu texto aqui")',
      },
    };
  }

  return { output };
}

export function matchesExpectedOutput(
  output: string[],
  expected: string[],
): boolean {
  if (output.length !== expected.length) return false;
  return output.every((line, i) => line === expected[i]);
}
