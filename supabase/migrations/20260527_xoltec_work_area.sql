alter table public.products
add column if not exists work_area text not null default '';

alter table public.quote_items
add column if not exists work_area text not null default '';

