import { Library } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(79,70,229,0.12), transparent), " +
            "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(59,130,246,0.08), transparent)",
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="flex items-center justify-center h-9 w-9 rounded-[var(--radius-md)] bg-[var(--brand)] text-white shadow-[var(--shadow-md)]">
          <Library size={18} />
        </div>
        <span className="font-semibold text-[var(--text-primary)]">Perpustakaan Kampus</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm">
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-[var(--bg-base)] shadow-[var(--shadow-lg)] p-7">
          {children}
        </div>
      </div>

      <p className="mt-6 text-xs text-[var(--text-tertiary)]">
        © {new Date().getFullYear()} Perpustakaan Kampus
      </p>
    </div>
  )
}
