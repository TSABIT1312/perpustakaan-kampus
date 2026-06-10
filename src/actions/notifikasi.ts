"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function getNotifikasi() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("notifikasi")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  return data ?? []
}

export async function getJumlahBelumDibaca() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count } = await supabase
    .from("notifikasi")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("dibaca", false)

  return count ?? 0
}

export async function tandaiDibaca(id: string) {
  const supabase = await createClient()
  await supabase
    .from("notifikasi")
    .update({ dibaca: true })
    .eq("id", id)

  revalidatePath("/notifikasi")
}

export async function tandaiSemuaDibaca() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from("notifikasi")
    .update({ dibaca: true })
    .eq("user_id", user.id)
    .eq("dibaca", false)

  revalidatePath("/notifikasi")
}
