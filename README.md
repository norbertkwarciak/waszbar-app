# waszbar-app

A React application for estimating bartender services for [waszbar.pl](https://waszbar.pl) — mobile cocktail bar for weddings and events in Poland. Customers configure a package, pick a bar style, add extras, choose a date, and submit an inquiry. The app calculates travel cost based on the venue address and shows real-time availability.

The frontend is a Vite + React 19 SPA. The backend is a set of Cloudflare Pages Functions that integrate with Google Sheets (availability, offer pricing, inquiry log), Brevo (transactional email), OpenRouteService + Nominatim (geocoding & distance), Supabase (request logging), and Cloudflare Turnstile (bot protection).

## Tech stack

- **Frontend**: React 19, TypeScript, Vite 6, React Router 7
- **UI**: Mantine (core, dates, carousel, notifications), Tabler Icons, Sass (CSS Modules)
- **State / data**: TanStack Query with localStorage persistence
- **i18n**: i18next / react-i18next (Polish)
- **Backend**: Cloudflare Pages Functions (Workers runtime)
- **External services**: Google Sheets API, Brevo, OpenRouteService, Nominatim (OpenStreetMap), Supabase, Cloudflare Turnstile
- **Tooling**: pnpm, ESLint, Prettier, Vitest, Wrangler
- **Node**: 22.13.0 (see [.nvmrc](.nvmrc))

## Getting started

### Prerequisites

- Node 22.13.0 (use `nvm use`)
- `pnpm` (`corepack enable` or `npm i -g pnpm`)
- A `.env` file with the variables listed below

### Install

```bash
pnpm install
```

### Develop

`pnpm dev` runs the Vite frontend and Wrangler Pages (Functions) dev server in parallel:

- Frontend: http://localhost:5173
- Pages Functions: http://localhost:8788

```bash
pnpm dev            # frontend + functions
pnpm dev:frontend   # Vite only
pnpm dev:pages      # Wrangler Pages only
```

### Build

```bash
pnpm build          # vite build → ./dist
```

`wrangler.toml` points `pages_build_output_dir = "./dist"`, so the same artifact is deployed to Cloudflare Pages.

### Lint, test, typecheck

```bash
pnpm lint
pnpm test                    # Vitest, jsdom env
pnpm typecheck:functions     # tsc for functions/
```

### Other

```bash
pnpm compress:pdfs           # Ghostscript-based compression of public/pdfs/*
```

## Environment variables

Create a `.env` file at the repo root. For Cloudflare Pages deployments, set the same variables under **Settings → Environment Variables**.

| Variable                   | Used by                 | Purpose                                                                           |
| -------------------------- | ----------------------- | --------------------------------------------------------------------------------- |
| `GOOGLE_CLIENT_EMAIL`      | Functions               | Google service account email                                                      |
| `GOOGLE_PRIVATE_KEY`       | Functions               | Google service account private key (PEM, with `\n` escapes)                       |
| `GOOGLE_SHEET_ID`          | `get-availability`      | Spreadsheet listing taken dates                                                   |
| `GOOGLE_OFFER_SHEET_ID`    | `get-offer`             | Spreadsheet with menu packages + extra services                                   |
| `GOOGLE_INQUIRY_SHEET_ID`  | `submit-inquiry`        | Spreadsheet that receives inquiry rows                                            |
| `BREVO_API_KEY`            | `submit-inquiry`        | Brevo (SMTP API) key for sending confirmation + admin emails                      |
| `TURNSTILE_SECRET_KEY`     | `submit-inquiry`        | Cloudflare Turnstile server-side verification                                     |
| `VITE_TURNSTILE_SITE_KEY`  | Frontend                | Cloudflare Turnstile public site key                                              |
| `OPENROUTESERVICE_API_KEY` | `calculate-travel-cost` | OpenRouteService distance matrix API                                              |
| `SUPABASE_URL`             | `calculate-travel-cost` | Supabase project URL (optional, for logging)                                      |
| `SUPABASE_KEY`             | `calculate-travel-cost` | Supabase anon key (optional, for logging)                                         |
| `VITE_API_BASE_URL`        | Frontend                | Base URL for Pages Functions (e.g. `http://localhost:8788` in dev, empty in prod) |

See [functions/SUPABASE_SETUP.md](functions/SUPABASE_SETUP.md) for the optional Supabase logging setup and [functions/supabase-schema.sql](functions/supabase-schema.sql) for the `travel_cost_logs` schema.

## Deployment

The app deploys to Cloudflare Pages. `vite build` produces `dist/`, which Pages serves alongside the `functions/` directory as serverless routes. Make sure all environment variables from the table above are set in the Pages project (Production + Preview).
