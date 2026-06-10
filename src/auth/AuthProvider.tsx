import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { findAccountByEmail, type AuthUser } from './accounts'

const STORAGE_KEY = 'skyhire.auth'

interface AuthContextValue {
  user: AuthUser | null
  /** Mock sign-in: any password, email must match a demo account. Returns the user or null. */
  signIn: (email: string) => AuthUser | null
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStored(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

/**
 * In-memory + localStorage session store. This is the mock stand-in for real
 * auth; a Supabase-backed provider would expose the same `user/signIn/signOut`
 * contract so consumers (Header, route guards, dashboard) never change.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStored)

  const signIn = useCallback((email: string) => {
    const account = findAccountByEmail(email)
    if (!account) return null
    setUser(account)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account))
    } catch {
      // Non-fatal — session simply won't persist across reloads.
    }
    return account
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({ user, signIn, signOut }), [user, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
