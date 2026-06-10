-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  nama_lengkap text        not null,
  nim          text        unique,
  peran        text        not null default 'mahasiswa' check (peran in ('admin','staf','mahasiswa')),
  avatar_url   text,
  no_hp        text,
  aktif        boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "pengguna lihat profil sendiri"
  on public.profiles for select using (auth.uid() = id);

create policy "admin lihat semua profil"
  on public.profiles for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.peran = 'admin')
  );

create policy "pengguna update profil sendiri"
  on public.profiles for update using (auth.uid() = id);

create policy "service role full access profiles"
  on public.profiles for all using (auth.role() = 'service_role');

-- ============================================================
-- BUKU
-- ============================================================
create table if not exists public.buku (
  id              uuid primary key default gen_random_uuid(),
  judul           text        not null,
  pengarang       text        not null,
  isbn            text,
  penerbit        text,
  tahun_terbit    int,
  genre           text        not null,
  deskripsi       text,
  cover_url       text,
  total_eksemplar int         not null default 1,
  tersedia        int         not null default 1,
  lokasi_rak      text,
  bahasa          text        not null default 'Indonesia',
  jumlah_halaman  int,
  aktif           boolean     not null default true,
  dibuat_oleh     uuid        references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.buku enable row level security;

create policy "semua bisa lihat buku aktif"
  on public.buku for select using (aktif = true);

create policy "admin dan staf kelola buku"
  on public.buku for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.peran in ('admin','staf'))
  );

-- ============================================================
-- PEMINJAMAN
-- ============================================================
create table if not exists public.peminjaman (
  id            uuid primary key default gen_random_uuid(),
  buku_id       uuid        not null references public.buku(id) on delete restrict,
  peminjam_id   uuid        not null references public.profiles(id) on delete restrict,
  staf_id       uuid        references public.profiles(id) on delete set null,
  dipinjam_pada timestamptz not null default now(),
  tenggat       timestamptz not null,
  dikembalikan  timestamptz,
  status        text        not null default 'aktif' check (status in ('aktif','dikembalikan','terlambat','hilang')),
  catatan       text,
  denda         int         not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.peminjaman enable row level security;

create policy "mahasiswa lihat peminjaman sendiri"
  on public.peminjaman for select using (peminjam_id = auth.uid());

create policy "admin dan staf lihat semua peminjaman"
  on public.peminjaman for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.peran in ('admin','staf'))
  );

create policy "mahasiswa bisa pinjam"
  on public.peminjaman for insert with check (peminjam_id = auth.uid());

create policy "admin dan staf update peminjaman"
  on public.peminjaman for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.peran in ('admin','staf'))
  );

-- ============================================================
-- NOTIFIKASI
-- ============================================================
create table if not exists public.notifikasi (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  tipe       text        not null,
  judul      text        not null,
  pesan      text        not null,
  dibaca     boolean     not null default false,
  metadata   jsonb,
  created_at timestamptz not null default now()
);

alter table public.notifikasi enable row level security;

create policy "pengguna lihat notifikasi sendiri"
  on public.notifikasi for select using (user_id = auth.uid());

create policy "pengguna update notifikasi sendiri"
  on public.notifikasi for update using (user_id = auth.uid());

create policy "service role full access notifikasi"
  on public.notifikasi for all using (auth.role() = 'service_role');

-- ============================================================
-- TRIGGER: updated_at otomatis
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace trigger trg_buku_updated_at
  before update on public.buku
  for each row execute function public.set_updated_at();

create or replace trigger trg_peminjaman_updated_at
  before update on public.peminjaman
  for each row execute function public.set_updated_at();

-- ============================================================
-- TRIGGER: sinkron stok buku
-- ============================================================
create or replace function public.update_stok_buku()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.buku set tersedia = tersedia - 1
    where id = new.buku_id and tersedia > 0;
  elsif TG_OP = 'UPDATE' then
    if old.status in ('aktif','terlambat') and new.status in ('dikembalikan','hilang') then
      update public.buku set tersedia = tersedia + 1
      where id = new.buku_id;
    end if;
  end if;
  return new;
end;
$$;

create or replace trigger trg_stok_buku
  after insert or update on public.peminjaman
  for each row execute function public.update_stok_buku();
