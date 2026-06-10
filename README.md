# SkyHire — Drone Pilot Marketplace

The trusted marketplace for discovering, evaluating, and hiring professional, FAA-verified drone
pilots. This repository is the MVP web client, scaffolded from the [Product Requirements
Document](docs/PRD.md).

## Tech stack

- **Vite + React 19 + TypeScript**
- **React Router 7** for navigation
- **Tailwind CSS** with centralized design tokens
- **Mock data behind a repository seam** (swap to a real backend with no UI changes)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## What's built (Tier 1 — Core MVP)

The full client discovery → hire journey, wired end to end:

| Route                 | Screen            | Purpose                                                  |
| --------------------- | ----------------- | -------------------------------------------------------- |
| `/`                   | Home              | Hero search, value props, featured pilots, how-it-works |
| `/browse`             | Browse / Search   | Filter sidebar + sortable pilot grid                    |
| `/pilots/:id`         | Pilot profile     | Credentials, FAA badge, portfolio, reviews, quote CTA   |
| `/pilots/:id/quote`   | Quote request     | Lead-capture form with success state                    |
| `/reviews`            | Reviews & ratings | Review list + submission with structured tags           |
| `/admin`              | Admin console     | Verification queue, review moderation, lead monitoring  |

## Architecture

```
src/
  components/    Reusable UI kit (Button, Card, Badge, RatingStars, fields, Logo…)
  features/      Domain widgets composed from primitives (PilotCard, FilterPanel, ReviewForm…)
  pages/         Route screens
  app/layout/    App shell (Header, Footer, RootLayout)
  data/
    types.ts          Domain types (mapped to PRD §11)
    labels.ts         Human-readable enum labels (single source of truth)
    seed/             Mock data
    repositories/     Interfaces + mock/ implementations
    RepositoryProvider.tsx   ← the single swap-point
  routes.ts      Typed route builders (no hardcoded URL strings)
```

### Design system (DRY)

Every color, font scale, radius, and shadow is a **token** defined once in
[`tailwind.config.ts`](tailwind.config.ts). Components never hardcode hex values or arbitrary
pixel sizes. The palette is a trust-oriented "Trust Blue / slate" scheme with emerald verified
badges and amber ratings; typography follows a strict `display → h1 → h2 → h3 → body → caption`
hierarchy.

### The repository seam (mock → Supabase)

The UI depends only on the repository **interfaces** in `src/data/repositories/`. Today these are
backed by in-memory mock implementations (`repositories/mock/`). To go live with Supabase:

1. Implement classes that satisfy `PilotRepository`, `ReviewRepository`, `QuoteRepository`, and
   `VerificationRepository` using Supabase queries.
2. Construct them in [`RepositoryProvider.tsx`](src/data/RepositoryProvider.tsx) instead of the
   mock factories.

No component changes are required — that's the entire migration surface.

## Roadmap (deferred)

- **Tier 2:** auth + client/pilot dashboards (profile editor, verification center, leads inbox).
- **Tier 3:** full IA (content/legal pages, complete admin suite).
- **Backend:** Supabase persistence, payments, messaging, map-based discovery.
