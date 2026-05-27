create extension if not exists "pgcrypto";

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  username text not null unique,
  full_name text not null,
  position text not null default '',
  role text not null default 'seller' check (role in ('seller', 'admin', 'super_admin')),
  signature_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legacy_id text,
  name text not null,
  work_area text not null default '',
  is_lot boolean not null default false,
  price numeric(12, 2) not null default 0,
  default_quantity integer not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, legacy_id)
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  prepared_by uuid references public.profiles(id) on delete set null,
  quote_type text not null default 'solar',
  company text not null default '',
  tax_id text not null default '',
  contact text not null default '',
  email text not null default '',
  phone text not null default '',
  notes text not null default '',
  referred_by text not null default '',
  fiscal_address jsonb not null default '{}'::jsonb,
  installation_address jsonb not null default '{}'::jsonb,
  discount_percent numeric(6, 2) not null default 0,
  commission_percent numeric(6, 2) not null default 0,
  commission_applied_percent numeric(6, 2) not null default 0,
  commission_for text not null default '',
  commission_amount numeric(12, 2) not null default 0,
  company_commission_amount numeric(12, 2) not null default 0,
  advance_percent numeric(6, 2) not null default 70,
  subtotal numeric(12, 2) not null default 0,
  discount_amount numeric(12, 2) not null default 0,
  iva numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  legacy_product_id text,
  name text not null,
  work_area text not null default '',
  is_lot boolean not null default false,
  base_price numeric(12, 2) not null default 0,
  price numeric(12, 2) not null default 0,
  quantity numeric(12, 2) not null default 1,
  default_quantity integer not null default 1,
  line_total numeric(12, 2) not null default 0,
  base_line_total numeric(12, 2) not null default 0,
  commission_adjustment_percent numeric(6, 2) not null default 0,
  commission_adjustment_amount numeric(12, 2) not null default 0,
  sort_order integer not null default 0
);

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  owner_id uuid references public.profiles(id) on delete set null,
  account text not null default '',
  contact text not null default '',
  name text not null,
  value numeric(12, 2) not null default 0,
  stage text not null default 'Prospecto',
  next_step text not null default '',
  activity text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  account text not null default '',
  due_date date,
  done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_deals_updated_at on public.deals;
create trigger set_deals_updated_at before update on public.deals
for each row execute function public.set_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at before update on public.tasks
for each row execute function public.set_updated_at();

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.deals enable row level security;
alter table public.tasks enable row level security;

create or replace function public.current_organization_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select organization_id from public.profiles where id = auth.uid()
$$;

create or replace function public.current_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "profiles read same organization"
on public.profiles for select
using (organization_id = public.current_organization_id());

create policy "profiles update own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "organizations read own"
on public.organizations for select
using (id = public.current_organization_id());

create policy "products read same organization"
on public.products for select
using (organization_id = public.current_organization_id());

create policy "products write admins"
on public.products for all
using (organization_id = public.current_organization_id() and public.current_role() in ('admin', 'super_admin'))
with check (organization_id = public.current_organization_id() and public.current_role() in ('admin', 'super_admin'));

create policy "quotes read same organization"
on public.quotes for select
using (organization_id = public.current_organization_id());

create policy "quotes write same organization"
on public.quotes for all
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

create policy "quote items read through quote"
on public.quote_items for select
using (
  exists (
    select 1 from public.quotes
    where quotes.id = quote_items.quote_id
      and quotes.organization_id = public.current_organization_id()
  )
);

create policy "quote items write through quote"
on public.quote_items for all
using (
  exists (
    select 1 from public.quotes
    where quotes.id = quote_items.quote_id
      and quotes.organization_id = public.current_organization_id()
  )
)
with check (
  exists (
    select 1 from public.quotes
    where quotes.id = quote_items.quote_id
      and quotes.organization_id = public.current_organization_id()
  )
);

create policy "deals read same organization"
on public.deals for select
using (organization_id = public.current_organization_id());

create policy "deals write same organization"
on public.deals for all
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

create policy "tasks read same organization"
on public.tasks for select
using (organization_id = public.current_organization_id());

create policy "tasks write same organization"
on public.tasks for all
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

grant usage on schema public to authenticated;
grant select on public.organizations to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.quotes to authenticated;
grant select, insert, update, delete on public.quote_items to authenticated;
grant select, insert, update, delete on public.deals to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
grant execute on function public.current_organization_id() to authenticated;
grant execute on function public.current_role() to authenticated;
