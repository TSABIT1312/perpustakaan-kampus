export const PERAN = {
  ADMIN: "admin",
  STAF: "staf",
  MAHASISWA: "mahasiswa",
} as const

export type Peran = (typeof PERAN)[keyof typeof PERAN]

export const STATUS_PEMINJAMAN = {
  AKTIF: "aktif",
  DIKEMBALIKAN: "dikembalikan",
  TERLAMBAT: "terlambat",
  HILANG: "hilang",
} as const

export type StatusPeminjaman = (typeof STATUS_PEMINJAMAN)[keyof typeof STATUS_PEMINJAMAN]

export const TIPE_NOTIFIKASI = {
  SEGERA_TENGGAT: "segera_tenggat",
  TERLAMBAT: "terlambat",
  DIKEMBALIKAN: "dikembalikan",
  BUKU_TERSEDIA: "buku_tersedia",
  SISTEM: "sistem",
  BUKU_BARU: "buku_baru",
} as const

export const MAKS_HARI_PINJAM = 14
export const DENDA_PER_HARI = 1000

export const GENRE_BUKU = [
  "Teknologi Informasi",
  "Ilmu Komputer",
  "Matematika",
  "Fisika",
  "Kimia",
  "Biologi",
  "Ekonomi",
  "Manajemen",
  "Akuntansi",
  "Hukum",
  "Psikologi",
  "Sosiologi",
  "Sejarah",
  "Filsafat",
  "Sastra",
  "Pendidikan",
  "Kesehatan",
  "Teknik",
  "Arsitektur",
  "Seni & Desain",
  "Agama",
  "Politik",
  "Lainnya",
] as const

export const BAHASA_BUKU = [
  "Indonesia",
  "Inggris",
  "Arab",
  "Jepang",
  "Mandarin",
  "Lainnya",
] as const

export const ITEM_PER_HALAMAN = 12

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    peran: ["admin", "staf", "mahasiswa"],
  },
  {
    label: "Koleksi Buku",
    href: "/buku",
    icon: "BookOpen",
    peran: ["admin", "staf", "mahasiswa"],
  },
  {
    label: "Peminjaman",
    href: "/peminjaman",
    icon: "BookMarked",
    peran: ["admin", "staf", "mahasiswa"],
  },
  {
    label: "Notifikasi",
    href: "/notifikasi",
    icon: "Bell",
    peran: ["admin", "staf", "mahasiswa"],
  },
  {
    label: "Analitik",
    href: "/analitik",
    icon: "BarChart3",
    peran: ["admin"],
  },
] as const
