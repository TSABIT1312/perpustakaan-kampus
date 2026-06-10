export type Peran = "admin" | "staf" | "mahasiswa"

export type StatusPeminjaman = "aktif" | "dikembalikan" | "terlambat" | "hilang"

export type TipeNotifikasi =
  | "segera_tenggat"
  | "terlambat"
  | "dikembalikan"
  | "buku_tersedia"
  | "sistem"
  | "buku_baru"

export interface Profil {
  id: string
  nama_lengkap: string
  nim: string | null
  peran: Peran
  avatar_url: string | null
  no_hp: string | null
  aktif: boolean
  created_at: string
  updated_at: string
}

export interface Buku {
  id: string
  judul: string
  pengarang: string
  isbn: string | null
  penerbit: string | null
  tahun_terbit: number | null
  genre: string
  deskripsi: string | null
  cover_url: string | null
  total_eksemplar: number
  tersedia: number
  lokasi_rak: string | null
  bahasa: string
  jumlah_halaman: number | null
  aktif: boolean
  dibuat_oleh: string | null
  created_at: string
  updated_at: string
}

export interface Peminjaman {
  id: string
  buku_id: string
  peminjam_id: string
  staf_id: string | null
  dipinjam_pada: string
  tenggat: string
  dikembalikan: string | null
  status: StatusPeminjaman
  catatan: string | null
  denda: number
  created_at: string
  updated_at: string
  buku?: Buku
  peminjam?: Profil
}

export interface Notifikasi {
  id: string
  user_id: string
  tipe: TipeNotifikasi
  judul: string
  pesan: string
  dibaca: boolean
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface StatsDashboard {
  total_buku: number
  total_peminjaman_aktif: number
  total_anggota: number
  total_terlambat: number
  buku_populer: Array<{ id: string; judul: string; pengarang: string; cover_url: string | null; jumlah_pinjam: number }>
  aktivitas_terbaru: Array<{
    id: string
    tipe: "pinjam" | "kembali"
    nama_peminjam: string
    judul_buku: string
    waktu: string
  }>
}

export interface FilterBuku {
  q?: string
  genre?: string
  tersedia?: boolean
  bahasa?: string
  tahun?: number
  page?: number
}

export interface FilterPeminjaman {
  status?: StatusPeminjaman
  page?: number
}

export type ViewMode = "grid" | "list"
