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
  list(): Promise<QuoteRequest[]>
  /** Leads addressed to a specific pilot (newest first) — the pilot's Leads inbox. */
  listForPilot(pilotId: string): Promise<QuoteRequest[]>
  /** A client's own quote requests (newest first) — their job history. */
  listForClient(clientEmail: string): Promise<QuoteRequest[]>
  add(request: NewQuoteRequest): Promise<QuoteRequest>
  /** Update a lead's status (e.g. pilot responds to or closes a lead). */
  setStatus(id: string, status: QuoteRequest['status']): Promise<void>
}
