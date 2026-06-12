import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { findAccountByEmail, type AuthUser } from './accounts'

const STORAGE_KEY = 'skyhire.auth'

interface AuthContextValue {
  user: AuthUser | null
  /**
   * Mock sign-in. Pilot/client demo accounts accept any password; the admin
   * account additionally requires the secret VITE_ADMIN_PASSCODE so the console
   * is restricted to the operator. Returns the user, or null if no account
   * matches or the admin passcode is wrong/unset.
   */
  signIn: (email: string, password?: string) => AuthUser | null
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

  const signIn = useCallback((email: string, password?: string) => {
    const account = findAccountByEmail(email)
    if (!account) return null
    // The admin console is operator-only: gate it behind a shared passcode.
    // (Real role-enforcing auth is the deferred follow-up; this is the lock
    // available while sign-in is still the mock/localStorage layer.)
    if (account.role === 'admin') {
      const passcode = import.meta.env.VITE_ADMIN_PASSCODE as string | undefined
      if (!passcode || password !== passcode) return null
    }
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
