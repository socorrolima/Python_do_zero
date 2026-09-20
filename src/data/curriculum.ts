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
        nextLessonSlug: "o-que-e-uma-variavel",
      },
    ],
  },
  {
    slug: "variaveis",
    order: 3,
    title: "Variáveis",
    description:
      "Guardar nomes, idades e outras informações em variáveis, e conhecer os tipos de dados mais usados.",
    lessons: [
      {
        id: "o-que-e-uma-variavel",
        slug: "o-que-e-uma-variavel",
        moduleSlug: "variaveis",
        order: 1,
        title: "O que é uma variável?",
        objective:
          "Entender o que é uma variável e criar a primeira, guardando um texto nela.",
        estimatedMinutes: 10,
        difficulty: 1,
        concept:
          "Uma variável é um nome que usamos para guardar uma informação, para poder usá-la de novo mais tarde sem reescrever tudo. Para criar uma, escrevemos o nome, o sinal de igual (=) e o valor: isso se chama atribuição — é como colar uma etiqueta com um nome em uma caixa que guarda um valor.",
        example: {
          code: 'nome = "Maria"\nprint(nome)',
          explanation:
            'A variável nome guarda o texto "Maria". Quando usamos print(nome) — sem aspas —, o Python mostra o valor guardado dentro dela, não a palavra "nome".',
        },
        challenge: {
          kind: "code",
          id: "ex-3-1",
          title: "Sua primeira variável",
          difficulty: 1,
          concept: "variaveis",
          conceptId: "variaveis",
          instruction:
            'Crie uma variável chamada cidade, guarde nela o texto "Brasília" e depois mostre o conteúdo dela na tela com print().',
          starterCode: "",
          expectedOutput: ["Brasília"],
          hints: [
            { order: 1, text: "Para criar uma variável, escreva um nome, o sinal = e o valor." },
            { order: 2, text: "Texto sempre vai entre aspas: cidade = \"Brasília\"." },
            { order: 3, text: 'cidade = "Brasília"\\nprint(cidade)' },
          ],
        },
        summary:
          "Uma variável guarda um valor com um nome. Criamos uma com nome = valor, e usamos print(nome_da_variavel), sem aspas, para mostrar o que está guardado nela.",
        nextLessonSlug: "tipos-de-dados",
      },
      {
        id: "tipos-de-dados",
        slug: "tipos-de-dados",
        moduleSlug: "variaveis",
        order: 2,
        title: "Tipos de dados: texto, número e verdadeiro/falso",
        objective:
          "Reconhecer os três tipos de dados mais comuns: texto (string), número e booleano.",
        estimatedMinutes: 12,
        difficulty: 2,
        concept:
          "Nem toda informação é do mesmo tipo. Texto (chamado de string) vai sempre entre aspas, como \"Maria\". Número pode ser inteiro, como 25, ou com casas decimais, como 1.70 — sem aspas. E existe um terceiro tipo, o booleano, que só tem dois valores possíveis: True (verdadeiro) ou False (falso), sempre com a primeira letra maiúscula e sem aspas.",
        example: {
          code: 'nome = "Maria"\nidade = 25\naltura = 1.70\nmaior_de_idade = True\n\nprint(nome)\nprint(idade)\nprint(altura)\nprint(maior_de_idade)',
          explanation:
            "nome é texto (tem aspas), idade é número inteiro, altura é número com casas decimais, e maior_de_idade é um booleano — guarda só True ou False.",
        },
        challenge: {
          kind: "code",
          id: "ex-3-2",
          title: "Três tipos, três variáveis",
          difficulty: 2,
          concept: "tipos-de-dados",
          conceptId: "tipos-de-dados",
          instruction:
            "Crie uma variável idade com o número 30, uma variável tem_animal_de_estimacao com o valor True, e mostre as duas na tela, nessa ordem.",
          starterCode: "",
          expectedOutput: ["30", "True"],
          hints: [
            { order: 1, text: "Número não leva aspas: idade = 30." },
            { order: 2, text: "Booleano também não leva aspas, e começa com letra maiúscula: True." },
            { order: 3, text: "idade = 30\\ntem_animal_de_estimacao = True\\nprint(idade)\\nprint(tem_animal_de_estimacao)" },
          ],
        },
        summary:
          "Texto (string) vai entre aspas, número não leva aspas, e booleano só pode ser True ou False. O tipo do valor muda como o Python o trata, mesmo que a forma de guardá-lo (nome = valor) seja sempre a mesma.",
        nextLessonSlug: "nomes-de-variaveis",
      },
      {
        id: "nomes-de-variaveis",
        slug: "nomes-de-variaveis",
        moduleSlug: "variaveis",
        order: 3,
        title: "Nomes de variáveis e boas práticas",
        objective:
          "Aprender as regras para nomear variáveis em Python e combinar várias variáveis em um mesmo programa.",
        estimatedMinutes: 12,
        difficulty: 2,
        concept:
          "Nem todo nome é permitido para uma variável: o nome não pode começar com número, não pode ter espaço (usamos _ no lugar) e diferencia maiúsculas de minúsculas — Nome e nome são duas variáveis diferentes. Além de válido, um bom nome também é claro: idade diz mais que i ou x sobre o que está guardado ali.",
        example: {
          code: 'nome_completo = "Ana Souza"\nidade = 28\ncidade_natal = "Belém"\n\nprint(nome_completo)\nprint(idade)\nprint(cidade_natal)',
          explanation:
            "nome_completo e cidade_natal usam _ no lugar de espaço, porque um nome de variável não pode ter espaço em branco. Isso deixa o nome válido e ainda fácil de entender.",
        },
        challenge: {
          kind: "code",
          id: "ex-3-3",
          title: "Ficha pessoal, passo a passo",
          difficulty: 3,
          concept: "nomes-de-variaveis",
          conceptId: "nomes-de-variaveis",
          instruction:
            'Crie três variáveis — nome com o texto "Carlos", idade com o número 22, e cidade com o texto "Salvador" — e mostre as três na tela, nessa ordem.',
          starterCode: "",
          expectedOutput: ["Carlos", "22", "Salvador"],
          hints: [
            { order: 1, text: "São três variáveis: uma de texto, uma de número, e outra de texto de novo." },
            { order: 2, text: "Cada print() mostra uma variável — você vai precisar de três print()." },
            { order: 3, text: 'nome = "Carlos"\\nidade = 22\\ncidade = "Salvador"\\nprint(nome)\\nprint(idade)\\nprint(cidade)' },
          ],
        },
        miniProject: {
          title: "Ficha pessoal",
          description:
            "Crie pelo menos quatro variáveis sobre você (ou um personagem inventado): nome, idade, cidade e uma outra informação à sua escolha (profissão, hobby, o que quiser). Depois, mostre todas na tela, uma por linha, formando uma pequena ficha de apresentação.",
        },
        summary:
          "Nomes de variáveis não podem começar com número nem ter espaço, e diferenciam maiúsculas de minúsculas. Um bom nome é válido e também deixa claro o que está guardado ali.",
        nextLessonSlug: "o-que-e-input",
      },
    ],
  },
  {
    slug: "entrada-e-saida",
    order: 4,
    title: "Entrada e saída",
    description:
      "Ler dados digitados pelo usuário com input() e converter tipos.",
    lessons: [
      {
        id: "o-que-e-input",
        slug: "o-que-e-input",
        moduleSlug: "entrada-e-saida",
        order: 1,
        title: "Perguntando ao usuário: input()",
        objective:
          "Usar input() para receber um texto digitado pelo usuário e guardá-lo em uma variável.",
        estimatedMinutes: 12,
        difficulty: 2,
        concept:
          "Até agora, todo valor das suas variáveis já vinha pronto no código. Com input(), o programa pode perguntar algo e esperar que a pessoa digite uma resposta — o valor digitado sempre chega como texto (string), e pode ser guardado em uma variável, igual a qualquer outro valor. No Laboratório deste curso, como não existe um terminal de verdade, você escreve a resposta que o input() vai receber no campo \"Entradas (input)\", antes de executar.",
        example: {
          code: 'print("Qual é o seu nome?")\nnome = input()\nprint(nome)',
          explanation:
            'A primeira linha pergunta algo. A segunda linha, input(), é quem pede a resposta e guarda o que foi digitado na variável nome — num terminal de verdade, o programa pararia exatamente aqui esperando você digitar. Neste Laboratório não existe esse terminal, então essa "espera" já precisa estar respondida antes: escreva a resposta (por exemplo, seu nome) no campo "Entradas (input)", logo abaixo, e só depois clique em Executar. A terceira linha mostra o que foi digitado.',
        },
        challenge: {
          kind: "code",
          id: "ex-4-1",
          title: "Sua primeira pergunta",
          difficulty: 2,
          concept: "input",
          conceptId: "input",
          instruction:
            'Escreva um programa que mostre a pergunta "Qual é a sua cor favorita?", leia a resposta com input() e guarde numa variável chamada cor, e depois mostre o valor de cor na tela. No campo "Entradas (input)", escreva: Azul',
          starterCode: 'print("Qual é a sua cor favorita?")\ncor = input()\nprint(cor)',
          expectedOutput: ["Qual é a sua cor favorita?", "Azul"],
          hints: [
            { order: 1, text: "input() sozinho não pergunta nada na tela — por isso usamos um print() antes, com a pergunta." },
            { order: 2, text: "O valor digitado vai direto para a variável: cor = input()." },
            { order: 3, text: 'print("Qual é a sua cor favorita?")\\ncor = input()\\nprint(cor)' },
          ],
        },
        summary:
          "input() lê um texto digitado pelo usuário e o entrega como string. No Laboratório, a resposta é escrita antes de executar, no campo \"Entradas (input)\".",
        nextLessonSlug: "conversao-de-tipos",
      },
      {
        id: "conversao-de-tipos",
        slug: "conversao-de-tipos",
        moduleSlug: "entrada-e-saida",
        order: 2,
        title: "Convertendo texto em número: int() e float()",
        objective:
          "Entender por que input() sempre devolve texto e usar int()/float() para transformar esse texto em número.",
        estimatedMinutes: 15,
        difficulty: 3,
        concept:
          "Todo valor que vem de input() é sempre texto (string) — mesmo que a pessoa digite só números. Isso é um problema se você quiser fazer conta com esse valor, porque Python não soma texto com número. Para resolver, convertemos o texto em número com int() (para número inteiro) ou float() (para número com casas decimais). Também existe str(), que faz o caminho inverso: transforma um número em texto.",
        example: {
          code: 'idade_texto = input()\nidade = int(idade_texto)\nprint(idade + 1)',
          explanation:
            "idade_texto guarda o que foi digitado, como texto. int(idade_texto) converte esse texto para um número inteiro, guardado em idade. Só depois dessa conversão é possível somar 1 a ela.",
        },
        challenge: {
          kind: "code",
          id: "ex-4-2",
          title: "Somando com o que foi digitado",
          difficulty: 3,
          concept: "conversao-de-tipos",
          conceptId: "conversao-de-tipos",
          instruction:
            'Leia um número com input(), converta para inteiro com int() e guarde numa variável chamada numero. Depois mostre o resultado de numero + 10 na tela. No campo "Entradas (input)", escreva: 5',
          starterCode: "numero_texto = input()\nnumero = int(numero_texto)\nprint(numero + 10)",
          expectedOutput: ["15"],
          hints: [
            { order: 1, text: "input() devolve texto, mesmo quando a pessoa digita um número — por isso precisa de int()." },
            { order: 2, text: "Primeiro converta com int(), guardando o resultado em uma variável, depois some 10 a ela." },
            { order: 3, text: 'numero_texto = input()\\nnumero = int(numero_texto)\\nprint(numero + 10)' },
          ],
        },
        summary:
          "input() sempre devolve texto. Para fazer contas com o valor digitado, converta com int() (número inteiro) ou float() (número decimal) antes de usar.",
        nextLessonSlug: "combinando-varios-input",
      },
      {
        id: "combinando-varios-input",
        slug: "combinando-varios-input",
        moduleSlug: "entrada-e-saida",
        order: 3,
        title: "Combinando várias perguntas",
        objective:
          "Usar mais de um input() no mesmo programa para montar um pequeno cadastro.",
        estimatedMinutes: 15,
        difficulty: 3,
        concept:
          "Um programa pode ter quantos input() forem necessários — cada chamada espera uma nova resposta, na ordem em que aparece no código. É assim que se constrói um cadastro: uma pergunta de cada vez, cada resposta guardada em sua própria variável, para depois combinar tudo em uma mensagem final.",
        example: {
          code: 'print("Qual é o seu nome?")\nnome = input()\nprint("Qual é a sua idade?")\nidade = int(input())\nprint(nome)\nprint(idade)',
          explanation:
            "O programa faz duas perguntas, na ordem: primeiro o nome, depois a idade — já convertida direto com int(input()), sem precisar de uma variável intermediária para o texto.",
        },
        challenge: {
          kind: "code",
          id: "ex-4-3",
          title: "Cadastro simples: nome e idade",
          difficulty: 4,
          concept: "combinando-input",
          conceptId: "combinando-input",
          instruction:
            'Peça o nome (print da pergunta + input()) e a idade (print da pergunta + int(input())), nessa ordem, e depois mostre nome e idade, um em cada linha. No campo "Entradas (input)", escreva em duas linhas: Ana e depois 30',
          starterCode:
            'print("Qual é o seu nome?")\nnome = input()\nprint("Qual é a sua idade?")\nidade = int(input())\nprint(nome)\nprint(idade)',
          expectedOutput: ["Qual é o seu nome?", "Qual é a sua idade?", "Ana", "30"],
          hints: [
            { order: 1, text: "Cada input() consome uma linha do campo \"Entradas (input)\", na ordem em que aparecem no código." },
            { order: 2, text: "A idade precisa ser convertida com int() para virar número." },
            { order: 3, text: 'print("Qual é o seu nome?")\\nnome = input()\\nprint("Qual é a sua idade?")\\nidade = int(input())\\nprint(nome)\\nprint(idade)' },
          ],
        },
        miniProject: {
          title: "Cadastro simples",
          description:
            "Monte um pequeno cadastro que peça nome, idade e cidade (três input(), um por vez), convertendo a idade para número, e depois mostre as três informações juntas, formando um pequeno resumo do cadastro.",
        },
        summary:
          "Um programa pode combinar vários input() em sequência, cada um guardado em sua própria variável, para montar um cadastro completo.",
        nextLessonSlug: "operadores-aritmeticos",
      },
    ],
  },
  {
    slug: "operadores",
    order: 5,
    title: "Operadores",
    description:
      "Soma, subtração, comparação e operadores lógicos.",
    lessons: [
      {
        id: "operadores-aritmeticos",
        slug: "operadores-aritmeticos",
        moduleSlug: "operadores",
        order: 1,
        title: "Operadores aritméticos",
        objective:
          "Usar +, -, *, /, // e % para fazer contas em Python.",
        estimatedMinutes: 15,
        difficulty: 2,
        concept:
          "Python tem os operadores matemáticos de sempre: + (soma), - (subtração), * (multiplicação) e / (divisão, que sempre devolve um número decimal). Também tem dois operadores próprios: // (divisão inteira, que descarta a parte decimal) e % (módulo, o resto de uma divisão) — por exemplo, 7 % 2 é 1, porque 7 dividido por 2 dá resto 1.",
        example: {
          code: "a = 7\nb = 2\n\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a / b)\nprint(a // b)\nprint(a % b)",
          explanation:
            "a / b devolve 3.5 (divisão normal), a // b devolve 3 (só a parte inteira), e a % b devolve 1 (o resto da divisão).",
        },
        challenge: {
          kind: "code",
          id: "ex-5-1",
          title: "As seis operações",
          difficulty: 2,
          concept: "operadores-aritmeticos",
          conceptId: "operadores-aritmeticos",
          instruction:
            "Crie duas variáveis, a = 10 e b = 3, e mostre nessa ordem: a soma, a subtração, a multiplicação, a divisão, a divisão inteira e o módulo entre elas.",
          starterCode: "a = 10\nb = 3\n\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a / b)\nprint(a // b)\nprint(a % b)",
          expectedOutput: ["13", "7", "30", "3.3333333333333335", "3", "1"],
          hints: [
            { order: 1, text: "São seis print(), um para cada operador: + - * / // %." },
            { order: 2, text: "A ordem pedida é: soma, subtração, multiplicação, divisão, divisão inteira, módulo." },
            { order: 3, text: "a = 10\\nb = 3\\nprint(a + b)\\nprint(a - b)\\nprint(a * b)\\nprint(a / b)\\nprint(a // b)\\nprint(a % b)" },
          ],
        },
        summary:
          "+ - * / fazem as quatro operações básicas (/ sempre devolve decimal). // devolve só a parte inteira da divisão, e % devolve o resto.",
        nextLessonSlug: "operadores-de-comparacao",
      },
      {
        id: "operadores-de-comparacao",
        slug: "operadores-de-comparacao",
        moduleSlug: "operadores",
        order: 2,
        title: "Operadores de comparação",
        objective:
          "Comparar valores com ==, !=, >, <, >= e <=, obtendo um resultado booleano.",
        estimatedMinutes: 12,
        difficulty: 2,
        concept:
          "Operadores de comparação comparam dois valores e o resultado é sempre um booleano: True ou False. == verifica se são iguais (repare: são dois sinais de igual — um só, =, é usado para criar variáveis, não para comparar). != verifica se são diferentes. >, <, >= e <= comparam qual é maior, menor, maior-ou-igual e menor-ou-igual.",
        example: {
          code: "idade = 20\n\nprint(idade == 18)\nprint(idade != 18)\nprint(idade >= 18)",
          explanation:
            "idade == 18 é False (20 não é igual a 18). idade != 18 é True (são diferentes). idade >= 18 é True (20 é maior ou igual a 18).",
        },
        challenge: {
          kind: "code",
          id: "ex-5-2",
          title: "Comparando dois números",
          difficulty: 3,
          concept: "operadores-de-comparacao",
          conceptId: "operadores-de-comparacao",
          instruction:
            "Crie x = 15 e y = 20, e mostre nessa ordem: se x é igual a y, se x é diferente de y, e se x é menor que y.",
          starterCode: "x = 15\ny = 20\n\nprint(x == y)\nprint(x != y)\nprint(x < y)",
          expectedOutput: ["False", "True", "True"],
          hints: [
            { order: 1, text: "Igualdade usa dois sinais de igual: ==." },
            { order: 2, text: "Diferença usa !=, e \"menor que\" usa <." },
            { order: 3, text: "x = 15\\ny = 20\\nprint(x == y)\\nprint(x != y)\\nprint(x < y)" },
          ],
        },
        summary:
          "== compara igualdade (não confunda com =, que atribui um valor). !=, >, <, >= e <= completam as comparações, sempre devolvendo True ou False.",
        nextLessonSlug: "operadores-logicos",
      },
      {
        id: "operadores-logicos",
        slug: "operadores-logicos",
        moduleSlug: "operadores",
        order: 3,
        title: "Operadores lógicos: and, or, not",
        objective:
          "Combinar mais de uma condição usando and, or e not.",
        estimatedMinutes: 15,
        difficulty: 3,
        concept:
          "Operadores lógicos combinam valores booleanos. and é True só quando as duas condições são True. or é True quando pelo menos uma das duas é True. not inverte o valor: not True vira False, e vice-versa.",
        example: {
          code: "idade = 25\ntem_carteira = True\n\nprint(idade >= 18 and tem_carteira)\nprint(idade >= 18 or tem_carteira)\nprint(not tem_carteira)",
          explanation:
            "idade >= 18 and tem_carteira é True porque as duas partes são True. not tem_carteira inverte True para False.",
        },
        challenge: {
          kind: "code",
          id: "ex-5-3",
          title: "Calculadora com operadores lógicos",
          difficulty: 4,
          concept: "operadores-logicos",
          conceptId: "operadores-logicos",
          instruction:
            "Crie nota1 = 8 e nota2 = 4. Mostre, nessa ordem: se as duas notas são maiores ou iguais a 5 (and), e se pelo menos uma delas é maior ou igual a 5 (or).",
          starterCode: "nota1 = 8\nnota2 = 4\n\nprint(nota1 >= 5 and nota2 >= 5)\nprint(nota1 >= 5 or nota2 >= 5)",
          expectedOutput: ["False", "True"],
          hints: [
            { order: 1, text: "and exige que as duas condições sejam True para o resultado ser True." },
            { order: 2, text: "or só precisa que uma das duas seja True." },
            { order: 3, text: "nota1 = 8\\nnota2 = 4\\nprint(nota1 >= 5 and nota2 >= 5)\\nprint(nota1 >= 5 or nota2 >= 5)" },
          ],
        },
        miniProject: {
          title: "Calculadora",
          description:
            "Peça dois números com input() (convertidos com float()) e uma operação (soma, subtração, multiplicação ou divisão, digitada como texto). Use os operadores aritméticos para calcular e mostrar o resultado.",
        },
        summary:
          "and exige que todas as condições sejam True. or basta uma ser True. not inverte um valor booleano.",
        nextLessonSlug: "if-else",
      },
    ],
  },
  {
    slug: "condicoes",
    order: 6,
    title: "Condições",
    description:
      "Tomar decisões no código com if, elif e else.",
    lessons: [
      {
        id: "if-else",
        slug: "if-else",
        moduleSlug: "condicoes",
        order: 1,
        title: "Tomando decisões: if e else",
        objective:
          "Usar if para executar um bloco de código só quando uma condição é verdadeira, e else para o caso contrário.",
        estimatedMinutes: 15,
        difficulty: 3,
        concept:
          "if executa um bloco de código somente se a condição depois dele for True. O bloco é indicado por indentação (espaços no início da linha) — tudo indentado logo abaixo do if faz parte dele. else define o que acontece quando a condição é False.",
        example: {
          code: 'idade = 16\n\nif idade >= 18:\n    print("Pode dirigir")\nelse:\n    print("Ainda não pode dirigir")',
          explanation:
            "Como idade (16) não é maior ou igual a 18, a condição do if é False, então o Python executa o bloco do else.",
        },
        challenge: {
          kind: "code",
          id: "ex-6-1",
          title: "Par ou ímpar",
          difficulty: 3,
          concept: "if-else",
          conceptId: "if-else",
          instruction:
            'Crie numero = 8. Use if/else com o operador % para mostrar "Par" se o número for par (resto da divisão por 2 igual a 0), ou "Ímpar" caso contrário.',
          starterCode: 'numero = 8\n\nif numero % 2 == 0:\n    print("Par")\nelse:\n    print("Ímpar")',
          expectedOutput: ["Par"],
          hints: [
            { order: 1, text: "Um número é par quando o resto da divisão por 2 é 0 — use o operador %." },
            { order: 2, text: "A condição do if precisa comparar numero % 2 com 0, usando ==." },
            { order: 3, text: 'numero = 8\\n\\nif numero % 2 == 0:\\n    print("Par")\\nelse:\\n    print("Ímpar")' },
          ],
        },
        summary:
          "if executa um bloco quando a condição é True; else cobre o caso False. O bloco de cada um é definido pela indentação.",
        nextLessonSlug: "elif",
      },
      {
        id: "elif",
        slug: "elif",
        moduleSlug: "condicoes",
        order: 2,
        title: "Mais de duas opções: elif",
        objective:
          "Usar elif para verificar várias condições em sequência, além do if e do else.",
        estimatedMinutes: 15,
        difficulty: 3,
        concept:
          "Quando existem mais de duas possibilidades, elif (abreviação de \"else if\") entra entre o if e o else. O Python testa as condições na ordem: se a do if for False, tenta o elif; se todas forem False, executa o else. Só o primeiro bloco cuja condição for True é executado.",
        example: {
          code: 'nota = 7\n\nif nota >= 9:\n    print("Excelente")\nelif nota >= 7:\n    print("Bom")\nelse:\n    print("Precisa melhorar")',
          explanation:
            "nota (7) não é maior ou igual a 9, então o Python testa o elif: 7 >= 7 é True, então mostra \"Bom\" e para por aí, sem chegar a testar o else.",
        },
        challenge: {
          kind: "code",
          id: "ex-6-2",
          title: "Classificando uma nota",
          difficulty: 4,
          concept: "elif",
          conceptId: "elif",
          instruction:
            'Crie nota = 5. Use if/elif/else para mostrar "Aprovado" se nota >= 7, "Recuperação" se nota >= 5, ou "Reprovado" caso contrário.',
          starterCode:
            'nota = 5\n\nif nota >= 7:\n    print("Aprovado")\nelif nota >= 5:\n    print("Recuperação")\nelse:\n    print("Reprovado")',
          expectedOutput: ["Recuperação"],
          hints: [
            { order: 1, text: "São três resultados possíveis, então você precisa de if, elif e else." },
            { order: 2, text: "A ordem importa: teste primeiro >= 7, depois >= 5 — assim uma nota 8 não cai no elif por engano." },
            { order: 3, text: 'nota = 5\\n\\nif nota >= 7:\\n    print("Aprovado")\\nelif nota >= 5:\\n    print("Recuperação")\\nelse:\\n    print("Reprovado")' },
          ],
        },
        summary:
          "elif permite testar várias condições em sequência entre o if e o else. Apenas o primeiro bloco True é executado.",
        nextLessonSlug: "condicoes-compostas",
      },
      {
        id: "condicoes-compostas",
        slug: "condicoes-compostas",
        moduleSlug: "condicoes",
        order: 3,
        title: "Condições compostas",
        objective:
          "Combinar and, or e not dentro de um if para verificar mais de uma regra ao mesmo tempo.",
        estimatedMinutes: 15,
        difficulty: 4,
        concept:
          "As condições de um if podem combinar and, or e not, exatamente como você já viu no módulo de operadores. Isso permite verificar várias regras de uma vez só — por exemplo, exigir que duas condições sejam verdadeiras ao mesmo tempo para liberar algo.",
        example: {
          code: 'idade = 20\ntem_documento = True\n\nif idade >= 18 and tem_documento:\n    print("Entrada liberada")\nelse:\n    print("Entrada negada")',
          explanation:
            "As duas condições — idade >= 18 e tem_documento — precisam ser True ao mesmo tempo (and) para o bloco do if ser executado.",
        },
        challenge: {
          kind: "code",
          id: "ex-6-3",
          title: "Verificador de idade",
          difficulty: 4,
          concept: "condicoes-compostas",
          conceptId: "condicoes-compostas",
          instruction:
            'Crie idade = 16. Use if/else com and para mostrar "Pode entrar" se a idade for maior ou igual a 12 e menor que 18, ou "Não se aplica" caso contrário.',
          starterCode:
            'idade = 16\n\nif idade >= 12 and idade < 18:\n    print("Pode entrar")\nelse:\n    print("Não se aplica")',
          expectedOutput: ["Pode entrar"],
          hints: [
            { order: 1, text: "Você precisa de duas comparações combinadas com and: uma para o limite de baixo, outra para o de cima." },
            { order: 2, text: "idade >= 12 and idade < 18 é True só quando as duas partes forem True." },
            { order: 3, text: 'idade = 16\\n\\nif idade >= 12 and idade < 18:\\n    print("Pode entrar")\\nelse:\\n    print("Não se aplica")' },
          ],
        },
        miniProject: {
          title: "Verificador de idade",
          description:
            "Peça a idade da pessoa com input() (convertida com int()) e use if/elif/else para classificar: \"Criança\" (menor que 12), \"Adolescente\" (de 12 a 17) ou \"Adulto\" (18 ou mais), mostrando o resultado na tela.",
        },
        summary:
          "and, or e not podem ser combinados dentro da condição de um if para verificar várias regras ao mesmo tempo.",
        nextLessonSlug: null,
      },
    ],
  },
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
