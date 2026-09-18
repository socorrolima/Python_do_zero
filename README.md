# Python do Zero

Plataforma web para ensinar Python a pessoas que nunca programaram, com
metodologia CONCEITO → EXEMPLO → EXPERIMENTAÇÃO → DESAFIO → FEEDBACK →
PROJETO. Ver `PEDAGOGICAL_METHOD.md` para o método completo e
`ARCHITECTURE.md` / `DATABASE.md` para as decisões técnicas.

## Status

Fase 4 do desenvolvimento incremental: autenticação real via Supabase Auth
(login, cadastro, logout) e rotas protegidas (`/aprender`, `/aula`,
`/laboratorio`, `/progresso`) via `proxy.ts`. A migração SQL em
`supabase/migrations/0001_init.sql` cria as tabelas e as políticas de Row
Level Security, mas ainda **não foi executada contra um projeto Supabase
real** — sem `.env.local` configurado, o app funciona normalmente (páginas
públicas em 200, rotas protegidas redirecionam para `/login`), mas
login/cadastro não vão completar até as credenciais reais serem
preenchidas. Progresso, exercícios e o Laboratório ainda usam os mocks da
Fase 3 (`localStorage` e um interpretador Python simulado que só entende
`print("texto")` e comentários); a migração para dados reais é da Fase 5
em diante, e Python completo (Pyodide) chega na Fase 6.

## Tecnologias

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) 4
- [Supabase](https://supabase.com) (PostgreSQL + Auth) — a partir da Fase 4
- [Pyodide](https://pyodide.org) para execução de Python no navegador — a partir da Fase 6
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
(ou via CLI) para criar as tabelas e as políticas de RLS antes de testar
login/cadastro.

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
