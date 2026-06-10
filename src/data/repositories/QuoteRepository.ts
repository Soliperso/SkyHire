import type { QuoteRequest } from '../types'

export interface NewQuoteRequest {
  pilotId: string
  clientName: string
  clientEmail: string
  jobType: QuoteRequest['jobType']
  location: string
  budgetRange: string
  details: string
}

export interface QuoteRepository {
  list(): QuoteRequest[]
  /** Leads addressed to a specific pilot (newest first) — the pilot's Leads inbox. */
  listForPilot(pilotId: string): QuoteRequest[]
  add(request: NewQuoteRequest): QuoteRequest
  /** Update a lead's status (e.g. pilot responds to or closes a lead). */
  setStatus(id: string, status: QuoteRequest['status']): void
}
