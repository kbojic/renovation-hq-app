create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text default '',
  project_type text default '',
  goal text default '',
  budget_cap integer default 0,
  contingency_pct integer default 15,
  created_at timestamptz default now()
);

create table if not exists public.budget_lines (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  budgeted integer default 0,
  committed integer default 0,
  paid integer default 0,
  status text default 'planned',
  vendor text default '',
  notes text default '',
  created_at timestamptz default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  company text not null,
  status text default 'lead',
  phone text default '',
  email text default '',
  quoted integer default 0,
  created_at timestamptz default now()
);
