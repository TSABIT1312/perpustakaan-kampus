"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { Eye, EyeOff, User, Lock, Calendar } from "lucide-react"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { fadeUp } from "@/lib/motion"
import { loginUniversal } from "@/actions/auth"

const schema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(1, "Kata sandi / tanggal lahir wajib diisi"),
})
type FormInput = z.infer<typeof schema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormInput>({ resolver: zodResolver(schema) })
  const username = useWatch({ control: form.control, name: "username", defaultValue: "" })
  const isNIM = username.length > 0 && !username.includes("@")

  const onSubmit = (data: FormInput) => {
    setServerError(null)
    startTransition(async () => {
      const result = await loginUniversal(data.username, data.password)
      if (result?.error) {
        setServerError(result.error)
        return
      }
      if (result?.actionLink) {
        window.location.href = result.actionLink
      }
    })
  }

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Masuk</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Masuk ke sistem perpustakaan kampus
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username / NIM"
          type="text"
          placeholder="Email atau NIM"
          leftIcon={<User size={15} />}
          error={form.formState.errors.username?.message}
          {...form.register("username")}
        />

        {isNIM ? (
          <Input
            label="Tanggal Lahir"
            type="date"
            leftIcon={<Calendar size={15} />}
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
        ) : (
          <Input
            label="Kata Sandi"
            type={showPassword ? "text" : "password"}
            placeholder="Kata sandi kamu"
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
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
        )}

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
          {isPending ? "Memverifikasi..." : "Masuk"}
        </Button>
      </form>
    </motion.div>
  )
}
