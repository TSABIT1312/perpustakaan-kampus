import Link from "next/link"
import { BookOpen, BookMarked, Clock, History } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

type PeminjamanAktif = {
  id: string
  dipinjam_pada: string
  tenggat: string
  status: string
  buku: unknown
}

type StatsMahasiswa = {
  total_dipinjam: number
  total_terlambat: number
  total_riwayat: number
  peminjaman_aktif: PeminjamanAktif[]
} | null

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function sisaHari(tenggat: string) {
  return Math.ceil((new Date(tenggat).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export async function DashboardMahasiswa({ stats }: { stats: StatsMahasiswa }) {
  const supabase = await createClient()
  const { count: totalBuku } = await supabase
    .from("buku")
    .select("*", { count: "exact", head: true })
    .eq("aktif", true)

  if (!stats) {
    return (
      <div className="text-sm text-[var(--text-secondary)] p-4">
        Gagal memuat data. Coba refresh halaman.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          label="Sedang Dipinjam"
          value={stats.total_dipinjam}
          icon="BookMarked"
          color="brand"
        />
        <StatsCard
          label="Terlambat"
          value={stats.total_terlambat}
          icon="AlertTriangle"
          color="error"
        />
        <StatsCard
          label="Total Riwayat"
          value={stats.total_riwayat}
          icon="BookOpen"
          color="success"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Peminjaman aktif */}
        <Card>
          <CardHeader>
            <CardTitle>Peminjaman Aktif</CardTitle>
            <p className="text-xs text-[var(--text-tertiary)]">Buku yang sedang kamu pinjam</p>
          </CardHeader>
          <div className="px-4 pb-4 space-y-3">
            {stats.peminjaman_aktif.length === 0 ? (
              <p className="text-sm text-[var(--text-tertiary)] py-4 text-center">
                Kamu tidak sedang meminjam buku.{" "}
                <Link href="/buku" className="text-[var(--brand)] hover:underline">
                  Cari buku
                </Link>
              </p>
            ) : (
              stats.peminjaman_aktif.map((p) => {
                const buku = p.buku as { judul?: string; pengarang?: string } | null
                const sisa = sisaHari(p.tenggat)
                const terlambat = p.status === "terlambat" || sisa < 0
                return (
                  <div
                    key={p.id}
                    className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--bg-subtle)] border border-[var(--border-color)]"
                  >
                    <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--brand-subtle)] shrink-0">
                      <BookMarked size={14} className="text-[var(--brand)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {buku?.judul ?? "–"}
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">{buku?.pengarang ?? "–"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock
                          size={11}
                          className={terlambat ? "text-[var(--error)]" : "text-[var(--text-tertiary)]"}
                        />
                        <span
                          className={`text-xs ${terlambat ? "text-[var(--error)] font-medium" : "text-[var(--text-tertiary)]"}`}
                        >
                          {terlambat
                            ? sisa < 0
                              ? `Terlambat ${Math.abs(sisa)} hari`
                              : "Terlambat"
                            : `Tenggat ${formatTanggal(p.tenggat)} (${sisa} hari lagi)`}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            {stats.peminjaman_aktif.length > 0 && (
              <Link
                href="/peminjaman"
                className="block text-center text-xs text-[var(--brand)] hover:underline pt-1"
              >
                Lihat semua riwayat →
              </Link>
            )}
          </div>
        </Card>

        {/* Info koleksi perpustakaan */}
        <Card>
          <CardHeader>
            <CardTitle>Koleksi Perpustakaan</CardTitle>
            <p className="text-xs text-[var(--text-tertiary)]">Info ketersediaan buku</p>
          </CardHeader>
          <div className="px-4 pb-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--bg-subtle)]">
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-[var(--brand)]" />
                <span className="text-sm text-[var(--text-secondary)]">Total Koleksi</span>
              </div>
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {(totalBuku ?? 0).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--bg-subtle)]">
              <div className="flex items-center gap-2">
                <History size={14} className="text-[var(--success)]" />
                <span className="text-sm text-[var(--text-secondary)]">Dipinjam (saya)</span>
              </div>
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {stats.total_riwayat}
              </span>
            </div>
            <Link
              href="/buku"
              className="block w-full text-center text-sm font-medium text-[var(--brand)] border border-[var(--brand)] rounded-[var(--radius-md)] py-2 hover:bg-[var(--brand-subtle)] transition-colors mt-2"
            >
              Cari Buku
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
