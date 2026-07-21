# Implementation Plan: Bilingual Portfolio CMS

**Branch**: `001-portfolio-cms` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-portfolio-cms/spec.md`

## Summary

Transform the existing single-page React/Vite portfolio into a bilingual (English/Arabic) architectural-engineer portfolio with a protected admin dashboard at `/admin`. The owner manages public content, projects, images, color tokens, and incoming contact messages through Supabase without code changes. The site deploys to Vercel.

## Technical Context

**Language/Version**: JavaScript (ES2022+), JSX, Node.js 18+

**Primary Dependencies**: React 19, Vite 8, Supabase JS v2, React Router (routing), i18next / react-i18next (localization)

**Storage**: Supabase Postgres (database), Supabase Storage (images), Supabase Auth (authentication)

**Testing**: Vitest (unit), Playwright (e2e), manual checklist (visual/RTL)

**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge), responsive 320px–1440px+, deployed on Vercel

**Project Type**: Web application (SPA with client-side routing)

**Performance Goals**: Home page LCP < 3s on broadband; language switch < 1s; contact form submission feedback < 5s

**Constraints**: Single admin account; all public text must be bilingual; all colors from semantic tokens; no literal hex/RGB in component styles; Supabase RLS enforced

**Scale/Scope**: Single-portfolio site; dozens of projects, not thousands; single admin user; low-traffic public site

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Editorial Clarity First | ✅ PASS | Content hierarchy prioritized; bilingual text ensures clarity in both languages |
| II. Images Carry the Portfolio | ✅ PASS | All images require bilingual alt text; cover and gallery images stored with metadata |
| III. Quiet, Responsive Interaction | ✅ PASS | Responsive from 320px; keyboard accessible; respects `prefers-reduced-motion` |
| IV. Performance Is Part of Design | ✅ PASS | Images compressed and lazy-loaded; no unnecessary libraries; Core Web Vitals monitored |
| V. Honest Project Stories | ✅ PASS | No invented content; admin manages all project facts; drafts never published |

**Quality Gates**:
- Production build (`npm run build`) before handoff ✅
- Keyboard navigation and text contrast verified ✅
- Mobile and desktop layouts verified ✅
- Real content only after owner approval ✅
- Supabase RLS enabled before public deployment ✅

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-cms/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (not created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── main.jsx                     # Entry point, router setup
├── App.jsx                      # Route definitions
├── lib/
│   ├── supabase.js              # Supabase client (existing, extend)
│   └── i18n.js                  # i18next configuration
├── contexts/
│   ├── AuthContext.jsx           # Admin session provider
│   └── LanguageContext.jsx       # Language/direction provider
├── hooks/
│   ├── useProjects.js            # Fetch published projects
│   ├── useSiteSettings.js        # Fetch home/footer settings
│   ├── useContactSettings.js     # Fetch contact page settings
│   └── useColorTokens.js         # Fetch and apply color tokens
├── components/
│   ├── Layout.jsx                # Public layout wrapper (nav + footer)
│   ├── Navigation.jsx            # Bilingual nav with language switcher
│   ├── Footer.jsx                # Bilingual footer
│   ├── LanguageSwitcher.jsx      # EN/AR toggle
│   ├── ProjectCard.jsx           # Reusable project card
│   ├── ContactForm.jsx           # Contact form with validation
│   └── LoadingState.jsx          # Loading/error/empty states
├── pages/
│   ├── Home.jsx                  # Home page (About, Featured, Footer)
│   ├── Portfolio.jsx             # Portfolio grid with filtering
│   ├── ProjectDetail.jsx         # Single project view with gallery
│   ├── Contact.jsx               # Contact page
│   ├── admin/
│   │   ├── Login.jsx             # Admin login page
│   │   ├── Dashboard.jsx         # Dashboard overview
│   │   ├── HomeContent.jsx       # Home content editor
│   │   ├── Projects.jsx          # Project list/management
│   │   ├── ProjectEditor.jsx     # Create/edit project
│   │   ├── Messages.jsx          # Message inbox
│   │   ├── ContactFooter.jsx     # Contact/footer editor
│   │   └── Appearance.jsx        # Color token editor
│   └── NotFound.jsx              # 404 page
├── styles/
│   ├── tokens.css                # CSS custom properties (color bank)
│   └── global.css                # Base styles, resets
└── locales/
    ├── en.json                   # English translations
    └── ar.json                   # Arabic translations

supabase/
├── schema.sql                    # Original schema (extend)
├── migrations/
│   └── 001_cms_schema.sql        # New tables, RLS, storage
└── seed.sql                      # Default data for settings tables

public/
└── (static assets)
```

**Structure Decision**: Single-project Vite+React SPA with client-side routing via React Router. Admin pages nested under `/admin` with protected routes. Supabase handles auth, database, and storage; no custom backend. Color tokens defined as CSS custom properties in `tokens.css` and loaded from `site_settings` at runtime.

## Complexity Tracking

> No constitution violations to justify.
