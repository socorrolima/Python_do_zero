/**
 * Traduz erros reais do Python (via Pyodide) para mensagens pedagógicas,
 * no mesmo espírito do item 9 do prompt mestre: nunca mostrar só um
 * traceback técnico, sempre acompanhado de uma explicação em português
 * simples e uma dica de correção.
 */

export interface TranslatedError {
  pythonError: string;
  pedagogicalMessage: string;
  hint: string;
  line: number | null;
}

interface ErrorTemplate {
  message: (detail: string) => string;
  hint: string;
}

const TEMPLATES: Record<string, ErrorTemplate> = {
  NameError: {
    message: (detail) => {
      const match = detail.match(/name '([^']+)' is not defined/);
      const name = match?.[1] ?? "algo";
      return `O Python está procurando uma variável ou nome chamado "${name}", mas ele não existe ainda. Você esqueceu de criar essa variável antes, ou queria escrever um texto?`;
    },
    hint: 'Se era para ser um texto, use aspas: print("seu texto"). Se era uma variável, crie-a antes de usar: nome = "valor".',
  },
  SyntaxError: {
    message: () =>
      "O Python não conseguiu entender a estrutura do seu código — alguma coisa está escrita fora do formato esperado.",
    hint: "Revise parênteses, aspas e dois-pontos (:) — cada abertura precisa de um fechamento correspondente.",
  },
  IndentationError: {
    message: () =>
      "As linhas do seu código não estão alinhadas do jeito que o Python espera.",
    hint: "Em Python, os espaços no início da linha (indentação) fazem parte da sintaxe — use sempre a mesma quantidade de espaços dentro de um mesmo bloco.",
  },
  TabError: {
    message: () => "O código mistura espaços e tabs para indentar, e o Python não sabe qual seguir.",
    hint: "Use só espaços (ou só tabs) para indentar — não misture os dois no mesmo bloco.",
  },
  TypeError: {
    message: (detail) => `O Python tentou usar um valor de um jeito que não é permitido para o tipo dele. Detalhe original: ${detail}`,
    hint: "Confira se está misturando tipos diferentes (por exemplo, texto com número) sem converter um deles com str(), int() ou float().",
  },
  ValueError: {
    message: (detail) => `O valor usado não é válido para essa operação. Detalhe original: ${detail}`,
    hint: "Confira o valor que está sendo passado — ele pode não estar no formato que a função espera.",
  },
  ZeroDivisionError: {
    message: () =>
      "O código tentou dividir um número por zero, o que não é permitido em matemática nem em Python.",
    hint: "Verifique se o valor usado como divisor pode ser zero e trate esse caso antes de dividir.",
  },
  IndexError: {
    message: () => "O código tentou acessar uma posição que não existe em uma lista (ou texto).",
    hint: "Lembre-se: a primeira posição de uma lista é a posição 0, e a última é o tamanho da lista menos 1.",
  },
  KeyError: {
    message: (detail) => `O código tentou acessar uma chave que não existe em um dicionário. Detalhe original: ${detail}`,
    hint: "Confira se a chave foi escrita exatamente como no dicionário — maiúsculas e minúsculas importam.",
  },
  AttributeError: {
    message: (detail) => `O código tentou usar algo que não existe para esse tipo de valor. Detalhe original: ${detail}`,
    hint: "Confira o nome do método ou atributo — pode haver um erro de digitação, ou o valor pode ser de outro tipo do que você pensa.",
  },
  ModuleNotFoundError: {
    message: (detail) => `O código tentou usar um módulo que não está disponível aqui. Detalhe original: ${detail}`,
    hint: "Este laboratório roda no navegador e só tem os módulos padrão do Python disponíveis.",
  },
};

const GENERIC: ErrorTemplate = {
  message: (detail) => `O Python encontrou um erro ao executar o código: ${detail}`,
  hint: "Releia o código com atenção, linha por linha, comparando com o exemplo da aula.",
};

/** `raw` é a mensagem completa (traceback) que o Pyodide devolve quando o código lança uma exceção. */
export function translatePythonError(raw: string): TranslatedError {
  const trimmed = raw.trim();
  const lines = trimmed.split("\n");
  const lastLine = lines[lines.length - 1] ?? trimmed;
  const match = lastLine.match(/^(\w+):\s*(.*)$/);
  const pythonError = match?.[1] ?? "Erro";
  const detail = match?.[2] ?? lastLine;

  const lineMatches = [...trimmed.matchAll(/File "<exec>", line (\d+)/g)];
  const line = lineMatches.length > 0 ? Number(lineMatches[lineMatches.length - 1][1]) : null;

  const template = TEMPLATES[pythonError] ?? GENERIC;

  return {
    pythonError,
    pedagogicalMessage: template.message(detail),
    hint: template.hint,
    line,
  };
}
