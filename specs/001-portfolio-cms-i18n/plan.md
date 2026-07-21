# Implementation Plan: Portfolio Content System

**Branch**: `001-portfolio-cms-i18n` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-portfolio-cms-i18n/spec.md`

## Summary

Enhance the existing React + Vite + Supabase portfolio with a centralized color system (removing all hardcoded hex values), verify i18n coverage, add mobile navigation, and ensure all CMS-driven content is properly wired. The project already has ~85% of the spec implemented — i18n, RTL, bilingual content fields, dashboard CRUD, Supabase schema, contact form, and project galleries all exist. Primary work is: (1) replacing ~30 hardcoded hex values in `App.css` with CSS custom properties, (2) adding a hamburger menu for mobile, (3) auditing translation completeness, and (4) minor UI refinements.

## Technical Context

**Language/Version**: JavaScript (JSX), React 18+, Vite 5+

**Primary Dependencies**: React, React Router, i18next, react-i18next, i18next-browser-languagedetector, @supabase/supabase-js, browser-image-compression

**Storage**: Supabase (PostgreSQL + Storage buckets: `profile`, `projects`)

**Testing**: Manual QA (no test framework configured in package.json)

**Target Platform**: Modern browsers, responsive web (320px+), deployed on Vercel

**Project Type**: Web application (SPA with client-side routing)

**Performance Goals**: Core Web Vitals within acceptable thresholds; images compressed client-side before upload (max 5MB, max 1920px)

**Constraints**: No new backend code — all extensions via Supabase schema migrations + client-side changes. Reuse existing auth, storage buckets, and RLS policies.

**Scale/Scope**: Single-portfolio site, ~10 pages/screens, single admin user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Editorial Clarity First | ✅ PASS | Content hierarchy is clear; bilingual fields ensure readability in both languages |
| II. Images Carry the Portfolio | ✅ PASS | Gallery images have alt text fields (alt_en/alt_ar); compression enforced on upload |
| III. Quiet, Responsive Interaction | ⚠️ PARTIAL | Mobile nav is broken (links hidden at 760px, no hamburger). Must fix before handoff. Keyboard accessibility needs audit. |
| IV. Performance Is Part of Design | ✅ PASS | No unnecessary libraries; image compression built in; Vite optimized builds |
| V. Honest Project Stories | ✅ PASS | No invented content — all CMS-driven, admin controls what's published |

**Gate Result**: CONDITIONAL PASS — Mobile navigation fix required (Constitution III). No violations that need justification in Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-cms-i18n/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── main.jsx                    # Entry point (BrowserRouter, i18n import, CSS imports)
├── App.jsx                     # Route definitions
├── App.css                     # All component/page styles (hardcoded colors to replace)
├── index.css                   # CSS custom properties (design tokens), global resets
├── lib/
│   ├── supabase.js             # Supabase client init
│   └── i18n.js                 # i18next configuration
├── contexts/
│   ├── AuthContext.jsx         # Supabase auth
│   └── LanguageContext.jsx     # Language state + RTL/LTR
├── hooks/
│   ├── useColorTokens.js       # Applies color_tokens from DB to CSS vars
│   ├── useSiteSettings.js      # Fetches site_settings singleton
│   ├── useContactSettings.js   # Fetches contact_page_settings
│   └── useProjects.js          # Fetches projects with filters
├── locales/
│   ├── en.json                 # English translations
│   └── ar.json                 # Arabic translations
├── components/
│   ├── Navigation.jsx          # Public navbar (needs mobile hamburger)
│   ├── Footer.jsx              # Public footer (CMS-driven)
│   ├── Layout.jsx              # Wraps Nav + children + Footer
│   ├── LanguageSwitcher.jsx    # EN/AR toggle
│   ├── ProjectCard.jsx         # Project card
│   ├── ContactForm.jsx         # Contact form with validation
│   └── admin/
│       └── AdminLayout.jsx     # Admin sidebar + auth guard
├── pages/
│   ├── Home.jsx                # Hero + featured projects
│   ├── Portfolio.jsx           # All published projects
│   ├── ProjectDetail.jsx       # Single project + gallery
│   ├── Contact.jsx             # Contact info + form
│   └── admin/
│       ├── HomeContent.jsx     # Edit about text, profile image, featured
│       ├── Projects.jsx        # Project list CRUD
│       ├── ProjectEditor.jsx   # Create/edit project + gallery
│       ├── Messages.jsx        # Contact messages inbox
│       ├── ContactFooter.jsx   # Edit contact + footer settings
│       └── Appearance.jsx      # Edit color tokens
supabase/
├── schema.sql                  # Legacy schema (superseded)
└── migrations/
    └── 001_cms_schema.sql      # Current CMS schema
```

**Structure Decision**: Single-project SPA. All source under `src/`, Supabase schema under `supabase/`. No backend code — all server-side logic is in Supabase RLS policies and database triggers.

## Implementation Phases

### Phase 1: Color Bank Cleanup (Foundation)

**Goal**: Eliminate all hardcoded hex/rgb values from component files. Colors already defined as CSS custom properties in `index.css` and dynamically applied via `useColorTokens` hook from Supabase JSONB.

**Tasks**:
1. Audit `App.css` for hardcoded hex values (~30 instances found)
2. Map each hardcoded value to existing CSS custom property:
   - `#bc4e32` → `var(--accent)`
   - `#f5f0e5` → `var(--background)` (or new `--color-text-inverse` if needed)
   - `#1d211e` → `var(--text-primary)`
   - `#d8d4c9` → `var(--surface)`
   - Decorative colors (`#b9492f`, `#ca5b3d`, `#373c35`, etc.) → add new CSS variables if not covered by existing 7 tokens
3. Audit JSX inline styles for hardcoded `#fff`/`#000` in admin pages
4. Add missing tokens to `index.css` `:root` and to Supabase `color_tokens` JSONB default
5. Update `useColorTokens` hook to apply any new tokens
6. Update `Appearance.jsx` admin page to expose new tokens for editing
7. Verify: `grep -r '#[0-9a-fA-F]\{3,6\}' src/ --include='*.css' --include='*.jsx'` returns only `colors.css`/`index.css` token definitions

**Constitution Gate**: Principle III (keyboard accessibility) — verify color contrast meets WCAG 2.1 AA after token changes.

### Phase 2: Mobile Navigation (Constitution III Fix)

**Goal**: Make the navbar fully functional on mobile (320px+).

**Tasks**:
1. Add hamburger menu button to `Navigation.jsx` (visible at ≤760px)
2. Implement slide-in or dropdown menu with all nav links + language switcher
3. Ensure menu is keyboard-accessible (focus trap, Escape to close, ARIA attributes)
4. Ensure menu closes on navigation (route change)
5. Test at 320px, 375px, 768px breakpoints

**Constitution Gate**: Principle III requires keyboard-accessible interactive elements and usability from 320px.

### Phase 3: i18n Audit & Completion

**Goal**: Ensure 100% of static UI strings are in translation files. Current state: 97 keys in en.json/ar.json.

**Tasks**:
1. Audit all components for hardcoded English strings (headings, labels, button text, placeholders)
2. Add missing keys to `en.json` and `ar.json`
3. Verify RTL layout renders correctly on all pages (no left-to-right artifacts)
4. Test language toggle on every page: Home, Portfolio, Project Detail, Contact, 404
5. Verify admin-edited content (about text, project descriptions, contact info, footer) displays per-locale with EN fallback

### Phase 4: Minor UI Refinements

**Goal**: Polish existing features to fully match spec.

**Tasks**:
1. **Home page**: Verify About Me section layout (photo + text side-by-side on desktop, stacked on mobile)
2. **Featured projects**: Verify max 3 enforcement in `HomeContent.jsx` admin
3. **Contact page**: Verify form validation (required fields, email format) — already has honeypot
4. **Project Detail**: Verify gallery displays cleanly with all images accessible
5. **Footer**: Verify CMS-driven content renders correctly in both languages
6. **Dashboard**: Verify all admin pages are reachable and functional

### Phase 5: QA Pass

**Goal**: Full validation against spec acceptance criteria.

**Checklist**:
- [ ] No hardcoded colors outside color bank (grep verification)
- [ ] EN/AR toggle works on every page; RTL renders cleanly
- [ ] Mobile navigation works at all breakpoints (320px+)
- [ ] Home shows exactly the featured projects selected in dashboard
- [ ] Footer reflects dashboard edits in both languages
- [ ] Contact form submissions appear in dashboard inbox
- [ ] Project detail pages show correct description + gallery per project
- [ ] All uploads persist and render correctly after refresh
- [ ] Keyboard navigation works on all interactive elements
- [ ] WCAG 2.1 AA contrast ratios met for all text
- [ ] Production build succeeds (`npm run build`)

## Complexity Tracking

No constitution violations requiring justification. The mobile navigation fix is a straightforward addition to meet existing Principle III requirements.
