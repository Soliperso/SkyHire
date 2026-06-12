import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase client singleton, configured from Vite env. The URL + anon key are
 * public by design (Row Level Security guards the data), so they ship in the
 * client bundle. When the env vars are absent the app falls back to the mock
 * repositories — see RepositoryProvider.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True when a Supabase backend is configured; gates the repository swap. */
export const hasSupabaseEnv = Boolean(url && anonKey)

let client: SupabaseClient | null = null

/** Returns the shared Supabase client, creating it on first use. */
export function getSupabaseClient(): SupabaseClient {
  if (!hasSupabaseEnv) {
    throw new Error('Supabase env is not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)')
  }
  if (!client) {
    // Mock auth still owns sessions this phase, so we don't persist a Supabase
    // session — every request uses the anon key.
    client = createClient(url as string, anonKey as string, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return client
}
