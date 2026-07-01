alter table public.profiles
  add column if not exists first_login_at timestamptz,
  add column if not exists last_login_at timestamptz,
  add column if not exists login_count integer not null default 0;

create index if not exists profiles_last_login_at_idx
  on public.profiles (last_login_at);

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can view own profile'
  ) then
    create policy "Users can view own profile"
      on public.profiles
      for select
      to authenticated
      using ((select auth.uid()) = id);
  end if;
end $$;

drop policy if exists "Users can update own login tracking" on public.profiles;

create or replace function public.record_profile_login()
returns table(first_login_at timestamptz, last_login_at timestamptz, login_count integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  update public.profiles
  set
    first_login_at = coalesce(public.profiles.first_login_at, now()),
    last_login_at = now(),
    login_count = coalesce(public.profiles.login_count, 0) + 1
  where id = current_user_id
  returning public.profiles.first_login_at, public.profiles.last_login_at, public.profiles.login_count
  into first_login_at, last_login_at, login_count;

  if not found then
    raise exception 'Profile not found';
  end if;

  return next;
end;
$$;

revoke all on function public.record_profile_login() from public;
revoke all on function public.record_profile_login() from anon;
grant execute on function public.record_profile_login() to authenticated;
