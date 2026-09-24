-- Multi-curso: introduz `courses` e associa cada `module` a um curso.
-- Aditiva e segura para rodar com aluno(s) já cadastrado(s):
--   - não remove nem torna obrigatória nenhuma coluna existente;
--   - não altera dados de profiles/student_progress/exercise_attempts/
--     concept_mastery/achievements;
--   - os módulos já existentes são migrados automaticamente para o curso
--     "Python do Zero" (nenhuma aula muda de módulo, slug ou id).

-- =========================================================================
-- courses
-- =========================================================================
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  ordem smallint not null,
  slug text not null unique,
  titulo text not null,
  descricao text not null
);

-- Curso já existente (o que hoje é servido em src/data/curriculum.ts) e o
-- novo curso Python Intermediário. `on conflict do nothing` deixa o script
-- seguro para rodar de novo sem duplicar linhas.
insert into courses (slug, ordem, titulo, descricao)
values
  (
    'python-do-zero',
    1,
    'Python do Zero',
    'Do pensamento computacional ao seu primeiro projeto completo em Python — para quem nunca programou.'
  ),
  (
    'python-intermediario',
    2,
    'Python Intermediário',
    'Para quem já concluiu o Python do Zero: organizar projetos, tratar erros, consumir APIs e conectar Python a banco de dados.'
  )
on conflict (slug) do nothing;

-- =========================================================================
-- modules.course_id
-- =========================================================================
alter table modules add column if not exists course_id uuid references courses (id);

-- Backfill: todo módulo que já existir (do curso único de antes desta
-- migração) pertence ao curso "Python do Zero".
update modules
set course_id = (select id from courses where slug = 'python-do-zero')
where course_id is null;

-- Só agora, com todo módulo já com curso atribuído, a coluna vira
-- obrigatória — sem isso, `npm run seed` poderia criar módulo novo sem
-- curso por engano.
alter table modules alter column course_id set not null;

-- =========================================================================
-- Row Level Security
-- =========================================================================
alter table courses enable row level security;

create policy "courses: leitura autenticada" on courses for select to authenticated using (true);
