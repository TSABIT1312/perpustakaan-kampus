"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { addDays } from "date-fns"
import { MAKS_HARI_PINJAM } from "@/lib/constants"
import type { FilterPeminjaman } from "@/types"

async function getAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Tidak terautentikasi")

  const { data: profil } = await supabase
    .from("profiles")
    .select("peran")
    .eq("id", user.id)
    .single()

  return { user, profil, supabase }
}

export async function getPeminjaman(filter: FilterPeminjaman = {}) {
  const { user, profil, supabase } = await getAuth()
  const { status, page = 1 } = filter
  const limit = 10
  const offset = (page - 1) * limit

  let query = supabase
    .from("peminjaman")
    .select(`
      *,
      buku:buku_id(*),
      peminjam:peminjam_id(id, nama_lengkap, nim, avatar_url)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  // Mahasiswa hanya lihat milik sendiri
  if (profil?.peran === "mahasiswa") {
    query = query.eq("peminjam_id", user.id)
  }

  if (status) query = query.eq("status", status)

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return { data: data ?? [], total: count ?? 0 }
}

export async function pinjamBuku(bukuId: string) {
  const { user, supabase } = await getAuth()

  // Cek apakah sudah pinjam buku yang sama dan belum dikembalikan
  const { data: existing } = await supabase
    .from("peminjaman")
    .select("id")
    .eq("peminjam_id", user.id)
    .eq("buku_id", bukuId)
    .in("status", ["aktif", "terlambat"])
    .single()

  if (existing) {
    throw new Error("Kamu sudah meminjam buku ini dan belum mengembalikannya.")
  }

  const tenggat = addDays(new Date(), MAKS_HARI_PINJAM)

  const { data, error } = await supabase
    .from("peminjaman")
    .insert({
      buku_id: bukuId,
      peminjam_id: user.id,
      tenggat: tenggat.toISOString(),
      status: "aktif",
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath("/peminjaman")
  revalidatePath(`/buku/${bukuId}`)
  revalidatePath("/buku")
  return data
}

export async function kembalikanBuku(peminjamanId: string, catatan?: string) {
  const { profil, supabase } = await getAuth()

  if (!profil || !["admin", "staf"].includes(profil.peran)) {
    throw new Error("Hanya staf atau admin yang dapat memproses pengembalian")
  }

  const { data, error } = await supabase
    .from("peminjaman")
    .update({
      status: "dikembalikan",
      dikembalikan: new Date().toISOString(),
      catatan: catatan ?? null,
    })
    .eq("id", peminjamanId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath("/peminjaman")
  revalidatePath("/buku")
  revalidatePath("/dashboard")
  return data
}

export async function ajukanPengembalian(peminjamanId: string) {
  const { user, profil } = await getAuth()

  if (profil?.peran !== "mahasiswa") {
    throw new Error("Fitur ini hanya untuk mahasiswa")
  }

  const admin = createAdminClient()

  // Verifikasi peminjaman benar-benar milik mahasiswa ini
  const { data: p, error: findErr } = await admin
    .from("peminjaman")
    .select("id, peminjam_id, buku_id, status, buku:buku_id(judul)")
    .eq("id", peminjamanId)
    .eq("peminjam_id", user.id)
    .in("status", ["aktif", "terlambat"])
    .single()

  if (findErr || !p) {
    throw new Error("Peminjaman tidak ditemukan atau sudah dikembalikan")
  }

  // Tandai sebagai dikembalikan
  const { data, error } = await admin
    .from("peminjaman")
    .update({
      status: "dikembalikan",
      dikembalikan: new Date().toISOString(),
      catatan: "Dikembalikan oleh mahasiswa melalui aplikasi",
    })
    .eq("id", peminjamanId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath("/peminjaman")
  revalidatePath("/dashboard")
  revalidatePath("/buku")
  return data
}
