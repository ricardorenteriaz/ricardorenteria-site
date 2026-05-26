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

drop policy if exists "profiles read same organization" on public.profiles;
create policy "profiles read same organization"
on public.profiles for select
using (organization_id = public.current_organization_id());

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "profiles insert super admins" on public.profiles;
create policy "profiles insert super admins"
on public.profiles for insert
with check (organization_id = public.current_organization_id() and public.current_role() = 'super_admin');

drop policy if exists "profiles update super admins" on public.profiles;
create policy "profiles update super admins"
on public.profiles for update
using (organization_id = public.current_organization_id() and public.current_role() = 'super_admin')
with check (organization_id = public.current_organization_id() and public.current_role() = 'super_admin');

drop policy if exists "profiles delete super admins" on public.profiles;
create policy "profiles delete super admins"
on public.profiles for delete
using (organization_id = public.current_organization_id() and public.current_role() = 'super_admin');

drop policy if exists "organizations read own" on public.organizations;
create policy "organizations read own"
on public.organizations for select
using (id = public.current_organization_id());

drop policy if exists "products read same organization" on public.products;
create policy "products read same organization"
on public.products for select
using (organization_id = public.current_organization_id());

drop policy if exists "products write admins" on public.products;
create policy "products write admins"
on public.products for all
using (organization_id = public.current_organization_id() and public.current_role() in ('admin', 'super_admin'))
with check (organization_id = public.current_organization_id() and public.current_role() in ('admin', 'super_admin'));

drop policy if exists "quotes read same organization" on public.quotes;
create policy "quotes read same organization"
on public.quotes for select
using (organization_id = public.current_organization_id());

drop policy if exists "quotes write same organization" on public.quotes;
create policy "quotes write same organization"
on public.quotes for all
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists "quote items read through quote" on public.quote_items;
create policy "quote items read through quote"
on public.quote_items for select
using (
  exists (
    select 1 from public.quotes
    where quotes.id = quote_items.quote_id
      and quotes.organization_id = public.current_organization_id()
  )
);

drop policy if exists "quote items write through quote" on public.quote_items;
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

drop policy if exists "deals read same organization" on public.deals;
create policy "deals read same organization"
on public.deals for select
using (organization_id = public.current_organization_id());

drop policy if exists "deals write same organization" on public.deals;
create policy "deals write same organization"
on public.deals for all
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists "tasks read same organization" on public.tasks;
create policy "tasks read same organization"
on public.tasks for select
using (organization_id = public.current_organization_id());

drop policy if exists "tasks write same organization" on public.tasks;
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
