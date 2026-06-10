"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import type { Profil } from "@/types"

interface AuthContextValue {
  user: User | null
  session: Session | null
  profil: Profil | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  profil: null,
  loading: true,
})

interface AuthProviderProps {
  children: React.ReactNode
  initialProfile?: Profil | null
}

export function AuthProvider({ children, initialProfile }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  // Mulai dengan data server-side jika tersedia — tidak perlu fetch lagi
  const [profil, setProfil] = useState<Profil | null>(initialProfile ?? null)
  const [loading, setLoading] = useState(initialProfile == null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      // Hanya fetch profil kalau belum ada dari server
      if (!initialProfile) {
        if (session?.user) fetchProfil(supabase, session.user)
        else setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfil(supabase, session.user)
      else {
        setProfil(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, profil, loading }}>
      {children}
    </AuthContext.Provider>
  )

  async function fetchProfil(supabase: ReturnType<typeof createClient>, user: User) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (data) {
      setProfil(data)
      setLoading(false)
      return
    }

    if (error?.code === "PGRST116") {
      const meta = user.user_metadata ?? {}
      const { data: created } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          nama_lengkap: (meta.nama_lengkap as string) || user.email || "Pengguna",
          nim: (meta.nim as string) || null,
          peran: (meta.peran as string) || "mahasiswa",
          aktif: true,
        })
        .select("*")
        .single()
      setProfil(created)
    }

    setLoading(false)
  }
}

export function useAuth() {
  return useContext(AuthContext)
}
