"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createAkunAdmin } from "@/actions/sync-sipro"
import { cn } from "@/lib/utils"

const schema = z.object({
  namaLengkap: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
})

type FormValues = z.infer<typeof schema>

export function BuatAdminForm() {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  function onSubmit(values: FormValues) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      try {
        const result = await createAkunAdmin(values.email, values.password, values.namaLengkap)
        setSuccess(`Akun admin berhasil dibuat untuk ${result.email}`)
        reset()
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
          Nama Lengkap
        </label>
        <input
          {...register("namaLengkap")}
          placeholder="Nama administrator"
          className={cn(
            "w-full h-9 px-3 text-sm rounded-[var(--radius-md)] border bg-[var(--bg-base)] text-[var(--text-primary)] outline-none transition-colors",
            "border-[var(--border-color)] focus:border-[var(--brand)] placeholder:text-[var(--text-tertiary)]",
            errors.namaLengkap && "border-[var(--error)]",
          )}
        />
        {errors.namaLengkap && (
          <p className="mt-1 text-xs text-[var(--error)]">{errors.namaLengkap.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="admin@perpustakaan.id"
          className={cn(
            "w-full h-9 px-3 text-sm rounded-[var(--radius-md)] border bg-[var(--bg-base)] text-[var(--text-primary)] outline-none transition-colors",
            "border-[var(--border-color)] focus:border-[var(--brand)] placeholder:text-[var(--text-tertiary)]",
            errors.email && "border-[var(--error)]",
          )}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-[var(--error)]">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
          Kata Sandi
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="Minimal 8 karakter"
          className={cn(
            "w-full h-9 px-3 text-sm rounded-[var(--radius-md)] border bg-[var(--bg-base)] text-[var(--text-primary)] outline-none transition-colors",
            "border-[var(--border-color)] focus:border-[var(--brand)] placeholder:text-[var(--text-tertiary)]",
            errors.password && "border-[var(--error)]",
          )}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-[var(--error)]">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[var(--radius-md)] text-sm font-medium bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ShieldCheck size={15} />
        {isPending ? "Membuat akun..." : "Buat Akun Admin"}
      </button>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--success)] bg-[var(--success-subtle)] px-3 py-2.5"
          >
            <CheckCircle2 size={15} className="text-[var(--success)] shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--success)]">{success}</p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--error)] bg-[var(--error-subtle)] px-3 py-2.5"
          >
            <AlertCircle size={15} className="text-[var(--error)] shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--error)]">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
