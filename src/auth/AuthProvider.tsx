import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Role } from '@/data/types'
import { getSupabaseClient, hasSupabaseEnv } from '@/data/supabase/client'
import type { AuthUser } from './accounts'

export type AuthResult = { ok: true; role: Role } | { ok: false; error: string }

interface AuthContextValue {
  user: AuthUser | null
  /** True until the initial session has been resolved — guards route redirects. */
  loading: boolean
  /** Real Supabase Auth sign-in (email + password). */
  signIn: (email: string, password: string) => Promise<AuthResult>
  /** Client self-signup via the `signup` edge function, then auto sign-in. */
  signUp: (email: string, password: string, name: string) => Promise<AuthResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Loads the app-level profile (role + pilot link) for a Supabase session. Role
 * and account identity live in public.users; pilots additionally resolve their
 * PilotProfile id + avatar. RLS lets a user read their own users row.
 */
async function loadProfile(session: Session): Promise<AuthUser | null> {
  const db = getSupabaseClient()
  const { data: row } = await db
    .from('users')
    .select('id, name, email, role')
    .eq('auth_id', session.user.id)
    .maybeSingle()
  if (!row) return null

  const base: AuthUser = { id: row.id, name: row.name, email: row.email, role: row.role }
  if (row.role === 'pilot') {
    const { data: pilot } = await db
      .from('pilots')
      .select('id, avatar_url')
      .eq('user_id', row.id)
      .maybeSingle()
    if (pilot) {
      base.pilotId = pilot.id
      base.avatarUrl = pilot.avatar_url
    }
  }
  return base
}

/**
 * Real Supabase Auth session store. Exposes the same `user` shape the app
 * already consumed under the mock layer (id/name/email/role/pilotId), so guards,
 * the header, and the dashboard are unchanged — only sign-in/up/out are now real.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  // Only "loading" if there's a backend session to restore; with no env there's
  // nothing to wait for (avoids a synchronous setState in the effect).
  const [loading, setLoading] = useState(hasSupabaseEnv)

  useEffect(() => {
    if (!hasSupabaseEnv) return
    const db = getSupabaseClient()
    let active = true

    db.auth.getSession().then(async ({ data }) => {
      const profile = data.session ? await loadProfile(data.session) : null
      if (active) {
        setUser(profile)
        setLoading(false)
      }
    })

    const { data: sub } = db.auth.onAuthStateChange(async (_event, session) => {
      const profile = session ? await loadProfile(session) : null
      if (active) setUser(profile)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!hasSupabaseEnv) return { ok: false, error: 'Auth backend is not configured.' }
    const db = getSupabaseClient()
    const { data, error } = await db.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    if (error || !data.session) return { ok: false, error: 'Incorrect email or password.' }
    // Resolve the role now so the caller can route to the right home; the
    // onAuthStateChange listener also refreshes `user` from this same session.
    const profile = await loadProfile(data.session)
    setUser(profile)
    return { ok: true, role: profile?.role ?? 'client' }
  }, [])

  const signUp = useCallback(
    async (email: string, password: string, name: string): Promise<AuthResult> => {
      if (!hasSupabaseEnv) return { ok: false, error: 'Auth backend is not configured.' }
      const db = getSupabaseClient()
      const { data, error } = await db.functions.invoke('signup', {
        body: { email: email.trim().toLowerCase(), password, name: name.trim() },
      })
      // Edge function returns { error } in the body on 4xx; invoke also surfaces
      // transport errors. Prefer the body message when present.
      const bodyError = (data as { error?: string } | null)?.error
      if (error || bodyError) {
        return { ok: false, error: bodyError ?? 'Could not create your account. Please try again.' }
      }
      // Account is auto-confirmed — sign straight in.
      return signIn(email, password)
    },
    [signIn],
  )

  const signOut = useCallback(async () => {
    if (!hasSupabaseEnv) return
    await getSupabaseClient().auth.signOut()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
