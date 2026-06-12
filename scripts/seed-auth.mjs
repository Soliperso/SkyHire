// One-off: provision the demo accounts as real Supabase Auth users so the
// quick-login chips keep working after the switch to real auth. Idempotent —
// re-running just reports "already exists". The on-auth-signup trigger links
// each new auth user to its existing public.users row (by email), preserving
// role/status. Reads secrets from argv so nothing sensitive is committed.
//
// Usage:
//   node scripts/seed-auth.mjs <SERVICE_ROLE_KEY> <DEMO_PASSWORD> <ADMIN_PASSWORD>
//   (SUPABASE_URL defaults to the skyhire project)
import { createClient } from '@supabase/supabase-js'

const [serviceKey, demoPassword, adminPassword] = process.argv.slice(2)
const url = process.env.SUPABASE_URL || 'https://adtksdftviijugltqtvl.supabase.co'

if (!serviceKey || !demoPassword || !adminPassword) {
  console.error('Usage: node scripts/seed-auth.mjs <SERVICE_ROLE_KEY> <DEMO_PASSWORD> <ADMIN_PASSWORD>')
  process.exit(1)
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } }).auth.admin

// Demo accounts that should be sign-in-able (mirrors src/auth/accounts.ts).
const PILOTS = [
  'marcus.reed', 'elena.voss', 'diego.marin', 'priya.nair',
  'tom.alvarez', 'sarah.kim', 'james.okoro', 'hannah.blake',
].map((slug) => ({ email: `${slug}@skyhire.demo`, role: 'pilot', password: demoPassword }))

const ACCOUNTS = [
  ...PILOTS,
  { email: 'client@skyhire.demo', role: 'client', password: demoPassword },
  { email: 'admin@skyhire.demo', role: 'admin', password: adminPassword },
]

for (const acc of ACCOUNTS) {
  const { error } = await admin.createUser({
    email: acc.email,
    password: acc.password,
    email_confirm: true,
    user_metadata: { role: acc.role },
  })
  if (error) {
    const dup = /already.*registered|already been registered|exists/i.test(error.message)
    console.log(`${dup ? 'exists ' : 'ERROR  '} ${acc.email}${dup ? '' : ' — ' + error.message}`)
  } else {
    console.log(`created ${acc.email} (${acc.role})`)
  }
}
console.log('Done.')
