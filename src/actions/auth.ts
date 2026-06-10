"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { loginSchema, registerSchema } from "@/lib/validations/auth"
import { getMahasiswaByNim } from "@/actions/sync-sipro"

export async function masuk(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const result = loginSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(result.data)

  if (error) {
    return { error: "Email atau kata sandi salah." }
  }

  redirect("/dashboard")
}

export async function daftar(formData: FormData) {
  const raw = {
    nama_lengkap: formData.get("nama_lengkap") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    nim: formData.get("nim") as string,
  }

  const result = registerSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        nama_lengkap: result.data.nama_lengkap,
        nim: result.data.nim,
        peran: "mahasiswa",
      },
    },
  })

  if (error) {
    return { error: "Gagal membuat akun. Coba lagi." }
  }

  redirect("/dashboard")
}

export async function loginDenganSipro(
  nim: string,
  tanggalLahir: string, // format YYYY-MM-DD dari date input
): Promise<{ actionLink?: string; error?: string }> {
  const trimmedNim = nim.trim()
  const password = tanggalLahir.replace(/-/g, "") // "2005-04-17" → "20050417"
  const email = `${trimmedNim}@mahasiswa.perpus.id`
  const admin = createAdminClient()

  // Cek apakah akun sudah ada
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("nim", trimmedNim)
    .single()

  if (!existingProfile) {
    // Belum ada akun — cari di SIPRO untuk auto-provisioning
    let mhs: Awaited<ReturnType<typeof getMahasiswaByNim>>
    try {
      mhs = await getMahasiswaByNim(trimmedNim)
    } catch {
      return { error: "Tidak dapat terhubung ke sistem akademik. Coba lagi." }
    }

    if (!mhs) {
      return { error: "NIM tidak terdaftar di sistem akademik." }
    }

    // Verifikasi tanggal lahir cocok dengan data SIPRO
    const siproPassword = mhs.tanggal_lahir
      ? mhs.tanggal_lahir.substring(0, 10).replace(/-/g, "")
      : ""
    if (siproPassword && siproPassword !== password) {
      return { error: "Tanggal lahir tidak sesuai dengan data akademik." }
    }

    // Buat akun Supabase
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nama_lengkap: mhs.nama, peran: "mahasiswa" },
    })

    if (createErr || !created.user) {
      return { error: "Gagal membuat akun. Coba lagi." }
    }

    const { error: profileErr } = await admin.from("profiles").upsert({
      id: created.user.id,
      nama_lengkap: mhs.nama,
      nim: trimmedNim,
      peran: "mahasiswa",
      no_hp: mhs.no_hp ?? null,
      aktif: true,
    })

    if (profileErr) {
      await admin.auth.admin.deleteUser(created.user.id)
      return { error: "Gagal menyimpan profil. Coba lagi." }
    }
  } else {
    // Akun sudah ada — verifikasi password dengan mencoba sign in
    const supabase = await createClient()
    const { error: verifyErr } = await supabase.auth.signInWithPassword({ email, password })
    if (verifyErr) {
      return { error: "Tanggal lahir tidak sesuai dengan data terdaftar." }
    }
    // Sign out dulu, biar magic link yang handle sesi baru
    await supabase.auth.signOut()
  }

  // Pakai magic link untuk propagasi sesi yang reliable ke browser
  // (signInWithPassword + redirect() di server action kadang tidak replace sesi lama)
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  })

  const tokenHash = linkData?.properties?.hashed_token
  if (linkErr || !tokenHash) {
    return { error: "Gagal membuat sesi login. Coba lagi." }
  }

  return {
    actionLink: `${appUrl}/auth/confirm?token_hash=${tokenHash}&type=magiclink&next=/dashboard`,
  }
}

export async function loginUniversal(
  username: string,
  password: string,
): Promise<{ actionLink?: string; error?: string } | undefined> {
  const trimmed = username.trim()

  if (trimmed.includes("@")) {
    // Admin / staf: login pakai email + password biasa
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: trimmed, password })
    if (error) return { error: "Username atau kata sandi salah." }
    redirect("/dashboard")
  }

  // Mahasiswa: username = NIM, password = tanggal lahir (YYYY-MM-DD atau YYYYMMDD)
  return loginDenganSipro(trimmed, password)
}

export async function keluar() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
