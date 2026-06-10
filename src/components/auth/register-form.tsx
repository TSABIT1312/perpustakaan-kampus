"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { Eye, EyeOff, Mail, Lock, User, Hash } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fadeUp } from "@/lib/motion"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"
import { daftar } from "@/actions/auth"

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterInput) => {
    setServerError(null)
    startTransition(async () => {
      const fd = new FormData()
      fd.set("nama_lengkap", data.nama_lengkap)
      fd.set("email", data.email)
      fd.set("password", data.password)
      if (data.nim) fd.set("nim", data.nim)
      const result = await daftar(fd)
      if (result?.error) setServerError(result.error)
    })
  }

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Buat Akun</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Daftar untuk mengakses perpustakaan
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nama Lengkap"
          type="text"
          placeholder="Nama lengkap kamu"
          leftIcon={<User size={15} />}
          error={errors.nama_lengkap?.message}
          {...register("nama_lengkap")}
        />

        <Input
          label="NIM (opsional)"
          type="text"
          placeholder="Nomor Induk Mahasiswa"
          leftIcon={<Hash size={15} />}
          hint="Kosongkan jika bukan mahasiswa"
          error={errors.nim?.message}
          {...register("nim")}
        />

        <Input
          label="Email"
          type="email"
          placeholder="nama@kampus.ac.id"
          leftIcon={<Mail size={15} />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Kata Sandi"
          type={showPassword ? "text" : "password"}
          placeholder="Minimal 8 karakter"
          leftIcon={<Lock size={15} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          error={errors.password?.message}
          {...register("password")}
        />

        {serverError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-[var(--error)] bg-[var(--error-subtle)] px-3 py-2 rounded-[var(--radius-md)]"
          >
            {serverError}
          </motion.p>
        )}

        <Button type="submit" className="w-full" loading={isPending}>
          {isPending ? "Membuat akun..." : "Buat Akun"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-[var(--text-secondary)]">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-[var(--brand)] hover:underline font-medium"
        >
          Masuk
        </Link>
      </p>
    </motion.div>
  )
}
