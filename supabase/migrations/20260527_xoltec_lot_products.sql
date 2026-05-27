alter table public.products
add column if not exists is_lot boolean not null default false;

alter table public.quote_items
add column if not exists is_lot boolean not null default false;

