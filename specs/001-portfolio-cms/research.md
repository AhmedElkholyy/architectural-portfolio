# Research: Bilingual Portfolio CMS

**Feature**: 001-portfolio-cms
**Date**: 2026-07-18

## R1: Routing Library

**Decision**: React Router v7 (latest stable)

**Rationale**: React Router is the de facto standard for React SPAs. v7 provides nested routes, layout routes (ideal for admin protection), and data loader patterns. The existing Vite+React project has no router installed, so this is a clean addition.

**Alternatives considered**:
- TanStack Router: Strong type-safety but heavier learning curve; overkill for this project size.
- Next.js file-based routing: Would require migrating off Vite; Supabase integration already works without a framework.

## R2: Internationalization (i18n)

**Decision**: i18next + react-i18next with language detection and localStorage persistence

**Rationale**: i18next is mature, well-documented, and handles RTL direction changes cleanly with react-i18next. Language detection plugin auto-detects from localStorage or browser settings. Translation resources stored as JSON files (`en.json`, `ar.json`).

**Alternatives considered**:
- Custom context + JSON: Simpler but reinvents pluralization, interpolation, and fallback logic.
--intl: Larger bundle; ICU message format overkill for this project.

## R3: Client-Side Routing Strategy

**Decision**: Hash router or browser router? Browser router with Vercel rewrites

**Rationale**: Vercel supports SPA rewrites natively via `vercel.json`. Browser router gives clean URLs (`/portfolio` vs `/#/portfolio`). Add a rewrite rule: `{ "source": "/((?!assets/).*)", "destination": "/index.html" }`.

**Alternatives considered**:
- Hash router: Ugly URLs; no SEO benefit; simpler but unnecessary with Vercel.

## R4: Color Token Architecture

**Decision**: CSS custom properties defined in `tokens.css`, loaded from Supabase `site_settings` at runtime

**Rationale**: CSS custom properties are the web standard for theming. Default values in `tokens.css` ensure the site renders before Supabase loads. Runtime fetch updates `document.documentElement.style` with DB values. Token names are fixed; only values change.

**Alternatives considered**:
- Tailwind CSS theme: Adds a build dependency; CSS custom properties are simpler and framework-agnostic.
- Styled-components theme: Runtime CSS-in-JS overhead; conflicts with the "avoid unnecessary libraries" principle.

## R5: Image Handling

**Decision**: Supabase Storage with client-side compression before upload

**Rationale**: Supabase Storage handles file hosting, CDN, and access control. Client-side compression via `browser-image-compression` library before upload reduces bandwidth. Lazy loading via `loading="lazy"` attribute on `<img>` tags.

**Alternatives considered**-
- Cloudinary: External service dependency; Supabase Storage is already part of the stack.
- Sharp (server-side): Requires a server function; Vercel serverless adds complexity.

## R6: Form Validation

**Decision**: Native HTML5 validation + React state for real-time feedback

**Rationale**: The contact form has only three fields (name, email, message). Native validation (`required`, `type="email"`, `minLength`) handles basic cases. React state provides real-time error messages and success/error states. No form library needed.

**Alternatives considered**:
- React Hook Form: Adds a dependency for a trivially simple form.
- Formik: Larger bundle; unnecessary complexity.

## R7: Admin Route Protection

**Decision**: React Router layout route with `AuthContext` provider

**Rationale**: A wrapper component checks `supabase.auth.getSession()` on mount. If no session, redirect to `/admin/login`. The `AuthContext` provides `user`, `loading`, and `signOut` to all admin pages. Supabase RLS enforces server-side protection.

**Alternatives considered**:
- Higher-order component: More boilerplate; layout route is cleaner.
- Middleware: Not available in client-side React.

## R8: Database Schema Extension Strategy

**Decision**: New migration file extending the existing schema

**Rationale**: The existing `schema.sql` has `projects` and `inquiries` tables with basic RLS. The new migration adds bilingual fields, new tables (`site_settings`, `contact_page_settings`, `project_images`), storage buckets, and enhanced RLS policies. The original schema is preserved for reference.

**Alternatives considered**:
- Drop and recreate: Loses existing data; not safe for production.
- Separate database: Unnecessary complexity; single Supabase project is sufficient.

## R9: Vercel Deployment Configuration

**Decision**: `vercel.json` with SPA rewrite + environment variables

**Rationale**: Vercel auto-detects Vite projects. Add `vercel.json` for SPA routing rewrite. Environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` configured in Vercel dashboard (never committed).

**Alternatives considered**:
- Netlify: Also works; Vercel chosen per user preference.

## R10: Anti-Spam / Rate Limiting

**Decision**: Honeypot field + Supabase Edge Function rate limiting

**Rationale**: A hidden honeypot field catches bots. Supabase RLS + a simple check on insert frequency (e.g., one submission per IP per minute via Edge Function or database trigger) provides rate limiting without external services.

**Alternatives considered**:
- reCAPTCHA: Adds Google dependency; privacy concerns.
- Cloudflare Turnstile: External service; heavier than needed for a low-traffic portfolio.
