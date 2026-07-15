-- ============================================================
-- Atlas Master - Esquema base de datos (Fase 2)
-- Normalizado para Supabase (PostgreSQL)
-- Cubre: continents, countries, landmarks (tablas de este primer bloque)
-- El resto (users, games, achievements...) se disena en otra pasada
-- ============================================================

-- Extension para UUID
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- CONTINENTES
-- ------------------------------------------------------------
create table if not exists continents (
    id smallint primary key generated always as identity,
    code text unique not null,          -- 'AF','AS','EU','NA','SA','OC'
    name_es text not null,
    name_en text not null
);

-- ------------------------------------------------------------
-- PAISES
-- ------------------------------------------------------------
create table if not exists countries (
    id uuid primary key default gen_random_uuid(),
    iso2 char(2) unique not null,
    iso3 char(3) unique not null,
    continent_id smallint not null references continents(id),
    name_es text not null,
    name_en text,
    capital text,
    population bigint,                  -- aproximado, revisar periodicamente
    area_km2 numeric,
    official_language text,
    currency text,
    flag_emoji text,
    flag_image_url text,
    map_image_url text,                 -- silueta del pais (puede ser null)
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_countries_continent on countries(continent_id);
create index if not exists idx_countries_name_es on countries using gin (to_tsvector('spanish', name_es));

-- ------------------------------------------------------------
-- MONUMENTOS / LUGARES DESTACADOS (relacion 1-a-muchos con countries)
-- ------------------------------------------------------------
create table if not exists landmarks (
    id uuid primary key default gen_random_uuid(),
    country_id uuid not null references countries(id) on delete cascade,
    name text not null,
    image_url text,
    is_primary boolean not null default true   -- el "landmark" principal mostrado en el juego
);

create index if not exists idx_landmarks_country on landmarks(country_id);

-- ------------------------------------------------------------
-- PISTAS (relacion 1-a-muchos con countries, para el modo "pistas")
-- ------------------------------------------------------------
create table if not exists hints (
    id uuid primary key default gen_random_uuid(),
    country_id uuid not null references countries(id) on delete cascade,
    text text not null,
    difficulty smallint not null default 1,   -- 1 = pista facil/generica, 2 = mas dificil/especifica
    order_index smallint not null default 0   -- orden de aparicion en el juego
);

create index if not exists idx_hints_country on hints(country_id);

-- ------------------------------------------------------------
-- Trigger para mantener updated_at en countries
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists trg_countries_updated_at on countries;
create trigger trg_countries_updated_at
before update on countries
for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- RLS (Row Level Security) - datos de referencia, lectura publica
-- ------------------------------------------------------------
alter table continents enable row level security;
alter table countries enable row level security;
alter table landmarks enable row level security;
alter table hints enable row level security;

create policy "public read continents" on continents for select using (true);
create policy "public read countries" on countries for select using (true);
create policy "public read landmarks" on landmarks for select using (true);
create policy "public read hints" on hints for select using (true);

-- Solo un rol de servicio (backoffice) podra escribir; se hace desde el
-- dashboard de Supabase o con la service_role key, nunca desde el cliente.
