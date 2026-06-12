// notify-lead — emails a pilot when a new quote request lands (PRD §9, lead
// notifications). Invoked fire-and-forget from QuoteRepository.add after the
// row is inserted. Degrades gracefully: if RESEND_API_KEY is unset, it returns
// 200 with skipped=true so the quote flow is never affected.
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface Quote {
  id: string
  pilotId: string
  clientName: string
  clientEmail: string
  jobType: string
  location: string
  budgetRange: string
  details: string
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
    const { quote } = (await req.json()) as { quote?: Quote }
    if (!quote?.pilotId) return json({ error: 'Missing quote.pilotId' }, 400)

    const resendKey = Deno.env.get('RESEND_API_KEY')

    // Look up the pilot's account email via the service role (RLS-bypassing).
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: pilot } = await supabase
      .from('pilots')
      .select('business_name, name, user_id')
      .eq('id', quote.pilotId)
      .maybeSingle()

    let pilotEmail: string | null = null
    if (pilot?.user_id) {
      const { data: user } = await supabase
        .from('users')
        .select('email')
        .eq('id', pilot.user_id)
        .maybeSingle()
      pilotEmail = user?.email ?? null
    }

    // No key configured → no-op so the quote flow stays unaffected.
    if (!resendKey) {
      return json({ skipped: true, reason: 'RESEND_API_KEY not configured', pilotEmail })
    }
    if (!pilotEmail) {
      return json({ skipped: true, reason: 'No pilot email on file' })
    }

    const subject = `New quote request from ${quote.clientName}`
    const html = `
      <h2>You have a new lead on SkyHire</h2>
      <p><strong>${quote.clientName}</strong> requested a quote for <strong>${quote.jobType}</strong>.</p>
      <ul>
        <li><strong>Location:</strong> ${quote.location}</li>
        <li><strong>Budget:</strong> ${quote.budgetRange}</li>
        <li><strong>Reply to:</strong> ${quote.clientEmail}</li>
      </ul>
      <p>${quote.details}</p>
      <p>Sign in to your dashboard to respond.</p>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SkyHire <onboarding@resend.dev>',
        to: [pilotEmail],
        reply_to: quote.clientEmail,
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      return json({ error: 'Resend request failed', detail }, 502)
    }

    return json({ sent: true, to: pilotEmail })
  } catch (err) {
    return json({ error: String(err) }, 500)
  }
})
