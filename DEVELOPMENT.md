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
7. **Progresso** — `student_progress`, `concept_mastery` reais.
8. **Sistema adaptativo** — `AdaptiveLearningService` completo.
9. **Testes**.
10. **Deploy na Vercel**.

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

## Testes (a partir da Fase 9)

Cobertura planejada:

- Autenticação
- Progresso
- Exercícios
- Validação de respostas
- Sistema adaptativo
- Componentes principais

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
