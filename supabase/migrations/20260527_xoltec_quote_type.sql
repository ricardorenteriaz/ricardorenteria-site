alter table public.quotes
add column if not exists quote_type text not null default 'solar';

