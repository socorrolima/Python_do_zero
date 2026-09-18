# Python do Zero

Plataforma web para ensinar Python a pessoas que nunca programaram, com
metodologia CONCEITO → EXEMPLO → EXPERIMENTAÇÃO → DESAFIO → FEEDBACK →
PROJETO. Ver `PEDAGOGICAL_METHOD.md` para o método completo e
`ARCHITECTURE.md` / `DATABASE.md` para as decisões técnicas.

## Status

Fase 8 do desenvolvimento incremental: sistema adaptativo completo. A
cada tentativa de exercício, `src/lib/learning/progressClient.ts` busca
as últimas 5 tentativas do aluno naquele conceito (em `exercise_attempts`,
via Supabase) e usa `AdaptiveLearningService.recommendFromHistory` — a
regra de 85%/60% do item 8 do prompt mestre — para decidir avançar,
manter ou revisar, e para gravar `concept_mastery` com a taxa de acerto
real. Continua sendo um módulo único e configurável
(`src/lib/learning/AdaptiveLearningService.ts`), não uma regra espalhada
pelos componentes.

Sem histórico disponível (sem sessão, escrita no Supabase falhou, ou o
currículo ainda no fallback mockado), `ExercisePrompt` degrada de volta
para `recommendFromSingleAttempt` — o sinal de uma tentativa só, usado
desde a Fase 3 — em vez de não dar feedback nenhum.

Progresso (`student_progress`), autenticação (Supabase Auth), conteúdo
(módulos/aulas/exercícios do Supabase, com fallback mockado) e execução
real de Python via Pyodide continuam como nas Fases 4-7 — a ressalva
sobre Pyodide não ter sido testado num navegador real (só build/lint)
ainda vale.

## Tecnologias

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) 4
- [Supabase](https://supabase.com) (PostgreSQL + Auth) — desde a Fase 4
- [Pyodide](https://pyodide.org) para execução de Python no navegador — desde a Fase 6
- Deploy: [Vercel](https://vercel.com)

## Instalação

```bash
npm install
```

## Configuração

Copie `.env.local.example` para `.env.local` e preencha com as credenciais do
seu projeto Supabase (Project Settings > API):

```bash
cp .env.local.example .env.local
```

| Variável | Onde é usada |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente (browser) e servidor |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente (browser) e servidor |
| `SUPABASE_SERVICE_ROLE_KEY` | Apenas servidor — nunca expor ao cliente |

Sem essas variáveis o app continua rodando (páginas públicas normalmente,
rotas protegidas redirecionando para `/login`), mas login e cadastro não
funcionam de fato até as credenciais reais serem preenchidas.

Depois de configurar as variáveis, execute a migração
`supabase/migrations/0001_init.sql` no SQL Editor do seu projeto Supabase
(ou via CLI) para criar as tabelas e as políticas de RLS, e então rode:

```bash
npm run seed
```

para popular os Módulos 1 e 2 (aulas, exercícios e dicas) a partir de
`src/data/curriculum.ts`. O seed precisa de `SUPABASE_SERVICE_ROLE_KEY`
em `.env.local` (a chave anônima só tem permissão de leitura no conteúdo)
e pode ser rodado de novo sempre que o conteúdo mudar — ele substitui os
dados anteriores em vez de duplicar.

## Execução local

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Build de produção

```bash
npm run build
npm start
```

## Lint

```bash
npm run lint
```

## Testes

Ainda não implementados — previstos a partir da Fase 9, cobrindo
autenticação, progresso, exercícios, validação de respostas e o sistema
adaptativo (ver `DEVELOPMENT.md`).

## Deploy

Pensado para a [Vercel](https://vercel.com): conectar o repositório e
configurar as mesmas variáveis de ambiente do `.env.local` no painel do
projeto.

## Estrutura de pastas

```
src/
├── app/            # Rotas (App Router)
├── components/     # UI por domínio (ui, lesson, code-editor, exercise, progress, dashboard)
├── lib/            # Serviços (supabase, learning, exercises, python)
├── types/          # Tipos compartilhados
└── data/           # Dados de apoio para desenvolvimento local
```

Detalhes de cada decisão em `ARCHITECTURE.md`.
