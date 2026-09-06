# Architectural Portfolio

A bilingual (English/Arabic) portfolio SPA for architectural projects, with a content-management admin dashboard, backed by Supabase.

## Tech Stack

- **React 19** + **Vite 8** (Oxc plugin)
- **React Router v8** for client-side routing
- **Supabase** (Auth, Postgres, Storage) for backend
- **i18next** for English/Arabic language support
- **Lenis** for smooth scrolling
- **Oxlint** for linting
- Vanilla CSS with design tokens via CSS custom properties

## Features

- Public pages: Home, Portfolio grid, Project detail with lightbox, Contact form
- Admin dashboard at `/admin` with login, project CRUD, site settings, and message inbox
- Bilingual content (`_en`/`_ar` columns) with live language switching and RTL support
- Dynamic theming via `color_tokens` stored in Supabase
- Image pipeline: crop, compress, and upload to Supabase Storage
- Responsive design with mobile navigation
- Graceful degradation when Supabase is not configured (local fallback data)

## Setup

1. Create a Supabase project and run the migration files in [`supabase/migrations/`](supabase/migrations/) in order (001 through 005) via the SQL Editor.
2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   - `VITE_SUPABASE_URL` — Project URL from Supabase API settings
   - `VITE_SUPABASE_ANON_KEY` — Anon/public key from Supabase API settings
3. Install dependencies and start the dev server:

```sh
npm install
npm run dev
```

Never expose a service-role key in a Vite environment variable. The included migrations enable RLS, allowing public read access to published projects and settings, and anonymous contact form submissions only.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run Oxlint |
