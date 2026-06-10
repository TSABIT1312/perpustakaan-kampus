"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { bukuSchema } from "@/lib/validations/buku"
import type { FilterBuku } from "@/types"

async function getPeran() {
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

export async function getBuku(filter: FilterBuku = {}) {
  const supabase = await createClient()
  const { q, genre, tersedia, bahasa, tahun, page = 1 } = filter
  const limit = 12
  const offset = (page - 1) * limit

  let query = supabase
    .from("buku")
    .select("*", { count: "exact" })
    .eq("aktif", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (q) query = query.or(`judul.ilike.%${q}%,pengarang.ilike.%${q}%`)
  if (genre) query = query.eq("genre", genre)
  if (tersedia) query = query.gt("tersedia", 0)
  if (bahasa) query = query.eq("bahasa", bahasa)
  if (tahun) query = query.eq("tahun_terbit", tahun)

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return { data: data ?? [], total: count ?? 0, halaman: page, limit }
}

export async function getBukuById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("buku")
    .select("*")
    .eq("id", id)
    .eq("aktif", true)
    .single()

  if (error) return null
  return data
}

export async function createBuku(formData: unknown) {
  const { user, profil, supabase } = await getPeran()

  if (!profil || !["admin", "staf"].includes(profil.peran)) {
    throw new Error("Tidak memiliki izin")
  }

  const validated = bukuSchema.parse(formData)
  const { data, error } = await supabase
    .from("buku")
    .insert({ ...validated, dibuat_oleh: user.id })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath("/buku")
  return data
}

export async function updateBuku(id: string, formData: unknown) {
  const { profil, supabase } = await getPeran()

  if (!profil || !["admin", "staf"].includes(profil.peran)) {
    throw new Error("Tidak memiliki izin")
  }

  const validated = bukuSchema.parse(formData)
  const { data, error } = await supabase
    .from("buku")
    .update(validated)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath("/buku")
  revalidatePath(`/buku/${id}`)
  return data
}

export async function deleteBuku(id: string) {
  const { profil, supabase } = await getPeran()

  if (!profil || profil.peran !== "admin") {
    throw new Error("Hanya admin yang dapat menghapus buku")
  }

  const { error } = await supabase
    .from("buku")
    .update({ aktif: false })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/buku")
}

export async function uploadCoverBuku(formData: FormData) {
  const { supabase } = await getPeran()
  const file = formData.get("file") as File
  if (!file) throw new Error("File tidak ditemukan")

  const ext = file.name.split(".").pop()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabase.storage
    .from("book-covers")
    .upload(filename, file, { contentType: file.type, upsert: false })

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage
    .from("book-covers")
    .getPublicUrl(data.path)

  return publicUrl
}
