# Desenvolvimento

## Fases (ordem obrigatória — não pular etapas)

1. **Planejamento técnico** — concluído (ver histórico do projeto para o
   documento de Fase 1: arquitetura, mapa de navegação, modelo de dados,
   componentes, MVP, fluxo pedagógico, fluxo adaptativo, estrutura de
   pastas).
2. **Criar projeto Next.js** — concluído (este commit). TypeScript,
   Tailwind, ESLint, estrutura de pastas, Git.
3. **Interface** — Home, navegação, trilha, aula, dashboard, com dados
   mockados.
4. **Supabase** — banco, autenticação, tabelas, RLS.
5. **Exercícios** — cadastro e renderização a partir do banco.
6. **Execução segura de Python** — integração do Pyodide.
7. **Progresso** — `student_progress`, `concept_mastery` reais.
8. **Sistema adaptativo** — `AdaptiveLearningService` completo.
9. **Testes**.
10. **Deploy na Vercel**.

Cada fase espera aprovação antes de avançar para a próxima.

## Ambiente local

```bash
npm install
cp .env.local.example .env.local   # preencher a partir da Fase 4
npm run dev
```

## Scripts

| Comando | Efeito |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção |
| `npm start` | executa o build |
| `npm run lint` | ESLint |

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
