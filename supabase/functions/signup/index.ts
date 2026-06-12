// signup — creates an auto-confirmed client account (no email-confirmation
// step). Runs with the service role so the user is usable immediately; the
// on-auth-signup DB trigger creates the matching public.users row. The browser
// then signs in with the same password. Clients only — pilot/admin accounts are
// provisioned out-of-band.
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { email, password, name } = await req.json()
    if (!email || !password) return json({ error: 'Email and password are required.' }, 400)
    if (String(password).length < 8) {
      return json({ error: 'Password must be at least 8 characters.' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { error } = await supabase.auth.admin.createUser({
      email: String(email).trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { name: name ? String(name).trim() : undefined, role: 'client' },
    })

    if (error) {
      const dup = /already.*registered|already been registered|exists/i.test(error.message)
      return json({ error: dup ? 'An account with that email already exists.' : error.message }, dup ? 409 : 400)
    }

    return json({ ok: true })
  } catch (err) {
    return json({ error: String(err) }, 500)
  }
})
