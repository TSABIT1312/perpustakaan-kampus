-- FIX: Infinite recursion di profiles RLS policy
drop policy if exists "admin lihat semua profil" on public.profiles;

-- Helper function pakai security definer → bypass RLS, tidak rekursif
create or replace function public.auth_peran()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select peran from public.profiles where id = auth.uid()), '');
$$;

-- Ganti jadi: semua user yang login bisa baca profiles
create policy "authenticated lihat profil"
  on public.profiles for select
  using (auth.uid() is not null);

-- Update buku policies → pakai helper function
drop policy if exists "admin dan staf kelola buku" on public.buku;
create policy "admin dan staf kelola buku"
  on public.buku for all
  using (public.auth_peran() in ('admin','staf'));

-- Update peminjaman policies → pakai helper function
drop policy if exists "admin dan staf lihat semua peminjaman" on public.peminjaman;
create policy "admin dan staf lihat semua peminjaman"
  on public.peminjaman for select
  using (public.auth_peran() in ('admin','staf'));

drop policy if exists "admin dan staf update peminjaman" on public.peminjaman;
create policy "admin dan staf update peminjaman"
  on public.peminjaman for update
  using (public.auth_peran() in ('admin','staf'));
