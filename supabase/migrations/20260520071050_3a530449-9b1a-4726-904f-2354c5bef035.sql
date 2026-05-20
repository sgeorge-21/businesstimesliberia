create schema if not exists private;

grant usage on schema private to anon, authenticated, service_role;

create or replace function private.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

grant execute on function private.has_role(uuid, public.app_role) to anon, authenticated, service_role;

alter policy "roles self read" on public.user_roles
using ((auth.uid() = user_id) or private.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "roles admin manage" on public.user_roles
using (private.has_role(auth.uid(), 'admin'::public.app_role))
with check (private.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "stories public read" on public.stories
using ((status = 'published'::text) or private.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "stories admin write" on public.stories
using (private.has_role(auth.uid(), 'admin'::public.app_role))
with check (private.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "podcasts public read" on public.podcasts
using ((status = 'published'::text) or private.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "podcasts admin write" on public.podcasts
using (private.has_role(auth.uid(), 'admin'::public.app_role))
with check (private.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "videos public read" on public.videos
using ((status = 'published'::text) or private.has_role(auth.uid(), 'admin'::public.app_role));

alter policy "videos admin write" on public.videos
using (private.has_role(auth.uid(), 'admin'::public.app_role))
with check (private.has_role(auth.uid(), 'admin'::public.app_role));

revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke all on schema private from public;