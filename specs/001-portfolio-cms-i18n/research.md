# Research: Portfolio Content System

**Feature**: `001-portfolio-cms-i18n`
**Date**: 2026-07-19

## Research Questions

### 1. What hardcoded colors exist and which CSS variables should replace them?

**Decision**: Map all hardcoded hex values in `App.css` to existing or new CSS custom properties.

**Rationale**: The project already defines 9 CSS custom properties in `index.css` (`--background`, `--surface`, `--text-primary`, `--text-muted`, `--accent`, `--border`, `--danger`, `--success`, `--warning`). The `useColorTokens` hook dynamically overrides these from Supabase JSONB at runtime. However, `App.css` contains ~30 hardcoded hex values that bypass this system.

**Color Mapping**:

| Hardcoded Value | Usage | Replacement |
|-----------------|-------|-------------|
| `#bc4e32` | Brand dot, footer bg, hero elements | `var(--accent)` |
| `#f5f0e5` | Footer text, form button bg, input borders | `var(--background)` or new `--color-text-inverse` |
| `#1d211e` | Section header border | `var(--text-primary)` |
| `#d8d4c9` | Hero background | `var(--surface)` |
| `#b9492f` | Hero italic text | `var(--accent)` (darker variant) or new `--accent-dark` |
| `#ca5b3d` | Decorative sun | `var(--accent)` |
| `#373c35` | Decorative arc | `var(--text-primary)` |
| `#b84930` | Decorative arc-two | `var(--accent)` |
| `#e5e1d5` | Decorative column | `var(--surface)` |
| `#717465` | Decorative ground | `var(--text-muted)` |
| `#eeeae0` | Project card text | `var(--background)` |
| `#9ba19a`, `#b28f72`, `#798178` | Project card accents | New: `--card-accent-1/2/3` or reuse `--accent` with opacity |
| `#59635c`, `#5c4538`, `#445149` | Decorative gradients | Map to existing tokens with opacity |
| `#27312b` | About section dark bg | `var(--text-primary)` |
| `#c7c6bd` | About section text | `var(--text-muted)` |
| `#fff` / `#000` | Admin status badges | `var(--background)` / `var(--text-primary)` |

**Alternatives considered**:
- Adding a CSS preprocessor (Sass) — rejected per Constitution IV (avoid unnecessary libraries)
- Using Tailwind CSS — rejected per Constitution IV (project uses vanilla CSS, adding Tailwind is a major refactor)

---

### 2. How should mobile navigation be implemented?

**Decision**: Add a hamburger menu button with a slide-in drawer, implemented in vanilla CSS/JS.

**Rationale**: The current nav hides links at ≤760px with no alternative. Constitution III requires usability from 320px. A hamburger menu is the standard pattern for mobile navigation.

**Implementation approach**:
- Add state variable `isMenuOpen` to `Navigation.jsx`
- Render hamburger button (3-line icon) visible only at ≤760px
- On click, toggle a slide-in panel from the right (or drop down from top)
- Panel contains: nav links, language switcher, close button
- Close on: route change, Escape key, clicking outside
- ARIA: `aria-expanded`, `aria-label="Menu"`, focus trap inside menu

**Alternatives considered**:
- Bottom tab bar — rejected (not standard for portfolio sites)
- Accordion/collapsible nav — rejected (less intuitive for primary navigation)
- Always-visible horizontal scroll — rejected (doesn't work at 320px)

---

### 3. Are all static UI strings in translation files?

**Decision**: Need to audit — current state has 97 keys but may have gaps.

**Rationale**: Spec FR-005 requires 100% of static strings from translation files. The existing `en.json` and `ar.json` cover nav, home, portfolio, project, contact, footer, admin, and common namespaces. Audit needed to confirm completeness.

**Known potential gaps**:
- Hero section heading ("Spaces that hold a feeling") — need to verify if in translations
- Admin page titles and form labels
- Validation error messages
- Loading/error state messages

**Alternatives considered**: N/A — this is a verification task, not a design decision.

---

### 4. What image constraints should be enforced?

**Decision**: Reuse existing compression settings (max 5MB, max 1920px) with client-side validation.

**Rationale**: The `ProjectEditor.jsx` already implements `browser-image-compression` with these limits. The same approach should be applied to profile image uploads in `HomeContent.jsx`.

**Implementation**:
- Client-side: Validate file size (≤5MB) and type (JPEG, PNG, WebP) before upload
- Server-side: Supabase Storage bucket policies (already configured)
- Display clear error messages on validation failure (Constitution III — user feedback)

**Alternatives considered**:
- Server-side resize via Supabase Edge Functions — rejected (adds complexity, client-side is sufficient)
- Stricter limits (2MB, 1200px) — rejected (existing 5MB/1920px works well for architectural photography)

---

### 5. How should the gallery viewer work?

**Decision**: Grid of thumbnails with a custom lightbox modal (no new dependencies).

**Rationale**: Constitution IV says "avoid unnecessary libraries." A simple lightbox can be built with React state + CSS transitions. The `ProjectDetail.jsx` already has a gallery grid — adding a click-to-expand modal is minimal code.

**Implementation**:
- Grid of thumbnail images (existing layout)
- Click thumbnail → full-screen overlay with image
- Navigation: prev/next arrows or swipe (optional)
- Close: X button, Escape key, clicking backdrop
- Keyboard: Left/Right arrows for navigation, Escape to close

**Alternatives considered**:
- `yet-another-react-lightbox` — rejected per Constitution IV (unnecessary dependency)
- Simple CSS `:target` lightbox — rejected (no keyboard/accessibility support)
- Carousel/slider — rejected (grid is better for architectural photography overview)
