# Banco de dados (Supabase / PostgreSQL)

> Implementado a partir da Fase 4. Este documento fixa o modelo definido na
> Fase 1 de planejamento.

## Relacionamento

```
module
   ↓
lesson
   ↓
concept
   ↓
exercise
   ↓
attempt
   ↓
student_progress
```

## Tabelas

| Tabela | Campos principais | Observação |
| --- | --- | --- |
| `profiles` | id (fk auth.users), nome, streak_atual | 1:1 com o usuário do Supabase Auth |
| `modules` | id, ordem, titulo, slug | Módulos 1 a 12 |
| `lessons` | id, module_id, ordem, titulo, conteudo_json | conteúdo separado do código |
| `concepts` | id, lesson_id, chave (ex. `if_else`) | usado pelo AdaptiveLearningService |
| `exercises` | id, concept_id, dificuldade (1-5), instrucao, starter_code, expected_behavior | ver modelo de exercício abaixo |
| `hints` | id, exercise_id, ordem (1-3), texto | até 3 níveis por exercício |
| `projects` | id, module_id, titulo, descricao | mini-projetos ao fim de cada módulo |
| `student_progress` | id, profile_id, lesson_id, status, percentual | 1 linha por aluno x aula |
| `exercise_attempts` | id, profile_id, exercise_id, acertou, dicas_usadas, tempo_seg, criado_em | alimenta o AdaptiveLearningService |
| `concept_mastery` | id, profile_id, concept_id, nivel_dominio, ultima_revisao | domínio por conceito |
| `achievements` | id, profile_id, tipo, criado_em | gamificação leve |

## Modelo de exercício

```json
{
  "title": "Criando uma variável",
  "difficulty": 1,
  "concept": "variables",
  "instruction": "Crie uma variável chamada nome.",
  "starter_code": "",
  "expected_behavior": "deve existir uma variável nome",
  "hints": [
    "Você precisa guardar um texto.",
    "Use o sinal =.",
    "Exemplo: nome = \"Ana\""
  ]
}
```

A arquitetura permite cadastrar centenas de exercícios posteriormente sem
alterar o código da aplicação — conteúdo pedagógico fica no banco, nunca
hardcoded em componentes.

## Row Level Security

Todas as tabelas com `profile_id` têm policy `profile_id = auth.uid()` para
SELECT/INSERT/UPDATE. Um aluno nunca acessa os dados privados de outro
aluno.

Tabelas de conteúdo (`modules`, `lessons`, `concepts`, `exercises`, `hints`,
`projects`) são públicas para leitura autenticada e sem escrita pelo
cliente — apenas via área administrativa futura, que usará a service role
key no servidor.

## Migrations

SQL versionado em `supabase/migrations/` (criado na Fase 4).
