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
          title: "Um comentário no meio do caminho",
          difficulty: 2,
          concept: "comentarios",
          conceptId: "comentarios",
          instruction:
            "Escreva um print() que mostre exatamente: Aprendendo Python aos poucos. Depois, escreva um comentário (começando com #) dizendo por que comentários são úteis. Por fim, escreva outro print() que mostre exatamente: Comentários não mudam o que o programa faz",
          starterCode: "",
          expectedOutput: ["Aprendendo Python aos poucos", "Comentários não mudam o que o programa faz"],
          hints: [
            { order: 1, text: "São dois print() com um comentário (#) entre eles — o comentário não aparece na saída." },
            { order: 2, text: "O comentário do meio pode dizer qualquer coisa: ele só é ignorado pelo Python." },
            { order: 3, text: 'print("Aprendendo Python aos poucos")\\n# comentários ajudam quem lê o código depois\\nprint("Comentários não mudam o que o programa faz")' },
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
          title: "Arrumando a ordem das linhas",
          difficulty: 2,
          concept: "sintaxe",
          conceptId: "sintaxe",
          instruction:
            "O código abaixo tem três print() certos, mas na ordem errada. Reordene as linhas para que a saída apareça exatamente nesta ordem: Começando o Módulo 2 — depois Aprendendo sobre print() — depois Módulo 2 concluído!",
          starterCode: 'print("Módulo 2 concluído!")\nprint("Começando o Módulo 2")\nprint("Aprendendo sobre print()")',
          expectedOutput: [
            "Começando o Módulo 2",
            "Aprendendo sobre print()",
            "Módulo 2 concluído!",
          ],
          hints: [
            { order: 1, text: "O Python executa as linhas de cima para baixo — a ordem no código é a ordem na tela." },
            { order: 2, text: "Coloque \"Começando o Módulo 2\" primeiro, depois \"Aprendendo sobre print()\", e \"Módulo 2 concluído!\" por último." },
            { order: 3, text: 'print("Começando o Módulo 2")\\nprint("Aprendendo sobre print()")\\nprint("Módulo 2 concluído!")' },
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
          title: "Corrigindo o print() da variável",
          difficulty: 1,
          concept: "variaveis",
          conceptId: "variaveis",
          instruction:
            'O código abaixo queria mostrar o valor da variável cidade, mas tem um erro: as aspas em volta de "cidade" dentro do print() fazem o Python mostrar a palavra "cidade" em vez do valor guardado nela. Corrija o print() para mostrar o valor de verdade.',
          starterCode: 'cidade = "Recife"\nprint("cidade")',
          expectedOutput: ["Recife"],
          hints: [
            { order: 1, text: "Nome de variável não leva aspas quando usado dentro do print() — aspas viram texto literal." },
            { order: 2, text: "Tire as aspas de dentro do print(), deixando só cidade." },
            { order: 3, text: 'cidade = "Recife"\\nprint(cidade)' },
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
          title: "Corrigindo os tipos errados",
          difficulty: 2,
          concept: "tipos-de-dados",
          conceptId: "tipos-de-dados",
          instruction:
            "O código abaixo tenta guardar um número e um valor booleano, mas tem dois erros de tipo. Corrija-os (idade deve ser o número 22, sem aspas; ativo deve ser o booleano True, com T maiúsculo e sem aspas) e mostre as duas variáveis, nessa ordem.",
          starterCode: 'idade = "22"\nativo = true\nprint(idade)\nprint(ativo)',
          expectedOutput: ["22", "True"],
          hints: [
            { order: 1, text: "Número não leva aspas — se idade tiver aspas, ela vira texto, não número." },
            { order: 2, text: "Booleano em Python começa com letra maiúscula: True, não true." },
            { order: 3, text: "idade = 22\\nativo = True\\nprint(idade)\\nprint(ativo)" },
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
          title: "Corrigindo um nome de variável inválido",
          difficulty: 3,
          concept: "nomes-de-variaveis",
          conceptId: "nomes-de-variaveis",
          instruction:
            "O código abaixo não funciona porque um nome de variável é inválido (começa com número). Corrija o nome da variável, sem tirar o valor que ela guarda, para que o programa rode e mostre nome, idade e cidade_natal, nessa ordem.",
          starterCode: '1nome = "Beatriz"\nidade = 26\ncidade_natal = "Manaus"\nprint(1nome)\nprint(idade)\nprint(cidade_natal)',
          expectedOutput: ["Beatriz", "26", "Manaus"],
          hints: [
            { order: 1, text: "Um nome de variável não pode começar com número." },
            { order: 2, text: "Troque 1nome por um nome válido, como nome — e lembre de trocar nos dois lugares (na criação e no print())." },
            { order: 3, text: 'nome = "Beatriz"\\nidade = 26\\ncidade_natal = "Manaus"\\nprint(nome)\\nprint(idade)\\nprint(cidade_natal)' },
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
          title: "A pergunta que ficou para trás",
          difficulty: 2,
          concept: "input",
          conceptId: "input",
          instruction:
            'O código abaixo lê a resposta antes de fazer a pergunta — quem for usar o programa não vai saber o que responder. Reorganize as linhas para que a pergunta apareça antes do input(), na ordem certa. No campo "Entradas (input)", escreva: Verde',
          starterCode: 'cor = input()\nprint("Qual é a sua cor favorita?")\nprint(cor)',
          expectedOutput: ["Qual é a sua cor favorita?", "Verde"],
          hints: [
            { order: 1, text: "input() não mostra pergunta nenhuma sozinho — por isso a pergunta precisa vir antes, em um print()." },
            { order: 2, text: "Troque a ordem: primeiro o print() da pergunta, depois o cor = input()." },
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
          title: "Por que esse código dá erro?",
          difficulty: 3,
          concept: "conversao-de-tipos",
          conceptId: "conversao-de-tipos",
          instruction:
            'O código abaixo dá erro ao tentar somar o número digitado com 10 — porque input() sempre devolve texto, e Python não soma texto com número. Corrija adicionando a conversão que falta, para mostrar o resultado da soma. No campo "Entradas (input)", escreva: 8',
          starterCode: "numero = input()\nprint(numero + 10)",
          expectedOutput: ["18"],
          hints: [
            { order: 1, text: "O erro acontece porque numero ainda é texto quando você tenta somar 10 a ele." },
            { order: 2, text: "Adicione int() na hora de guardar o valor: numero = int(input())." },
            { order: 3, text: 'numero = int(input())\\nprint(numero + 10)' },
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
          title: "Cadastro com três perguntas",
          difficulty: 4,
          concept: "combinando-input",
          conceptId: "combinando-input",
          instruction:
            'Peça, nessa ordem, com um print() de pergunta antes de cada input(): onde a pessoa mora (cidade, sem conversão), o nome dela (sem conversão) e a idade (convertida com int()). Depois, mostre as três informações, na mesma ordem em que foram perguntadas. No campo "Entradas (input)", escreva em três linhas: Recife, depois Beatriz, depois 26',
          starterCode: "",
          expectedOutput: ["Onde você mora?", "Qual é o seu nome?", "Qual é a sua idade?", "Recife", "Beatriz", "26"],
          hints: [
            { order: 1, text: "São três perguntas, então três pares de print() + input(), na ordem pedida: cidade, nome, idade." },
            { order: 2, text: "Só a idade precisa de conversão: idade = int(input())." },
            { order: 3, text: 'print("Onde você mora?")\\ncidade = input()\\nprint("Qual é o seu nome?")\\nnome = input()\\nprint("Qual é a sua idade?")\\nidade = int(input())\\nprint(cidade)\\nprint(nome)\\nprint(idade)' },
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
          title: "Dividindo a conta do restaurante",
          difficulty: 2,
          concept: "operadores-aritmeticos",
          conceptId: "operadores-aritmeticos",
          instruction:
            "Uma conta de restaurante deu total = 87 (reais) e vai ser dividida entre pessoas = 4. Mostre, nessa ordem: quanto cada pessoa paga se dividir exatamente (use /), quantos reais inteiros cada pessoa paga se ninguém quiser usar centavos (use //), e quantos reais sobram nessa divisão sem centavos (use %).",
          starterCode: "",
          expectedOutput: ["21.75", "21", "3"],
          hints: [
            { order: 1, text: "/ sempre devolve um valor com casas decimais, mesmo quando dá um número exato." },
            { order: 2, text: "// devolve só a parte inteira da divisão, descartando as casas decimais." },
            { order: 3, text: "total = 87\\npessoas = 4\\nprint(total / pessoas)\\nprint(total // pessoas)\\nprint(total % pessoas)" },
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
          title: "Estoque suficiente para a venda?",
          difficulty: 3,
          concept: "operadores-de-comparacao",
          conceptId: "operadores-de-comparacao",
          instruction:
            "Uma loja tem estoque = 5 unidades de um produto, e um cliente quer comprar quantidade = 5. Mostre, nessa ordem: se o estoque é igual à quantidade pedida (==), se é diferente (!=), e se o estoque é maior ou igual à quantidade pedida (>=).",
          starterCode: "",
          expectedOutput: ["True", "False", "True"],
          hints: [
            { order: 1, text: "== compara igualdade — repare que são dois sinais de igual, diferente do = que cria variáveis." },
            { order: 2, text: ">= é verdadeiro tanto quando é maior quanto quando é exatamente igual." },
            { order: 3, text: "estoque = 5\\nquantidade = 5\\nprint(estoque == quantidade)\\nprint(estoque != quantidade)\\nprint(estoque >= quantidade)" },
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
          title: "Liberando o acesso",
          difficulty: 4,
          concept: "operadores-logicos",
          conceptId: "operadores-logicos",
          instruction:
            "Um sistema só libera acesso quando a pessoa tem cadastro E não está com pagamento atrasado. Crie tem_cadastro = True e atraso = True, e mostre, nessa ordem: se a pessoa tem cadastro e não está atrasada ao mesmo tempo (tem_cadastro and not atraso), e o valor de not atraso sozinho.",
          starterCode: "",
          expectedOutput: ["False", "False"],
          hints: [
            { order: 1, text: "not inverte um valor booleano: not True vira False." },
            { order: 2, text: "tem_cadastro and not atraso só é True quando tem cadastro E não está atrasado ao mesmo tempo." },
            { order: 3, text: "tem_cadastro = True\\natraso = True\\nprint(tem_cadastro and not atraso)\\nprint(not atraso)" },
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
          title: "O aniversário que ficou de fora",
          difficulty: 3,
          concept: "if-else",
          conceptId: "if-else",
          instruction:
            'O código abaixo deveria mostrar "Maior de idade" para quem tem 18 anos ou mais, mas tem um erro de comparação: ele só considera maior de idade quem tem MAIS de 18, deixando quem tem exatamente 18 de fora. Corrija a condição do if para incluir também quem tem exatamente 18 anos, mantendo idade = 18.',
          starterCode: 'idade = 18\n\nif idade > 18:\n    print("Maior de idade")\nelse:\n    print("Menor de idade")',
          expectedOutput: ["Maior de idade"],
          hints: [
            { order: 1, text: "> não inclui o valor exato — só quem é estritamente maior." },
            { order: 2, text: "Para incluir também quem tem exatamente 18, troque > por >=." },
            { order: 3, text: 'idade = 18\\n\\nif idade >= 18:\\n    print("Maior de idade")\\nelse:\\n    print("Menor de idade")' },
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
          title: "Os testes na ordem errada",
          difficulty: 4,
          concept: "elif",
          conceptId: "elif",
          instruction:
            'O código abaixo queria classificar uma temperatura em "Quente" (30 ou mais), "Ameno" (20 ou mais) ou "Frio" (menos que 20), mas os testes estão na ordem errada — por isso uma temperatura de 35 graus está caindo em "Ameno". Reordene as condições de if/elif para que a classificação fique correta, mantendo temperatura = 35.',
          starterCode: 'temperatura = 35\n\nif temperatura >= 20:\n    print("Ameno")\nelif temperatura >= 30:\n    print("Quente")\nelse:\n    print("Frio")',
          expectedOutput: ["Quente"],
          hints: [
            { order: 1, text: "O Python para no primeiro bloco cuja condição for True — se o teste mais largo (>= 20) vier primeiro, ele nunca chega a testar o mais específico (>= 30)." },
            { order: 2, text: "Teste sempre do mais específico para o mais geral: primeiro >= 30, depois >= 20." },
            { order: 3, text: 'temperatura = 35\\n\\nif temperatura >= 30:\\n    print("Quente")\\nelif temperatura >= 20:\\n    print("Ameno")\\nelse:\\n    print("Frio")' },
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
          title: "Desconto para estudante ou idoso",
          difficulty: 4,
          concept: "condicoes-compostas",
          conceptId: "condicoes-compostas",
          instruction:
            'Uma promoção dá desconto para clientes que são estudantes (estudante = True) OU que têm mais de 60 anos (idade > 60). Crie estudante = False e idade = 65, e use if/else com or para mostrar "Tem desconto" ou "Sem desconto".',
          starterCode: "",
          expectedOutput: ["Tem desconto"],
          hints: [
            { order: 1, text: "or é True quando pelo menos uma das duas condições for True." },
            { order: 2, text: "Aqui, estudante é False, mas idade > 60 é True — então o or inteiro já é True." },
            { order: 3, text: 'estudante = False\\nidade = 65\\n\\nif estudante or idade > 60:\\n    print("Tem desconto")\\nelse:\\n    print("Sem desconto")' },
          ],
        },
        miniProject: {
          title: "Verificador de idade",
          description:
            "Peça a idade da pessoa com input() (convertida com int()) e use if/elif/else para classificar: \"Criança\" (menor que 12), \"Adolescente\" (de 12 a 17) ou \"Adulto\" (18 ou mais), mostrando o resultado na tela.",
        },
        summary:
          "and, or e not podem ser combinados dentro da condição de um if para verificar várias regras ao mesmo tempo.",
        nextLessonSlug: "for-e-range",
      },
    ],
  },
  {
    slug: "repeticoes",
    order: 7,
    title: "Repetições",
    description: "Repetir ações com for e while.",
    lessons: [
      {
        id: "for-e-range",
        slug: "for-e-range",
        moduleSlug: "repeticoes",
        order: 1,
        title: "Repetindo com for e range()",
        objective:
          "Usar for e range() para repetir um bloco de código um número definido de vezes.",
        estimatedMinutes: 15,
        difficulty: 3,
        concept:
          "for repete um bloco de código uma vez para cada valor de uma sequência. range(inicio, fim) gera uma sequência de números inteiros de inicio até fim, sem incluir o fim — por exemplo, range(1, 4) gera 1, 2 e 3. A cada repetição, o valor atual fica guardado na variável do for.",
        example: {
          code: "for numero in range(1, 4):\n    print(numero)",
          explanation:
            "range(1, 4) gera 1, 2 e 3 (o 4 não entra). O for repete o bloco indentado uma vez para cada um desses valores, guardando-o em numero a cada volta.",
        },
        challenge: {
          kind: "code",
          id: "ex-7-1",
          title: "Múltiplos de 3",
          difficulty: 3,
          concept: "for-range",
          conceptId: "for-range",
          instruction:
            "Use for com range() para mostrar os cinco primeiros múltiplos de 3 (ou seja, 3, 6, 9, 12 e 15), um por linha — sem escrever esses números direto no código: calcule cada um dentro do for.",
          starterCode: "",
          expectedOutput: ["3", "6", "9", "12", "15"],
          hints: [
            { order: 1, text: "range(1, 6) gera 1, 2, 3, 4 e 5 — os multiplicadores que você precisa." },
            { order: 2, text: "Dentro do for, multiplique o número do range por 3: print(numero * 3)." },
            { order: 3, text: "for numero in range(1, 6):\\n    print(numero * 3)" },
          ],
        },
        summary:
          "for numero in range(inicio, fim) repete um bloco uma vez para cada número de inicio até fim - 1, guardando o valor atual na variável a cada volta.",
        nextLessonSlug: "while",
      },
      {
        id: "while",
        slug: "while",
        moduleSlug: "repeticoes",
        order: 2,
        title: "Repetindo enquanto uma condição for verdadeira: while",
        objective:
          "Usar while para repetir um bloco enquanto uma condição continuar True, e evitar loops infinitos.",
        estimatedMinutes: 15,
        difficulty: 3,
        concept:
          "while repete um bloco enquanto a condição dele for True — diferente do for, não é preciso saber de antemão quantas vezes vai repetir. Isso exige cuidado: alguma coisa usada na condição precisa mudar dentro do bloco, ou a condição nunca vira False e o programa entra em loop infinito (trava para sempre).",
        example: {
          code: "contador = 1\nwhile contador <= 3:\n    print(contador)\n    contador = contador + 1",
          explanation:
            "contador começa em 1. Enquanto contador <= 3 for True, o bloco roda: mostra o valor e soma 1 a contador. Quando contador chega a 4, a condição vira False e o loop para.",
        },
        challenge: {
          kind: "code",
          id: "ex-7-2",
          title: "Dobrando o valor",
          difficulty: 3,
          concept: "while",
          conceptId: "while",
          instruction:
            "Crie valor = 1 e use while para dobrar esse valor (valor = valor * 2) e mostrá-lo a cada volta, repetindo enquanto o valor (antes de dobrar) for menor que 16. A saída deve ser: 2, 4, 8 e 16, um valor por linha.",
          starterCode: "",
          expectedOutput: ["2", "4", "8", "16"],
          hints: [
            { order: 1, text: "A condição do while é sobre o valor de ANTES de dobrar — só depois disso ele dobra e você mostra o resultado." },
            { order: 2, text: "Dentro do while: primeiro valor = valor * 2, depois print(valor)." },
            { order: 3, text: "valor = 1\\nwhile valor < 16:\\n    valor = valor * 2\\n    print(valor)" },
          ],
        },
        summary:
          "while repete um bloco enquanto a condição for True. É essencial que algo dentro do bloco mude o valor usado na condição, para o loop eventualmente parar.",
        nextLessonSlug: "contadores-e-acumuladores",
      },
      {
        id: "contadores-e-acumuladores",
        slug: "contadores-e-acumuladores",
        moduleSlug: "repeticoes",
        order: 3,
        title: "Contadores e acumuladores",
        objective:
          "Usar uma variável para somar valores ao longo de um loop (acumulador).",
        estimatedMinutes: 15,
        difficulty: 4,
        concept:
          "Um acumulador é uma variável criada antes do loop (geralmente com valor 0) que vai recebendo novos valores somados a ela dentro do loop, a cada volta — no final, guarda o total. O padrão é sempre o mesmo: variavel = variavel + algo, repetido a cada iteração.",
        example: {
          code: "soma = 0\nfor numero in range(1, 5):\n    soma = soma + numero\nprint(soma)",
          explanation:
            "soma começa em 0. A cada volta do for, soma recebe soma + numero. No final das voltas (1, 2, 3 e 4), soma guarda 1 + 2 + 3 + 4 = 10.",
        },
        challenge: {
          kind: "code",
          id: "ex-7-3",
          title: "Calculando um fatorial",
          difficulty: 4,
          concept: "acumulador",
          conceptId: "acumulador",
          instruction:
            "Crie produto = 1 (não 0!) e use for com range() para multiplicar todos os números de 1 a 5 nessa variável (o fatorial de 5). Depois, mostre apenas o resultado final.",
          starterCode: "",
          expectedOutput: ["120"],
          hints: [
            { order: 1, text: "Um acumulador de produto começa em 1, não em 0 — começar em 0 faria tudo virar 0." },
            { order: 2, text: "Dentro do for, multiplique: produto = produto * numero." },
            { order: 3, text: "produto = 1\\nfor numero in range(1, 6):\\n    produto = produto * numero\\nprint(produto)" },
          ],
        },
        miniProject: {
          title: "Tabuada",
          description:
            "Peça um número com input() (convertido com int()) e use for com range(1, 11) para mostrar a tabuada desse número, uma linha por multiplicação (por exemplo: \"3 x 1 = 3\", \"3 x 2 = 6\", e assim por diante até 3 x 10).",
        },
        summary:
          "Um acumulador é uma variável iniciada antes do loop que vai somando valores a cada volta, guardando o total no final.",
        nextLessonSlug: "criando-listas",
      },
    ],
  },
  {
    slug: "listas",
    order: 8,
    title: "Listas",
    description: "Guardar várias informações juntas e percorrê-las.",
    lessons: [
      {
        id: "criando-listas",
        slug: "criando-listas",
        moduleSlug: "listas",
        order: 1,
        title: "Criando e acessando listas",
        objective:
          "Criar uma lista com colchetes e acessar seus itens pelo índice.",
        estimatedMinutes: 15,
        difficulty: 3,
        concept:
          "Uma lista guarda vários valores em uma única variável, entre colchetes [ ], separados por vírgula. Cada item tem uma posição chamada índice — e em Python, os índices começam em 0, não em 1: o primeiro item é lista[0], o segundo é lista[1], e assim por diante.",
        example: {
          code: 'frutas = ["maçã", "banana", "uva"]\nprint(frutas[0])\nprint(frutas[1])',
          explanation:
            'frutas[0] é o primeiro item da lista ("maçã"), e frutas[1] é o segundo ("banana") — repare que o índice sempre começa em 0.',
        },
        challenge: {
          kind: "code",
          id: "ex-8-1",
          title: "Corrigindo os índices errados",
          difficulty: 3,
          concept: "listas",
          conceptId: "listas",
          instruction:
            'O código abaixo queria mostrar o primeiro e o segundo item da lista, mas usa os índices errados (como se a contagem começasse em 1, não em 0). Corrija os índices para mostrar corretamente "caneta" e depois "lápis".',
          starterCode: 'materiais = ["caneta", "lápis", "borracha"]\nprint(materiais[1])\nprint(materiais[2])',
          expectedOutput: ["caneta", "lápis"],
          hints: [
            { order: 1, text: "Em Python, o primeiro item de uma lista está no índice 0, não no 1." },
            { order: 2, text: "Se você quer o primeiro e o segundo item, os índices certos são 0 e 1." },
            { order: 3, text: 'materiais = ["caneta", "lápis", "borracha"]\\nprint(materiais[0])\\nprint(materiais[1])' },
          ],
        },
        summary:
          "Uma lista guarda vários valores entre colchetes. Cada item é acessado pelo seu índice, que começa em 0.",
        nextLessonSlug: "adicionando-e-removendo-itens",
      },
      {
        id: "adicionando-e-removendo-itens",
        slug: "adicionando-e-removendo-itens",
        moduleSlug: "listas",
        order: 2,
        title: "Adicionando e removendo itens",
        objective:
          "Usar append() para adicionar um item ao final da lista e remove() para tirar um item específico.",
        estimatedMinutes: 15,
        difficulty: 3,
        concept:
          "Listas podem mudar depois de criadas. lista.append(valor) adiciona um item ao final da lista. lista.remove(valor) tira da lista a primeira ocorrência daquele valor. Ao mostrar uma lista inteira com print(), o Python exibe todos os itens entre colchetes, separados por vírgula, cada texto entre aspas simples.",
        example: {
          code: 'compras = ["arroz", "feijão"]\ncompras.append("leite")\nprint(compras)',
          explanation:
            'compras.append("leite") adiciona "leite" ao final da lista. print(compras) mostra a lista inteira: [\'arroz\', \'feijão\', \'leite\'].',
        },
        challenge: {
          kind: "code",
          id: "ex-8-2",
          title: "Trocando um item da lista de mercado",
          difficulty: 3,
          concept: "append-remove",
          conceptId: "append-remove",
          instruction:
            'Crie mercado = ["arroz", "refrigerante", "feijão"]. Tire "refrigerante" da lista com remove(), depois adicione "leite" ao final com append(), e mostre a lista completa com print().',
          starterCode: "",
          expectedOutput: ["['arroz', 'feijão', 'leite']"],
          hints: [
            { order: 1, text: "remove() tira da lista a primeira ocorrência do valor indicado — use mercado.remove(\"refrigerante\")." },
            { order: 2, text: "Só depois de remover, adicione o novo item com append()." },
            { order: 3, text: 'mercado = ["arroz", "refrigerante", "feijão"]\\nmercado.remove("refrigerante")\\nmercado.append("leite")\\nprint(mercado)' },
          ],
        },
        summary:
          "append() adiciona um item ao final da lista, e remove() tira a primeira ocorrência de um valor. print() de uma lista mostra todos os itens entre colchetes.",
        nextLessonSlug: "percorrendo-listas",
      },
      {
        id: "percorrendo-listas",
        slug: "percorrendo-listas",
        moduleSlug: "listas",
        order: 3,
        title: "Percorrendo uma lista com for",
        objective:
          "Usar for para passar por todos os itens de uma lista, um de cada vez.",
        estimatedMinutes: 15,
        difficulty: 3,
        concept:
          "Em vez de acessar cada item de uma lista pelo índice, um por um, dá para usar for para percorrer a lista inteira automaticamente — a cada volta, a variável do for recebe o próximo item da lista, na ordem em que aparecem.",
        example: {
          code: 'numeros = [10, 20, 30]\nfor numero in numeros:\n    print(numero)',
          explanation:
            "O for passa por cada item de numeros, na ordem: primeiro numero vale 10, depois 20, depois 30 — mostrando um valor por linha.",
        },
        challenge: {
          kind: "code",
          id: "ex-8-3",
          title: "Somando os preços da lista",
          difficulty: 3,
          concept: "percorrer-listas",
          conceptId: "percorrer-listas",
          instruction:
            "Crie a lista precos = [15, 25, 10] e use for para somar todos os preços em uma variável total (comece com total = 0 antes do for). No final, mostre apenas o total.",
          starterCode: "",
          expectedOutput: ["50"],
          hints: [
            { order: 1, text: "Antes do for, crie total = 0 — esse é o acumulador, do jeito que você já viu no Módulo 7." },
            { order: 2, text: "Dentro do for, some cada preço ao total: total = total + preco." },
            { order: 3, text: "precos = [15, 25, 10]\\ntotal = 0\\nfor preco in precos:\\n    total = total + preco\\nprint(total)" },
          ],
        },
        miniProject: {
          title: "Lista de compras",
          description:
            "Crie uma lista de compras vazia e use pelo menos três append() para adicionar itens a ela. Remova um item com remove(). Por fim, use for para mostrar cada item restante da lista, um por linha.",
        },
        summary:
          "for item in lista percorre todos os itens de uma lista, um de cada vez, sem precisar de índice.",
        nextLessonSlug: "criando-dicionarios",
      },
    ],
  },
  {
    slug: "dicionarios",
    order: 9,
    title: "Dicionários",
    description: "Organizar informações em pares de chave e valor.",
    lessons: [
      {
        id: "criando-dicionarios",
        slug: "criando-dicionarios",
        moduleSlug: "dicionarios",
        order: 1,
        title: "Criando dicionários e consultando valores",
        objective:
          "Criar um dicionário com chaves e valores, e consultar um valor por sua chave.",
        estimatedMinutes: 15,
        difficulty: 3,
        concept:
          "Um dicionário guarda informações em pares de chave e valor, entre chaves { }, no formato chave: valor. Diferente da lista, que usa índices numéricos, o dicionário usa a própria chave (geralmente um texto) para consultar um valor: dicionario[\"chave\"].",
        example: {
          code: 'pessoa = {"nome": "Ana", "idade": 30}\nprint(pessoa["nome"])\nprint(pessoa["idade"])',
          explanation:
            'pessoa["nome"] devolve o valor guardado na chave "nome" ("Ana"), e pessoa["idade"] devolve o valor da chave "idade" (30).',
        },
        challenge: {
          kind: "code",
          id: "ex-9-1",
          title: "A chave que não existe",
          difficulty: 3,
          concept: "dicionarios",
          conceptId: "dicionarios",
          instruction:
            "O código abaixo queria mostrar a cor e o tamanho de um produto, mas tenta consultar uma chave que não existe no dicionário (o que causaria um erro). Corrija a chave usada no segundo print() para uma que realmente existe em produto.",
          starterCode: 'produto = {"cor": "azul", "tamanho": "M"}\nprint(produto["cor"])\nprint(produto["cor_do_tamanho"])',
          expectedOutput: ["azul", "M"],
          hints: [
            { order: 1, text: "Consultar uma chave que não existe no dicionário gera um erro (KeyError)." },
            { order: 2, text: 'As chaves que existem em produto são "cor" e "tamanho" — use exatamente esses nomes.' },
            { order: 3, text: 'produto = {"cor": "azul", "tamanho": "M"}\\nprint(produto["cor"])\\nprint(produto["tamanho"])' },
          ],
        },
        summary:
          "Um dicionário guarda pares de chave e valor entre chaves { }. Um valor é consultado pela sua chave: dicionario[\"chave\"].",
        nextLessonSlug: "alterando-dicionarios",
      },
      {
        id: "alterando-dicionarios",
        slug: "alterando-dicionarios",
        moduleSlug: "dicionarios",
        order: 2,
        title: "Alterando valores em um dicionário",
        objective:
          "Alterar o valor de uma chave já existente em um dicionário.",
        estimatedMinutes: 12,
        difficulty: 3,
        concept:
          "Para alterar o valor de uma chave que já existe, basta atribuir um novo valor a ela, do mesmo jeito que se cria uma variável: dicionario[\"chave\"] = novo_valor. Se a chave já existir, o valor antigo é substituído.",
        example: {
          code: 'pessoa = {"nome": "Ana", "idade": 30}\npessoa["idade"] = 31\nprint(pessoa)',
          explanation:
            'pessoa["idade"] = 31 substitui o valor antigo (30) da chave "idade" por 31. print(pessoa) mostra o dicionário inteiro já atualizado.',
        },
        challenge: {
          kind: "code",
          id: "ex-9-2",
          title: "Atualizando o preço e o estoque",
          difficulty: 3,
          concept: "alterar-dicionario",
          conceptId: "alterar-dicionario",
          instruction:
            'Crie produto = {"nome": "caderno", "preco": 12}. Altere o preço para 15, adicione uma nova chave estoque com o valor 40 (mesmo sem ela existir antes — a sintaxe é a mesma), e mostre o dicionário inteiro com print().',
          starterCode: "",
          expectedOutput: ["{'nome': 'caderno', 'preco': 15, 'estoque': 40}"],
          hints: [
            { order: 1, text: 'Para alterar um valor existente, use dicionario["chave"] = novo_valor — a mesma sintaxe funciona pra criar uma chave nova.' },
            { order: 2, text: 'Primeiro altere "preco", depois crie a chave "estoque" do mesmo jeito.' },
            { order: 3, text: 'produto = {"nome": "caderno", "preco": 12}\\nproduto["preco"] = 15\\nproduto["estoque"] = 40\\nprint(produto)' },
          ],
        },
        summary:
          "Atribuir um valor a uma chave que já existe (dicionario[\"chave\"] = novo_valor) substitui o valor antigo por ele.",
        nextLessonSlug: "iterando-dicionarios",
      },
      {
        id: "iterando-dicionarios",
        slug: "iterando-dicionarios",
        moduleSlug: "dicionarios",
        order: 3,
        title: "Percorrendo um dicionário com for",
        objective:
          "Usar for com .items() para percorrer todas as chaves e valores de um dicionário.",
        estimatedMinutes: 15,
        difficulty: 4,
        concept:
          "dicionario.items() devolve todos os pares de chave e valor do dicionário, um de cada vez — por isso, o for usado com .items() precisa de duas variáveis, uma para a chave e outra para o valor, nessa ordem: for chave, valor in dicionario.items().",
        example: {
          code: 'aluno = {"nome": "Carlos", "nota": 8}\nfor chave, valor in aluno.items():\n    print(chave, valor)',
          explanation:
            'A cada volta, chave recebe uma chave do dicionário e valor recebe o valor correspondente. print(chave, valor) com vírgula mostra os dois na mesma linha, separados por espaço.',
        },
        challenge: {
          kind: "code",
          id: "ex-9-3",
          title: "Contando o estoque total",
          difficulty: 4,
          concept: "iterar-dicionario",
          conceptId: "iterar-dicionario",
          instruction:
            'Crie estoque = {"camisetas": 12, "calças": 7, "bonés": 20}. Use for com .items() para, ao mesmo tempo, mostrar cada produto com sua quantidade (uma linha por produto) e somar todas as quantidades em uma variável total (comece com total = 0 antes do for). No final, depois das linhas de cada produto, mostre o total geral.',
          starterCode: "",
          expectedOutput: ["camisetas 12", "calças 7", "bonés 20", "39"],
          hints: [
            { order: 1, text: "Você precisa de duas coisas dentro do mesmo for: um print(chave, valor) e uma soma no acumulador." },
            { order: 2, text: "Comece total = 0 antes do for, e dentro dele: total = total + valor." },
            { order: 3, text: 'estoque = {"camisetas": 12, "calças": 7, "bonés": 20}\\ntotal = 0\\nfor produto, quantidade in estoque.items():\\n    print(produto, quantidade)\\n    total = total + quantidade\\nprint(total)' },
          ],
        },
        miniProject: {
          title: "Cadastro de pessoas",
          description:
            "Crie uma lista vazia chamada pessoas. Para cada uma de pelo menos duas pessoas, crie um dicionário com as chaves nome e idade e adicione esse dicionário à lista com append(). Por fim, use for para percorrer a lista e, para cada pessoa, use .items() para mostrar todas as chaves e valores dela.",
        },
        summary:
          "dicionario.items() devolve pares de chave e valor, que o for pode percorrer com duas variáveis: for chave, valor in dicionario.items().",
        nextLessonSlug: null,
      },
    ],
  },
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