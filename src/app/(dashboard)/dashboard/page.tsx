import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { getStatsDashboard, getStatsMahasiswa } from "@/actions/analitik"
import { StatsCard } from "@/components/dashboard/stats-card"
import { AktivitasFeed } from "@/components/dashboard/aktivitas-feed"
import { BukuPopuler } from "@/components/dashboard/buku-populer"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardChart } from "./dashboard-chart"
import { DashboardMahasiswa } from "./dashboard-mahasiswa"

export const metadata: Metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let peran = "mahasiswa"
  if (user) {
    const { data: profil } = await supabase
      .from("profiles")
      .select("peran")
      .eq("id", user.id)
      .single()
    peran = profil?.peran ?? "mahasiswa"
  }

  if (peran === "mahasiswa") {
    const stats = await getStatsMahasiswa()
    return <DashboardMahasiswa stats={stats} />
  }

  const stats = await getStatsDashboard()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Koleksi" value={stats.total_buku} icon="BookOpen" color="brand" />
        <StatsCard label="Dipinjam" value={stats.total_peminjaman_aktif} icon="BookMarked" color="success" />
        <StatsCard label="Anggota Aktif" value={stats.total_anggota} icon="Users" color="warning" />
        <StatsCard label="Terlambat" value={stats.total_terlambat} icon="AlertTriangle" color="error" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Aktivitas Peminjaman</CardTitle>
            <p className="text-xs text-[var(--text-tertiary)]">6 bulan terakhir</p>
          </CardHeader>
          <DashboardChart />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <AktivitasFeed items={stats.aktivitas_terbaru} />
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buku Paling Banyak Dipinjam</CardTitle>
        </CardHeader>
        <BukuPopuler items={stats.buku_populer as Parameters<typeof BukuPopuler>[0]["items"]} />
      </Card>
    </div>
  )
}
