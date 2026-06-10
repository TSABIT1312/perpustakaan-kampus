"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Terjadi Kesalahan</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-sm">
        {error.message || "Sesuatu berjalan tidak semestinya. Coba lagi."}
      </p>
      <Button onClick={reset}>Coba Lagi</Button>
    </div>
  )
}
