-- Fase 4: schema inicial (ver DATABASE.md).
-- Relacionamento: module -> lesson -> concept -> exercise -> attempt -> student_progress.

-- =========================================================================
-- profiles (1:1 com auth.users)
-- =========================================================================
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  streak_atual smallint not null default 0,
  criado_em timestamptz not null default now()
);

-- Cria automaticamente um profile quando um usuário se cadastra pelo
-- Supabase Auth. "nome" vem dos metadados enviados no signUp (ver
-- src/app/cadastro/page.tsx); sem eles, usa a parte antes do @ do e-mail.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- =========================================================================
-- Conteúdo pedagógico (modules -> lessons -> concepts -> exercises -> hints)
-- =========================================================================
create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  ordem smallint not null,
  slug text not null unique,
  titulo text not null,
  descricao text not null
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules (id) on delete cascade,
  ordem smallint not null,
  slug text not null unique,
  titulo text not null,
  -- Conteúdo pedagógico completo (objetivo, conceito, exemplo, resumo,
  -- mini-projeto...) — separado do código, conforme item 21 do prompt mestre.
  conteudo_json jsonb not null default '{}'::jsonb,
  unique (module_id, ordem)
);

create table if not exists concepts (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons (id) on delete cascade,
  chave text not null
);

create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  concept_id uuid not null references concepts (id) on delete cascade,
  kind text not null check (kind in ('code', 'order')),
  titulo text not null,
  dificuldade smallint not null check (dificuldade between 1 and 5),
  instrucao text not null,
  starter_code text not null default '',
  expected_output jsonb not null default '[]'::jsonb,
  correct_order jsonb not null default '[]'::jsonb
);

create table if not exists hints (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references exercises (id) on delete cascade,
  ordem smallint not null check (ordem between 1 and 3),
  texto text not null,
  unique (exercise_id, ordem)
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules (id) on delete cascade,
  titulo text not null,
  descricao text not null
);

-- =========================================================================
-- Progresso do aluno
-- =========================================================================
create table if not exists student_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  lesson_id uuid not null references lessons (id) on delete cascade,
  status text not null default 'nao_iniciado'
    check (status in ('nao_iniciado', 'em_andamento', 'concluido')),
  percentual smallint not null default 0 check (percentual between 0 and 100),
  atualizado_em timestamptz not null default now(),
  unique (profile_id, lesson_id)
);

create table if not exists exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  exercise_id uuid not null references exercises (id) on delete cascade,
  acertou boolean not null,
  dicas_usadas smallint not null default 0,
  tempo_seg integer,
  criado_em timestamptz not null default now()
);

create table if not exists concept_mastery (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  concept_id uuid not null references concepts (id) on delete cascade,
  nivel_dominio smallint not null default 0,
  ultima_revisao timestamptz,
  unique (profile_id, concept_id)
);

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  tipo text not null,
  criado_em timestamptz not null default now()
);

-- =========================================================================
-- Row Level Security
-- =========================================================================

-- Tabelas com dado do próprio aluno: só o dono lê e escreve.
alter table profiles enable row level security;
alter table student_progress enable row level security;
alter table exercise_attempts enable row level security;
alter table concept_mastery enable row level security;
alter table achievements enable row level security;

create policy "profiles: aluno vê e edita o próprio perfil"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "student_progress: aluno vê e edita o próprio progresso"
  on student_progress for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create policy "exercise_attempts: aluno vê e registra as próprias tentativas"
  on exercise_attempts for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create policy "concept_mastery: aluno vê e edita o próprio domínio de conceitos"
  on concept_mastery for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create policy "achievements: aluno vê e recebe as próprias conquistas"
  on achievements for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- Tabelas de conteúdo: leitura pública para qualquer usuário autenticado;
-- escrita reservada à área administrativa futura (via service role, que
-- ignora RLS — por isso não há policy de INSERT/UPDATE/DELETE aqui).
alter table modules enable row level security;
alter table lessons enable row level security;
alter table concepts enable row level security;
alter table exercises enable row level security;
alter table hints enable row level security;
alter table projects enable row level security;

create policy "modules: leitura autenticada" on modules for select to authenticated using (true);
create policy "lessons: leitura autenticada" on lessons for select to authenticated using (true);
create policy "concepts: leitura autenticada" on concepts for select to authenticated using (true);
create policy "exercises: leitura autenticada" on exercises for select to authenticated using (true);
create policy "hints: leitura autenticada" on hints for select to authenticated using (true);
create policy "projects: leitura autenticada" on projects for select to authenticated using (true);
