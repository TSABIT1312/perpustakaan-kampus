"use server"

import { SignJWT } from "jose"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

interface MahasiswaSipro {
  nim: string
  nama: string
  tanggal_lahir: string | null
  email: string | null
  no_hp: string | null
  foto_url: string | null
}

export interface SyncResult {
  total: number
  berhasil: number
  dilewati: number
  gagal: number
}

async function siproToken() {
  const secret = process.env.SIPRO_JWT_SECRET
  if (!secret) throw new Error("SIPRO_JWT_SECRET tidak dikonfigurasi")
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(secret))
}

function tanggalLahirKePassword(tanggalLahir: string | null, fallback: string): string {
  if (!tanggalLahir) return fallback
  // SIPRO returns ISO datetime: "2005-04-17T00:00:00.000Z" — ambil 10 char pertama saja
  return tanggalLahir.substring(0, 10).replace(/-/g, "")
}

async function siproFetch(path: string) {
  const base = process.env.SIPRO_API_URL ?? "http://localhost:3000"
  const token = await siproToken()
  const res = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Sipro API error: ${res.status}`)
  return res.json()
}

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Tidak terautentikasi")
  const { data: profil } = await supabase
    .from("profiles")
    .select("peran")
    .eq("id", user.id)
    .single()
  if (profil?.peran !== "admin") throw new Error("Hanya admin yang dapat melakukan sinkronisasi")
}

export async function syncMahasiswaSipro(): Promise<SyncResult> {
  await requireAdmin()

  const rows: MahasiswaSipro[] = await siproFetch("/api/mahasiswa")
  const admin = createAdminClient()

  // Fetch all existing NIMs in one query
  const { data: existing } = await admin.from("profiles").select("nim").not("nim", "is", null)
  const existingNims = new Set((existing ?? []).map((p: { nim: string }) => p.nim))

  let berhasil = 0
  let dilewati = 0
  let gagal = 0

  for (const mhs of rows) {
    if (existingNims.has(mhs.nim)) {
      dilewati++
      continue
    }

    const email = `${mhs.nim}@mahasiswa.perpus.id`
    const password = tanggalLahirKePassword(mhs.tanggal_lahir, mhs.nim)

    try {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nama_lengkap: mhs.nama, peran: "mahasiswa" },
      })

      if (createErr || !created.user) { gagal++; continue }

      const { error: profileErr } = await admin.from("profiles").upsert({
        id: created.user.id,
        nama_lengkap: mhs.nama,
        nim: mhs.nim,
        peran: "mahasiswa",
        no_hp: mhs.no_hp ?? null,
        aktif: true,
      })

      if (profileErr) {
        await admin.auth.admin.deleteUser(created.user.id)
        gagal++
        continue
      }

      berhasil++
    } catch {
      gagal++
    }
  }

  return { total: rows.length, berhasil, dilewati, gagal }
}

export async function createAkunAdmin(
  email: string,
  password: string,
  namaLengkap: string,
): Promise<{ id: string; email: string }> {
  const admin = createAdminClient()

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nama_lengkap: namaLengkap, peran: "admin" },
  })

  if (error) throw new Error(error.message)
  if (!data.user) throw new Error("Gagal membuat pengguna")

  const { error: profileErr } = await admin.from("profiles").upsert({
    id: data.user.id,
    nama_lengkap: namaLengkap,
    peran: "admin",
    aktif: true,
  })

  if (profileErr) {
    await admin.auth.admin.deleteUser(data.user.id)
    throw new Error(profileErr.message)
  }

  return { id: data.user.id, email }
}

export async function getJumlahMahasiswaSipro(): Promise<number> {
  await requireAdmin()
  try {
    const rows: MahasiswaSipro[] = await siproFetch("/api/mahasiswa")
    return rows.length
  } catch {
    return 0
  }
}

export async function getMahasiswaByNim(nim: string): Promise<MahasiswaSipro | null> {
  const rows: MahasiswaSipro[] = await siproFetch("/api/mahasiswa")
  return rows.find((m) => m.nim === nim) ?? null
}

