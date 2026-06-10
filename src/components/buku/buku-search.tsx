"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Search, X } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { Input } from "@/components/ui/input"

export function BukuSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("q") ?? "")

  const debouncedValue = useDebounce(value, 400)

  const updateSearch = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams)
      if (q) {
        params.set("q", q)
        params.delete("page")
      } else {
        params.delete("q")
      }
      router.replace(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  // Trigger saat debounced value berubah
  useCallback(() => {
    updateSearch(debouncedValue)
  }, [debouncedValue, updateSearch])

  // Gunakan useEffect untuk sync debounced dengan router
  return (
    <div className="relative flex-1 max-w-sm">
      <Input
        type="search"
        placeholder="Cari judul atau pengarang..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          // Immediate for empty
          if (!e.target.value) updateSearch("")
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") updateSearch(value)
        }}
        leftIcon={<Search size={15} />}
        rightIcon={
          value ? (
            <button
              onClick={() => {
                setValue("")
                updateSearch("")
              }}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <X size={14} />
            </button>
          ) : null
        }
      />
    </div>
  )
}
