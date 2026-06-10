"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, BookMarked, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Buku", href: "/buku", icon: BookOpen },
  { label: "Pinjam", href: "/peminjaman", icon: BookMarked },
  { label: "Notifikasi", href: "/notifikasi", icon: Bell },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border-color)] bg-[var(--bg-base)]/90 backdrop-blur-md">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs",
                "transition-colors duration-150",
                isActive
                  ? "text-[var(--brand)]"
                  : "text-[var(--text-tertiary)]"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
