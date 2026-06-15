create or replace function public.sync_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (
    id,
    organization_id,
    username,
    full_name,
    position,
    role,
    signature_url
  )
  values (
    new.id,
    '00000000-0000-4000-8000-000000000001',
    coalesce(new.email, ''),
    upper(coalesce(new.raw_user_meta_data->>'full_name', new.email, 'USUARIO')),
    upper(coalesce(new.raw_user_meta_data->>'position', '')),
    coalesce(new.raw_user_meta_data->>'role', 'seller'),
    null
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists sync_auth_user_profile on auth.users;
create trigger sync_auth_user_profile
after insert on auth.users
for each row execute function public.sync_auth_user_profile();

insert into public.profiles (
  id,
  organization_id,
  username,
  full_name,
  position,
  role,
  signature_url
)
select
  auth_users.id,
  '00000000-0000-4000-8000-000000000001',
  coalesce(auth_users.email, ''),
  upper(coalesce(auth_users.raw_user_meta_data->>'full_name', auth_users.email, 'USUARIO')),
  upper(coalesce(auth_users.raw_user_meta_data->>'position', '')),
  coalesce(auth_users.raw_user_meta_data->>'role', 'seller'),
  null
from auth.users as auth_users
left join public.profiles on profiles.id = auth_users.id
where profiles.id is null;

