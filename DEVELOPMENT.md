# Desenvolvimento

## Fases (ordem obrigatória — não pular etapas)

1. **Planejamento técnico** — concluído (ver histórico do projeto para o
   documento de Fase 1: arquitetura, mapa de navegação, modelo de dados,
   componentes, MVP, fluxo pedagógico, fluxo adaptativo, estrutura de
   pastas).
2. **Criar projeto Next.js** — concluído. TypeScript, Tailwind, ESLint,
   estrutura de pastas, Git.
3. **Interface** — concluído. Trilha, aula, laboratório e dashboard
   funcionais com dados mockados (`src/data/curriculum.ts`) e progresso em
   `localStorage` (`lib/learning/ProgressContext.tsx`). Editor de código
   usava um mock runner (`lib/python/mockRunner.ts`, removido na Fase 6)
   que só entendia `print()` e comentários — suficiente para os Módulos
   1-2 até a execução real de Python chegar.
4. **Supabase** — concluído. Clientes browser/servidor
   (`lib/supabase/client.ts`, `lib/supabase/server.ts`), proteção de rotas
   via `src/proxy.ts` (equivalente ao `middleware.ts` no Next 15 — ver
   Next.js 16), páginas de login/cadastro/logout reais e migração SQL em
   `supabase/migrations/0001_init.sql` (tabelas + RLS). A migração ainda
   não foi executada contra um projeto real — falta o usuário criar o
   projeto no Supabase, rodar a migração e preencher `.env.local`.
5. **Exercícios** — concluído. `src/lib/exercises/content.ts` busca
   módulos/aulas/conceitos/exercícios/dicas do Supabase e devolve os
   mesmos tipos que os componentes já usavam (`@/types/curriculum`) —
   nenhum componente muda. Se o Supabase não estiver configurado ou as
   tabelas estiverem vazias, cai de volta para `src/data/curriculum.ts`
   (mesma fonte usada por `scripts/seed.ts`, `npm run seed`) sem quebrar a
   página. `generateStaticParams` de `/aula/[slug]` foi removido — a rota
   passou a ser dinâmica, coerente com conteúdo que agora vem do banco.
6. **Execução segura de Python** — concluído. `src/lib/python/pyodideRunner.ts`
   roda o código do aluno num Web Worker dedicado
   (`public/workers/pyodide-worker.js`, ver nota do Turbopack abaixo), com
   timeout (protege contra loop infinito) e tradução de erros reais do
   Python para mensagens pedagógicas (`src/lib/python/errorMessages.ts`).
   `CodeEditor`/`ExercisePrompt` foram atualizados para a nova API
   assíncrona; `mockRunner.ts` foi removido. **Não testado num navegador
   real** — só build/lint limpos e o worker confirmado servido como
   JavaScript puro; a validação de fato (clicar em "Executar" e ver o
   resultado) ainda não foi feita.
7. **Progresso** — concluído. `src/lib/learning/progressServer.ts` busca
   `student_progress` no layout do servidor (sem "flash" de progresso
   vazio); `src/lib/learning/progressClient.ts` grava do navegador:
   concluir aula → `student_progress`, resolver exercício →
   `exercise_attempts` + atualização simples de `concept_mastery`.
   `ProgressContext.tsx` trocou `useSyncExternalStore`/`localStorage` por
   `useState` inicializado do servidor + escrita otimista. `mockProgress.ts`
   removido. Escritas são "melhor esforço" (avisam no console e não
   quebram a UI se falharem — por exemplo, com o currículo ainda no
   fallback mockado, cujos ids não são uuids válidos no Supabase).
   Botão "Reiniciar progresso" em `/progresso` agora apaga de verdade
   (com confirmação) em vez de só limpar o `localStorage`.
8. **Sistema adaptativo** — concluído. `recordExerciseAttempt` (em
   `progressClient.ts`) passou a buscar as últimas `HISTORY_WINDOW = 5`
   tentativas do aluno para o `concept_id` da tentativa atual (junção com
   `exercises` via `exercises!inner(concept_id)`) e chamar
   `AdaptiveLearningService.recommendFromHistory` — a regra real de
   85%/60%, que já existia desde a Fase 3 mas não estava sendo usada.
   `concept_mastery.nivel_dominio` passa a ser a taxa de acerto desse
   histórico (não mais o incremento ad-hoc da Fase 7).
   `ExercisePrompt` ficou assíncrono: grava a tentativa, espera a
   recomendação, e só então mostra avançar/manter/revisar — se não
   houver histórico (sem sessão, escrita falhou, currículo mockado),
   cai de volta para `recommendFromSingleAttempt` em vez de não mostrar
   nada. **Não testado contra um Supabase real** — a sintaxe da junção
   (`exercises!inner(concept_id)`) segue o padrão documentado do
   PostgREST/supabase-js, mas só será validada de fato quando alguém
   resolver um exercício com o banco configurado.
9. **Testes** — concluído (parcialmente, ver limites abaixo). Vitest +
   Testing Library, rodando sob jsdom (não Turbopack — ver
   `vitest.config.mts`). Cobertura real (`npm run test:coverage`): ~46%
   statements / ~39% branches no projeto todo, concentrada de propósito nas
   partes que o item 31 do prompt mestre pede:
   - **Sistema adaptativo**: `AdaptiveLearningService.test.ts` — as duas
     regras (`recommendFromSingleAttempt`, `recommendFromHistory`),
     incluindo os limiares 85%/60% exatos (inclusivo/exclusivo).
   - **Validação de respostas**: `pyodideRunner.test.ts`
     (`matchesExpectedOutput`) e `errorMessages.test.ts`
     (`translatePythonError`, todos os 11 tipos de erro pedagógico + 2
     casos de borda).
   - **Autenticação**: `authErrors.test.ts` (tradução de mensagens do
     Supabase Auth). O fluxo de login/cadastro em si (páginas em
     `src/app/`) não tem teste automatizado — ver limite abaixo.
   - **Progresso**: `progressClient.test.ts` (mockando o cliente Supabase
     por completo — sem tocar rede) e `ProgressContext.test.tsx`
     (`isLessonUnlocked`, `markLessonCompleted`, `moduleProgress`,
     `overallProgress`, `resetProgress`), cobrindo a regra de
     pré-requisito do item 32.
   - **Exercícios / componentes principais**: `ExercisePrompt.test.tsx`
     (integra `OrderChallenge` real + `CodeEditor` mockado — Pyodide não
     roda em jsdom), `HintPanel.test.tsx` (as 3 dicas nunca aparecem de
     graça, item 10), `OrderChallenge.test.tsx`, `FeedbackCard.test.tsx`.

   **O que ficou de fora, deliberadamente, e por quê:**
   - `pyodideRunner.runPython` (o próprio worker/Pyodide), o fluxo de
     login/cadastro nas páginas do App Router, `progressServer.ts` e
     `lib/exercises/content.ts` (ambos dependem de `next/headers` /
     Server Components) e os componentes puramente apresentacionais
     (`Badge`, `Card`, `NavBar`, `ProgressBar`, `ModuleMap`,
     `DashboardSummary`, `LessonLayout`) não têm teste automatizado —
     exigiriam um navegador real, um Supabase real, ou trariam pouco
     valor de regressão (são só marcação/estilo). Continuam cobertos
     pelo fluxo manual abaixo, que é o critério de qualidade real do
     item 26 do prompt mestre.
   - A sintaxe de junção do Supabase (`exercises!inner(concept_id)`) é
     testada apenas com um mock fiel ao formato de retorno documentado do
     supabase-js — ainda não foi validada contra um projeto real (mesma
     ressalva da Fase 8).
10. **Deploy na Vercel** — em andamento. `package.json` ganhou
    `engines.node: ">=20.9.0"` (requisito do Next.js 16 — `next/package.json`
    já declara isso, tornar explícito evita builds em Node antigo fora da
    Vercel). Passo a passo completo em `README.md` > "Deploy (Vercel)".
    Falta: repositório no GitHub com o histórico atual enviado (o
    `git push` para `github.com/socorrolima/Python_do_zero` está sendo
    feito pelo usuário a partir do ambiente local — o ambiente de
    desenvolvimento onde este projeto foi construído não tem autorização
    do proxy de git para esse repositório) e a criação/conexão do projeto
    na Vercel, que só o usuário pode fazer (conta própria).

Cada fase espera aprovação antes de avançar para a próxima.

## Ambiente local

```bash
npm install
cp .env.local.example .env.local   # preencher com as credenciais do seu projeto Supabase
npm run dev
```

## Scripts

| Comando | Efeito |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção |
| `npm start` | executa o build |
| `npm run lint` | ESLint |
| `npm run seed` | popula o Supabase com os Módulos 1-2 a partir de `src/data/curriculum.ts` |
| `npm run test` | roda a suíte de testes (Vitest) uma vez |
| `npm run test:watch` | Vitest em modo watch |
| `npm run test:coverage` | roda a suíte com relatório de cobertura (texto + HTML em `coverage/`) |

## Testes (Fase 9)

63 testes automatizados em 10 arquivos (`npm run test`), cobrindo o que o
item 31 do prompt mestre pede — ver a seção da Fase 9 acima para o
detalhamento por área e o que ficou de fora e por quê.

Fluxo manual completo a validar antes de cada release:

```
Cadastro → Login → Dashboard → Módulo → Aula → Código → Exercício → Feedback → Progresso
```

## Convenções

- Componentes React não acessam o Supabase diretamente — sempre por meio de
  `src/lib/`.
- Regras de dificuldade/adaptação vivem exclusivamente em
  `src/lib/learning/AdaptiveLearningService.ts`, nunca espalhadas pelo
  código.
- Conteúdo pedagógico (aulas, exercícios, dicas) fica no banco, não em
  componentes.
- Nenhuma chave sensível no código — sempre em `.env.local`, nunca
  versionado.

## Decisão registrada: worker do Pyodide em `public/`, não em `src/`

Tentativa inicial da Fase 6: `new Worker(new URL("./pyodide.worker.ts",
import.meta.url))`, o padrão documentado para webpack. Não funciona neste
projeto — o Turbopack do Next.js 16 não compila o arquivo referenciado
por esse padrão; ele só copia o `.ts` cru para `.next/static/media/` como
se fosse uma imagem, e o navegador não executa TypeScript/ESM dentro de
um worker clássico. Confirmado inspecionando a saída do build
(`find .next -iname "*worker*"` mostrava o `.ts` não compilado).

Solução adotada: o worker vive em `public/workers/pyodide-worker.js`,
JavaScript puro (sem import/export), servido como está pelo Next — sem
depender de nenhum comportamento do bundler para workers. O contrato de
mensagens fica documentado (e tipado, do lado da thread principal) em
`src/lib/python/workerMessages.ts`. Se um dia o Turbopack passar a
suportar esse padrão nativamente, migrar de volta para `src/` é opcional,
não obrigatório.
