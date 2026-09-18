import type { Module } from "@/types/curriculum";

/**
 * Fonte única do conteúdo dos Módulos 1 e 2. Desde a Fase 5, o app não lê
 * este arquivo diretamente — `src/lib/exercises/content.ts` busca o
 * currículo no Supabase (tabelas modules/lessons/concepts/exercises/hints
 * — ver DATABASE.md) e só cai de volta para os dados daqui se o banco
 * ainda não tiver sido configurado/populado. `scripts/seed.ts` lê este
 * mesmo arquivo para popular o Supabase (`npm run seed`), então editar o
 * conteúdo aqui é o jeito de mudar as aulas — nenhum componente React tem
 * texto de aula hardcoded.
 */
export const MODULES: Module[] = [
  {
    slug: "pensamento-computacional",
    order: 1,
    title: "Pensamento computacional",
    description:
      "O que é um algoritmo, como ordenar passos e como quebrar um problema grande em partes pequenas.",
    lessons: [
      {
        id: "o-que-e-um-algoritmo",
        slug: "o-que-e-um-algoritmo",
        moduleSlug: "pensamento-computacional",
        order: 1,
        title: "O que é um algoritmo?",
        objective:
          "Entender o que é um algoritmo e por que a ordem dos passos importa.",
        estimatedMinutes: 10,
        difficulty: 1,
        concept:
          "Um algoritmo é uma sequência de passos que, seguidos na ordem certa, resolvem um problema. É como uma receita de bolo: se você pular uma etapa ou trocar a ordem, o resultado muda — ou nem sai do jeito esperado.",
        example: {
          code: "1. Separar os ingredientes\n2. Misturar farinha e açúcar\n3. Adicionar ovos\n4. Levar ao forno por 40 minutos",
          explanation:
            "Cada linha é um passo. Se o passo 4 viesse antes do 2, não haveria nada para colocar no forno.",
        },
        challenge: {
          kind: "order",
          id: "ex-1-1",
          title: "Escovar os dentes",
          difficulty: 1,
          concept: "algoritmo",
          conceptId: "algoritmo",
          instruction:
            "Coloque estes passos na ordem correta para escovar os dentes.",
          correctOrder: [
            "Pegar a escova",
            "Colocar pasta de dente",
            "Escovar por 2 minutos",
            "Enxaguar a boca",
          ],
          hints: [
            { order: 1, text: "Pense no que você precisa ter em mãos antes de começar." },
            { order: 2, text: "Alguma coisa precisa estar na escova antes de ela entrar na boca." },
            { order: 3, text: "A ordem é: pegar a escova → pasta → escovar → enxaguar." },
          ],
        },
        summary:
          "Um algoritmo é uma sequência ordenada de passos que leva a um resultado. Mudar a ordem pode mudar — ou destruir — o resultado.",
        nextLessonSlug: "sequencia-e-ordem",
      },
      {
        id: "sequencia-e-ordem",
        slug: "sequencia-e-ordem",
        moduleSlug: "pensamento-computacional",
        order: 2,
        title: "Sequência e ordem dos passos",
        objective:
          "Praticar a criação de sequências de passos para resolver tarefas simples do dia a dia.",
        estimatedMinutes: 10,
        difficulty: 1,
        concept:
          "Duas listas com os mesmos passos podem dar resultados diferentes se a ordem entre eles mudar. Por isso, todo algoritmo depende não só do que fazer, mas de quando fazer.",
        example: {
          code: "1. Passar manteiga no pão\n2. Cortar o pão\n3. Comer o sanduíche",
          explanation:
            "Se o passo 2 vier antes do 1, fica bem mais difícil passar manteiga em duas metades soltas do que numa peça só.",
        },
        challenge: {
          kind: "order",
          id: "ex-1-2",
          title: "Atravessar a rua com segurança",
          difficulty: 2,
          concept: "algoritmo",
          conceptId: "algoritmo",
          instruction: "Ordene os passos para atravessar a rua com segurança.",
          correctOrder: [
            "Parar na faixa de pedestres",
            "Olhar para os dois lados",
            "Esperar o sinal ou os carros pararem",
            "Atravessar andando",
          ],
          hints: [
            { order: 1, text: "O primeiro passo é chegar até onde se pode atravessar." },
            { order: 2, text: "Antes de andar, é preciso checar se está seguro." },
            { order: 3, text: "Parar → olhar → esperar → atravessar." },
          ],
        },
        summary:
          "A ordem dos passos faz parte da solução, não é um detalhe. Trocar a ordem pode tornar a tarefa impossível ou insegura.",
        nextLessonSlug: "decompondo-problemas",
      },
      {
        id: "decompondo-problemas",
        slug: "decompondo-problemas",
        moduleSlug: "pensamento-computacional",
        order: 3,
        title: "Decompondo problemas grandes",
        objective:
          "Aprender a quebrar um problema grande em partes pequenas e mais fáceis de resolver.",
        estimatedMinutes: 12,
        difficulty: 2,
        concept:
          "Problemas grandes ficam mais simples quando divididos em partes menores. Essa técnica se chama decomposição: em vez de resolver tudo de uma vez, resolve-se um pedaço por vez, na ordem certa.",
        example: {
          code: "Problema: organizar um lanche para a turma\n\n1. Definir o que vai servir\n2. Fazer a lista de compras\n3. Comprar os itens\n4. Preparar e servir",
          explanation:
            "Cada parte (definir, listar, comprar, preparar) é pequena e fácil de entender sozinha — só juntas elas resolvem o problema inteiro.",
        },
        challenge: {
          kind: "order",
          id: "ex-1-3",
          title: "Fazer a lição de casa",
          difficulty: 2,
          concept: "decomposição",
          conceptId: "decomposicao",
          instruction:
            "Ordene as partes em que a tarefa 'fazer a lição de casa' pode ser dividida.",
          correctOrder: [
            "Separar o material e o caderno de anotações",
            "Ler o que foi pedido",
            "Resolver os exercícios",
            "Revisar as respostas",
          ],
          hints: [
            { order: 1, text: "O que precisa estar pronto antes de começar a resolver qualquer coisa?" },
            { order: 2, text: "Só depois de entender o que foi pedido é que dá para resolver." },
            { order: 3, text: "Separar → ler → resolver → revisar." },
          ],
        },
        miniProject: {
          title: "Meu algoritmo do dia a dia",
          description:
            "Escolha uma tarefa da sua rotina (por exemplo: arrumar a mochila, preparar um café) e escreva-a como uma lista numerada de passos, do início ao fim.",
        },
        summary:
          "Decompor um problema grande em partes pequenas é a base do pensamento computacional — e do próximo passo: transformar essas partes em código.",
        nextLessonSlug: "o-que-e-python",
      },
    ],
  },
  {
    slug: "primeiro-contato-python",
    order: 2,
    title: "Primeiro contato com Python",
    description:
      "O que é Python, como escrever o primeiro programa e como usar print() e comentários.",
    lessons: [
      {
        id: "o-que-e-python",
        slug: "o-que-e-python",
        moduleSlug: "primeiro-contato-python",
        order: 1,
        title: "O que é Python?",
        objective:
          "Conhecer a linguagem Python e escrever a primeira linha de código.",
        estimatedMinutes: 10,
        difficulty: 1,
        concept:
          "Python é uma linguagem de programação: um conjunto de palavras e regras que o computador entende e executa. Ela foi criada para ser simples e clara de ler — por isso é uma ótima primeira linguagem.",
        example: {
          code: 'print("Alô, mundo!")',
          explanation:
            "print() é um comando que mostra na tela o que está escrito entre aspas. \"Alô, mundo!\" é o texto que será exibido.",
        },
        challenge: {
          kind: "code",
          id: "ex-2-1",
          title: "Sua primeira mensagem",
          difficulty: 1,
          concept: "print",
          conceptId: "print",
          instruction:
            'Escreva um programa que exiba exatamente a frase: Estou aprendendo Python!',
          starterCode: 'print("")',
          expectedOutput: ["Estou aprendendo Python!"],
          hints: [
            { order: 1, text: "Use o comando print() para mostrar um texto na tela." },
            { order: 2, text: "O texto precisa ficar entre aspas, dentro dos parênteses." },
            { order: 3, text: 'Exemplo de formato: print("Estou aprendendo Python!")' },
          ],
        },
        summary:
          "Python é uma linguagem de programação. O comando print() exibe um texto na tela — e todo texto em Python precisa estar entre aspas.",
        nextLessonSlug: "print-e-comentarios",
      },
      {
        id: "print-e-comentarios",
        slug: "print-e-comentarios",
        moduleSlug: "primeiro-contato-python",
        order: 2,
        title: "print() e comentários",
        objective:
          "Usar print() para exibir textos e o caractere # para escrever comentários no código.",
        estimatedMinutes: 10,
        difficulty: 1,
        concept:
          "O caractere # cria um comentário: tudo que vem depois dele, na mesma linha, é ignorado pelo Python. Comentários servem para o programador explicar o próprio código — não mudam o que o programa faz.",
        example: {
          code: '# Este programa mostra uma saudação\nprint("Bem-vindo ao Python do Zero!")',
          explanation:
            "A primeira linha é um comentário e não aparece na saída. Só o print() da segunda linha é executado.",
        },
        challenge: {
          kind: "code",
          id: "ex-2-2",
          title: "Comentando o código",
          difficulty: 2,
          concept: "comentarios",
          conceptId: "comentarios",
          instruction:
            "Escreva um comentário em qualquer linha explicando o que o programa faz e, depois, um print() que exiba exatamente: Python é mais simples do que parece",
          starterCode: '# escreva seu comentário aqui\nprint("")',
          expectedOutput: ["Python é mais simples do que parece"],
          hints: [
            { order: 1, text: "Um comentário começa com #." },
            { order: 2, text: "O comentário não precisa estar correto para o programa funcionar — ele só é ignorado pelo Python." },
            { order: 3, text: 'O print() precisa ser: print("Python é mais simples do que parece")' },
          ],
        },
        summary:
          "print() exibe textos na tela. Comentários (#) documentam o código sem alterar o que ele faz.",
        nextLessonSlug: "sintaxe-basica",
      },
      {
        id: "sintaxe-basica",
        slug: "sintaxe-basica",
        moduleSlug: "primeiro-contato-python",
        order: 3,
        title: "Sintaxe básica: várias linhas",
        objective:
          "Reconhecer que cada print() é uma instrução independente e que a ordem das linhas define a ordem da saída.",
        estimatedMinutes: 12,
        difficulty: 2,
        concept:
          "Um programa Python é executado de cima para baixo, linha por linha. Cada print() gera uma linha de saída, na ordem em que aparece no código.",
        example: {
          code: 'print("Primeira linha")\nprint("Segunda linha")',
          explanation:
            "O Python executa a primeira linha, mostra o texto, e só depois passa para a segunda. Por isso \"Primeira linha\" aparece antes de \"Segunda linha\".",
        },
        challenge: {
          kind: "code",
          id: "ex-2-3",
          title: "Três linhas, em ordem",
          difficulty: 2,
          concept: "sintaxe",
          conceptId: "sintaxe",
          instruction:
            "Escreva três comandos print(), nesta ordem exata: Python do Zero — depois Módulo 2 concluído — depois Vamos para o Módulo 3!",
          starterCode: "",
          expectedOutput: [
            "Python do Zero",
            "Módulo 2 concluído",
            "Vamos para o Módulo 3!",
          ],
          hints: [
            { order: 1, text: "Você vai precisar de três linhas, cada uma com seu próprio print()." },
            { order: 2, text: "A ordem das linhas no código é a ordem em que os textos aparecem na tela." },
            { order: 3, text: 'print("Python do Zero")\\nprint("Módulo 2 concluído")\\nprint("Vamos para o Módulo 3!")' },
          ],
        },
        miniProject: {
          title: "Meu primeiro programa",
          description:
            "Escreva um programa com pelo menos três print(): uma linha se apresentando (nome real ou fictício), uma linha dizendo o que você gosta de fazer, e uma linha de despedida.",
        },
        summary:
          "Cada print() é uma instrução independente, executada na ordem em que aparece. Você já sabe o suficiente para escrever seu primeiro programa completo.",
        nextLessonSlug: null,
      },
    ],
  },
  modulePlaceholder(3, "variaveis", "Variáveis", "Guardar nomes, idades e outras informações em variáveis."),
  modulePlaceholder(4, "entrada-e-saida", "Entrada e saída", "Ler dados digitados pelo usuário com input() e converter tipos."),
  modulePlaceholder(5, "operadores", "Operadores", "Soma, subtração, comparação e operadores lógicos."),
  modulePlaceholder(6, "condicoes", "Condições", "Tomar decisões no código com if, elif e else."),
  modulePlaceholder(7, "repeticoes", "Repetições", "Repetir ações com for e while."),
  modulePlaceholder(8, "listas", "Listas", "Guardar várias informações juntas e percorrê-las."),
  modulePlaceholder(9, "dicionarios", "Dicionários", "Organizar informações em pares de chave e valor."),
  modulePlaceholder(10, "funcoes", "Funções", "Criar blocos de código reutilizáveis."),
  modulePlaceholder(11, "arquivos", "Arquivos", "Ler e salvar informações em arquivos."),
  modulePlaceholder(12, "projeto-final", "Projeto final", "Combinar tudo o que você aprendeu em um projeto completo."),
];

/** Módulo ainda fora do escopo do MVP — aparece na trilha, mas bloqueado (sem aulas cadastradas). */
function modulePlaceholder(
  order: number,
  slug: string,
  title: string,
  description: string,
): Module {
  return { slug, order, title, description, lessons: [] };
}

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

/** Todas as aulas do MVP, em ordem de trilha (usado para calcular progresso geral). */
export function getAllLessonsInOrder() {
  return MODULES.flatMap((m) => m.lessons);
}
