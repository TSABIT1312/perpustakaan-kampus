"use server"

import { createClient } from "@/lib/supabase/server"

export async function getStatsDashboard() {
  const supabase = await createClient()

  const [bukuResult, peminjamanResult, anggotaResult, terlambatResult] =
    await Promise.all([
      supabase.from("buku").select("*", { count: "exact", head: true }).eq("aktif", true),
      supabase
        .from("peminjaman")
        .select("*", { count: "exact", head: true })
        .in("status", ["aktif", "terlambat"]),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("peran", "mahasiswa"),
      supabase
        .from("peminjaman")
        .select("*", { count: "exact", head: true })
        .eq("status", "terlambat"),
    ])

  const { data: bukuPopuler } = await supabase
    .from("peminjaman")
    .select("buku_id, buku:buku_id(id, judul, pengarang, cover_url)")
    .not("buku_id", "is", null)
    .limit(100)

  const bukuCount = new Map<string, { count: number; buku: unknown }>()
  bukuPopuler?.forEach((p) => {
    if (!p.buku_id) return
    const existing = bukuCount.get(p.buku_id)
    if (existing) existing.count++
    else bukuCount.set(p.buku_id, { count: 1, buku: p.buku })
  })

  const topBuku = Array.from(bukuCount.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([id, { count, buku }]) => ({
      id,
      jumlah_pinjam: count,
      ...(buku as object),
    }))

  const { data: aktivitasTerbaru } = await supabase
    .from("peminjaman")
    .select(`
      id,
      status,
      dipinjam_pada,
      dikembalikan,
      peminjam:peminjam_id(nama_lengkap),
      buku:buku_id(judul)
    `)
    .order("created_at", { ascending: false })
    .limit(8)

  return {
    total_buku: bukuResult.count ?? 0,
    total_peminjaman_aktif: peminjamanResult.count ?? 0,
    total_anggota: anggotaResult.count ?? 0,
    total_terlambat: terlambatResult.count ?? 0,
    buku_populer: topBuku,
    aktivitas_terbaru:
      aktivitasTerbaru?.map((a) => ({
        id: a.id,
        tipe: a.dikembalikan ? ("kembali" as const) : ("pinjam" as const),
        nama_peminjam: (a.peminjam as unknown as { nama_lengkap: string } | null)?.nama_lengkap ?? "–",
        judul_buku: (a.buku as unknown as { judul: string } | null)?.judul ?? "–",
        waktu: a.dikembalikan ?? a.dipinjam_pada,
      })) ?? [],
  }
}

export async function getStatsMahasiswa() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [aktifResult, terlambatResult, totalResult] = await Promise.all([
    supabase
      .from("peminjaman")
      .select("*", { count: "exact", head: true })
      .eq("peminjam_id", user.id)
      .eq("status", "aktif"),
    supabase
      .from("peminjaman")
      .select("*", { count: "exact", head: true })
      .eq("peminjam_id", user.id)
      .eq("status", "terlambat"),
    supabase
      .from("peminjaman")
      .select("*", { count: "exact", head: true })
      .eq("peminjam_id", user.id),
  ])

  const { data: peminjamanAktif } = await supabase
    .from("peminjaman")
    .select(`
      id,
      dipinjam_pada,
      tenggat,
      status,
      buku:buku_id(judul, pengarang, cover_url)
    `)
    .eq("peminjam_id", user.id)
    .in("status", ["aktif", "terlambat"])
    .order("tenggat", { ascending: true })
    .limit(5)

  return {
    total_dipinjam: aktifResult.count ?? 0,
    total_terlambat: terlambatResult.count ?? 0,
    total_riwayat: totalResult.count ?? 0,
    peminjaman_aktif: peminjamanAktif ?? [],
  }
}

export async function getDataGrafik(bulan = 6) {
  const supabase = await createClient()

  const tanggalMulai = new Date()
  tanggalMulai.setMonth(tanggalMulai.getMonth() - bulan)

  const { data } = await supabase
    .from("peminjaman")
    .select("dipinjam_pada, status")
    .gte("dipinjam_pada", tanggalMulai.toISOString())
    .order("dipinjam_pada")

  const grouped = new Map<string, { pinjam: number; kembali: number }>()

  data?.forEach((p) => {
    const bulanKey = new Date(p.dipinjam_pada).toLocaleDateString("id-ID", {
      month: "short",
      year: "2-digit",
    })
    const existing = grouped.get(bulanKey) || { pinjam: 0, kembali: 0 }
    existing.pinjam++
    if (p.status === "dikembalikan") existing.kembali++
    grouped.set(bulanKey, existing)
  })

  return Array.from(grouped.entries()).map(([bulan, data]) => ({
    bulan,
    ...data,
  }))
}
