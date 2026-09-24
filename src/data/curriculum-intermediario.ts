import type { Module } from "@/types/curriculum";

const COURSE_SLUG = "python-intermediario";

/**
 * Currículo do curso Python Intermediário — curso separado do Python do
 * Zero (`src/data/curriculum.ts`, que fica intocado), inserido na mesma
 * estrutura de plataforma (ver ARCHITECTURE.md e DATABASE.md).
 *
 * Segue a arquitetura definida no documento "Curso Python Intermediário":
 * 10 módulos, do "Consolidando Python" ao "Projeto Final". Como no início
 * do Python do Zero, o lançamento não implementa os 10 de uma vez —
 * o Módulo 1 já tem aulas reais e funcionando; os Módulos 2 a 10 aparecem
 * na trilha como "Em breve" (mesmo padrão de `modulePlaceholder` já usado
 * neste arquivo-irmão) até serem desenvolvidos, um de cada vez.
 *
 * Assim como o curso original, `src/lib/exercises/content.ts` busca este
 * conteúdo do Supabase e só cai de volta para os dados daqui se o banco
 * ainda não tiver sido migrado/populado (`supabase/migrations/0002_courses.sql`
 * + `npm run seed`).
 */

function modulePlaceholder(order: number, slug: string, title: string, description: string): Module {
  return { slug, order, title, description, lessons: [], courseSlug: COURSE_SLUG };
}

const MODULO_1: Module = {
  slug: "consolidando-python",
  order: 1,
  title: "Consolidando Python",
  description:
    "Revisão rápida de variáveis, tipos, operadores, condicionais, laços e coleções — a base para o resto do curso intermediário.",
  courseSlug: COURSE_SLUG,
  lessons: [
    {
      id: "int-revisao-variaveis-tipos-operadores",
      slug: "revisao-variaveis-tipos-operadores",
      moduleSlug: "consolidando-python",
      courseSlug: COURSE_SLUG,
      order: 1,
      title: "Revisão: variáveis, tipos e operadores",
      objective:
        "Revisar tipos de dados, conversão de tipos e operadores antes de avançar para estruturas mais complexas.",
      estimatedMinutes: 15,
      difficulty: 2,
      concept:
        "Você já viu isso no Python do Zero — aqui é revisão rápida, não a primeira vez. `type()` mostra o tipo de qualquer valor. Ao multiplicar ou somar tipos diferentes (por exemplo, um `int` com um `float`), o Python converte automaticamente para o tipo mais \"amplo\": o resultado de int * float é sempre float.",
      example: {
        code:
          'nome = "Maria"\nidade = 35\naltura = 1.68\n\nprint(type(nome))\nprint(type(idade))\nprint(type(altura))',
        explanation:
          "type() devolve a classe do valor guardado na variável: <class 'str'>, <class 'int'> e <class 'float'>, nessa ordem.",
      },
      challenge: {
        kind: "code",
        id: "int-ex-1-1",
        title: "Total da compra",
        difficulty: 2,
        concept: "tipos_e_conversao",
        conceptId: "tipos_e_conversao",
        instruction:
          "Crie a variável preco = 25.5 (float) e quantidade = 2 (int). Calcule total = preco * quantidade e exiba, em duas linhas, exatamente: Total: 51.0 e depois <class 'float'> (o tipo de total).",
        starterCode:
          "preco = 0\nquantidade = 0\n\n# calcule o total e exiba as duas linhas pedidas\n",
        expectedOutput: ["Total: 51.0", "<class 'float'>"],
        hints: [
          { order: 1, text: "Multiplicar um float por um int sempre resulta em float — mesmo quando o valor \"parece\" inteiro." },
          { order: 2, text: 'Use f-string para montar a primeira linha: print(f"Total: {total}").' },
          {
            order: 3,
            text:
              'preco = 25.5\nquantidade = 2\ntotal = preco * quantidade\nprint(f"Total: {total}")\nprint(type(total))',
          },
        ],
      },
      summary:
        "type() revela o tipo de um valor. Operações entre int e float sempre resultam em float — é bom saber disso antes de comparar ou formatar resultados.",
      nextLessonSlug: "condicionais-e-lacos-revisao",
    },
    {
      id: "int-condicionais-e-lacos",
      slug: "condicionais-e-lacos-revisao",
      moduleSlug: "consolidando-python",
      courseSlug: COURSE_SLUG,
      order: 2,
      title: "Condicionais e laços na prática",
      objective:
        "Revisar if/elif/else e a diferença entre for e while, combinando os dois em um mesmo problema.",
      estimatedMinutes: 15,
      difficulty: 2,
      concept:
        "elif encadeia condições: o Python testa de cima para baixo e para no primeiro True. for percorre uma sequência conhecida (como range()); while repete enquanto uma condição for verdadeira — útil quando você não sabe de antemão quantas voltas vai dar.",
      example: {
        code:
          'nota = 7\n\nif nota >= 7:\n    situacao = "Aprovado"\nelif nota >= 5:\n    situacao = "Recuperação"\nelse:\n    situacao = "Reprovado"\n\nprint(situacao)',
        explanation:
          "O Python testa nota >= 7 primeiro; como é verdadeiro, usa esse ramo e nem chega a avaliar o elif.",
      },
      challenge: {
        kind: "code",
        id: "int-ex-1-2",
        title: "Soma dos pares",
        difficulty: 2,
        concept: "condicionais_e_lacos",
        conceptId: "condicionais_e_lacos",
        instruction:
          "Use um for com range() para somar os números pares de 1 até 10 (incluindo o 10) e exiba exatamente: Soma dos pares: 30",
        starterCode:
          "soma = 0\n\nfor numero in range(1, 11):\n    # verifique se numero é par e, se for, some a soma\n    pass\n\nprint(f\"Soma dos pares: {soma}\")",
        expectedOutput: ["Soma dos pares: 30"],
        hints: [
          { order: 1, text: "Um número é par quando o resto da divisão por 2 é zero — o operador % devolve esse resto." },
          { order: 2, text: "Dentro do for, use if numero % 2 == 0: para decidir se soma." },
          {
            order: 3,
            text:
              'for numero in range(1, 11):\n    if numero % 2 == 0:\n        soma += numero\nprint(f"Soma dos pares: {soma}")',
          },
        ],
      },
      summary:
        "elif encadeia condições em ordem; for percorre sequências conhecidas; while repete enquanto uma condição continuar verdadeira.",
      nextLessonSlug: "colecoes-listas-tuplas-dicionarios-conjuntos",
    },
    {
      id: "int-colecoes",
      slug: "colecoes-listas-tuplas-dicionarios-conjuntos",
      moduleSlug: "consolidando-python",
      courseSlug: COURSE_SLUG,
      order: 3,
      title: "Coleções: listas, tuplas, dicionários e conjuntos",
      objective:
        "Revisar as quatro coleções básicas de Python e quando usar cada uma.",
      estimatedMinutes: 18,
      difficulty: 3,
      concept:
        "Lista: ordenada e mutável — para uma sequência que muda. Tupla: ordenada e imutável — para um agrupamento fixo, como coordenadas. Dicionário: pares chave-valor — para dados nomeados, como um cadastro. Conjunto (set): itens únicos, sem ordem garantida — remove duplicados automaticamente.",
      example: {
        code:
          'frutas = ["maçã", "banana", "laranja"]\ncoordenada = (10, 20)\npessoa = {"nome": "João", "idade": 41}\nnumeros_unicos = {1, 2, 2, 3}\n\nprint(frutas[1])\nprint(pessoa["nome"])\nprint(len(numeros_unicos))',
        explanation:
          'frutas[1] acessa o segundo item da lista ("banana"). pessoa["nome"] busca pelo valor da chave "nome". numeros_unicos vira {1, 2, 3} — o 2 repetido desaparece — por isso len() dá 3.',
      },
      challenge: {
        kind: "code",
        id: "int-ex-1-3",
        title: "Lista de dicionários",
        difficulty: 3,
        concept: "colecoes",
        conceptId: "colecoes",
        instruction:
          "A lista pessoas já está pronta, com dois dicionários (nome e idade). Percorra a lista com um for e exiba cada pessoa exatamente no formato: <nome> tem <idade> anos",
        starterCode:
          'pessoas = [\n    {"nome": "Ana", "idade": 28},\n    {"nome": "Carlos", "idade": 34},\n]\n\n# percorra a lista e exiba cada pessoa no formato pedido\n',
        expectedOutput: ["Ana tem 28 anos", "Carlos tem 34 anos"],
        hints: [
          { order: 1, text: "Cada item da lista é um dicionário — acesse os valores com pessoa['nome'] e pessoa['idade']." },
          { order: 2, text: "Use for pessoa in pessoas: e, dentro dele, um print(f\"...\")." },
          {
            order: 3,
            text: "for pessoa in pessoas:\n    print(f\"{pessoa['nome']} tem {pessoa['idade']} anos\")",
          },
        ],
      },
      summary:
        "Lista para sequências que mudam, tupla para agrupamentos fixos, dicionário para dados nomeados, conjunto para itens únicos sem duplicados.",
      nextLessonSlug: "projeto-sistema-de-cadastro-de-pessoas",
    },
    {
      id: "int-projeto-cadastro-pessoas",
      slug: "projeto-sistema-de-cadastro-de-pessoas",
      moduleSlug: "consolidando-python",
      courseSlug: COURSE_SLUG,
      order: 4,
      title: "Boas práticas, PEP 8 e o projeto do módulo",
      objective:
        "Conhecer as boas práticas básicas do PEP 8 e aplicar tudo que foi revisado no módulo em um mini sistema de cadastro.",
      estimatedMinutes: 20,
      difficulty: 3,
      concept:
        "PEP 8 é o guia de estilo oficial do Python: nomes de variáveis e funções em snake_case (minúsculas com underline), um espaço depois da vírgula, evitar linhas muito longas, e comentários que expliquem o porquê, não o óbvio. Código que segue PEP 8 é mais fácil de ler — inclusive para você mesmo, semanas depois.",
      example: {
        code:
          '# Ruim: nomes confusos, sem espaçamento\nx=["Maria",35]\n\n# Bom: nomes descritivos, PEP 8\npessoa_nome = "Maria"\npessoa_idade = 35',
        explanation:
          "A segunda versão deixa claro o que cada variável representa, sem precisar de comentário extra para explicar.",
      },
      miniProject: {
        title: "Sistema de cadastro de pessoas",
        description:
          "Projeto do Módulo 1: uma lista de dicionários representando pessoas cadastradas (nome, idade, cidade). Usando só o que foi revisado até aqui (variáveis, condicionais, laços e coleções — funções chegam no Módulo 2), implemente as operações de cadastrar, listar, pesquisar, alterar e excluir um registro da lista.",
      },
      challenge: {
        kind: "code",
        id: "int-ex-1-4",
        title: "Pesquisar por idade",
        difficulty: 3,
        concept: "projeto_cadastro",
        conceptId: "projeto_cadastro",
        instruction:
          "A lista pessoas já tem três registros. Escreva um for que exiba somente as pessoas com mais de 30 anos, na ordem em que aparecem na lista, no formato: <nome> - <idade> anos",
        starterCode:
          'pessoas = [\n    {"nome": "Maria", "idade": 35, "cidade": "Brasília"},\n    {"nome": "Pedro", "idade": 22, "cidade": "Goiânia"},\n    {"nome": "Joana", "idade": 41, "cidade": "Brasília"},\n]\n\n# exiba apenas quem tem mais de 30 anos, no formato "nome - idade anos"\n',
        expectedOutput: ["Maria - 35 anos", "Joana - 41 anos"],
        hints: [
          { order: 1, text: "Use for pessoa in pessoas: e, dentro dele, um if para filtrar pela idade." },
          { order: 2, text: "A condição é pessoa['idade'] > 30." },
          {
            order: 3,
            text:
              "for pessoa in pessoas:\n    if pessoa['idade'] > 30:\n        print(f\"{pessoa['nome']} - {pessoa['idade']} anos\")",
          },
        ],
      },
      summary:
        "PEP 8 torna o código mais legível através de nomes claros e espaçamento consistente. Este módulo revisou variáveis, condicionais, laços e coleções — a base para o Sistema de cadastro de pessoas, e para tudo que vem a seguir no curso.",
      nextLessonSlug: null,
    },
  ],
};

export const MODULES: Module[] = [
  MODULO_1,
  modulePlaceholder(
    2,
    "funcoes-de-verdade",
    "Funções de verdade",
    "Dividir problemas grandes em partes menores e reutilizáveis: parâmetros, retorno, *args, **kwargs, lambda, map(), filter().",
  ),
  modulePlaceholder(
    3,
    "estruturas-de-dados",
    "Estruturas de dados",
    "Listas de dicionários, dicionários de listas, compreensão de listas e de dicionários, enumerate(), zip(), agrupamento e ordenação.",
  ),
  modulePlaceholder(
    4,
    "arquivos-e-manipulacao-de-dados",
    "Arquivos e manipulação de dados",
    "Ler e gravar arquivos .txt, CSV e JSON com open() e with — fazer os dados sobreviverem ao fim do programa.",
  ),
  modulePlaceholder(
    5,
    "erros-excecoes-e-depuracao",
    "Erros, exceções e depuração",
    "try/except/else/finally, exceções específicas, raise, leitura de traceback e validação de entrada.",
  ),
  modulePlaceholder(
    6,
    "modulos-bibliotecas-e-ambientes",
    "Módulos, bibliotecas e ambientes",
    "import, criação de módulos próprios, biblioteca padrão (datetime, math, random, os, pathlib), pip, venv e requirements.txt.",
  ),
  modulePlaceholder(
    7,
    "programacao-orientada-a-objetos",
    "Programação Orientada a Objetos",
    "Classe, objeto, atributo, método, __init__, self, herança, composição e métodos especiais como __str__.",
  ),
  modulePlaceholder(
    8,
    "apis-json-e-internet",
    "APIs, JSON e Internet",
    "HTTP, requisições GET/POST, status codes, JSON e a biblioteca requests para consumir APIs públicas.",
  ),
  modulePlaceholder(
    9,
    "python-e-banco-de-dados",
    "Python + Banco de Dados",
    "SQL básico (SELECT, INSERT, UPDATE, DELETE) e conexão de Python com SQLite, depois PostgreSQL.",
  ),
  modulePlaceholder(
    10,
    "projeto-final-intermediario",
    "Projeto Final",
    "Integrar tudo: funções, coleções, arquivos, JSON, exceções, módulos, POO, API e SQLite em um Sistema de Gestão de Dados.",
  ),
];

export function getModuleBySlug(slug: string): Module | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function getLessonBySlug(slug: string) {
  for (const currentModule of MODULES) {
    const lesson = currentModule.lessons.find((l) => l.slug === slug);
    if (lesson) return { module: currentModule, lesson };
  }
  return undefined;
}

export function getAllLessonsInOrder() {
  return MODULES.flatMap((m) => m.lessons);
}
