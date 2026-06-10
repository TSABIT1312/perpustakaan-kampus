import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getStatsDashboard, getDataGrafik } from "@/actions/analitik"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalitikCharts } from "./analitik-charts"
import { formatRupiah } from "@/lib/utils"
import { TrendingUp, BookOpen, Users, AlertTriangle } from "lucide-react"

export const metadata: Metadata = { title: "Analitik" }

export default async function AnalitikPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profil } = await supabase
    .from("profiles")
    .select("peran")
    .eq("id", user.id)
    .single()

  if (profil?.peran !== "admin") redirect("/dashboard")

  const [stats, grafik] = await Promise.all([
    getStatsDashboard(),
    getDataGrafik(12),
  ])

  const { data: dendaResult } = await supabase
    .from("peminjaman")
    .select("denda")
    .gt("denda", 0)

  const totalDenda = dendaResult?.reduce((sum, p) => sum + (p.denda ?? 0), 0) ?? 0

  const metrik = [
    { label: "Total Koleksi Buku", value: stats.total_buku.toString(), icon: BookOpen, color: "brand" },
    { label: "Peminjaman Aktif", value: stats.total_peminjaman_aktif.toString(), icon: TrendingUp, color: "success" },
    { label: "Total Anggota", value: stats.total_anggota.toString(), icon: Users, color: "warning" },
    { label: "Buku Terlambat", value: stats.total_terlambat.toString(), icon: AlertTriangle, color: "error" },
    { label: "Total Denda", value: formatRupiah(totalDenda), icon: TrendingUp, color: "brand" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Analitik</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          Ringkasan performa dan statistik perpustakaan
        </p>
      </div>

      {/* Metrik */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {metrik.map((m) => (
          <Card key={m.label} padding="sm">
            <p className="text-xs text-[var(--text-tertiary)]">{m.label}</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{m.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <AnalitikCharts data={grafik} bukuPopuler={stats.buku_populer as Parameters<typeof AnalitikCharts>[0]["bukuPopuler"]} />
    </div>
  )
}
