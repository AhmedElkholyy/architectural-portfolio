# Quickstart Validation Guide: Portfolio Content System

**Feature**: `001-portfolio-cms-i18n`
**Date**: 2026-07-19

## Prerequisites

- Node.js 18+ installed
- Supabase project with URL and anon key configured in `.env.local`
- Admin account configured (VITE_ADMIN_EMAIL in `.env.local`)

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

## Validation Scenarios

### Scenario 1: Color Bank (Spec SC-001)

**Precondition**: Dev server running, site loads in browser.

1. Open browser DevTools → Elements tab
2. Inspect `<html>` element — verify CSS custom properties are set (`--accent`, `--background`, etc.)
3. Navigate to `src/index.css` — change `--accent` value to a different color (e.g., `#0000ff`)
4. Refresh browser — verify all accent-colored elements (brand dot, buttons, footer) update to blue
5. Revert the change — verify colors return to normal
6. Run: `grep -r '#[0-9a-fA-F]\{3,6\}' src/ --include='*.css' --include='*.jsx' | grep -v 'index.css' | grep -v 'node_modules'`
7. **Expected**: No hardcoded hex values found outside `index.css`

### Scenario 2: Language Toggle (Spec SC-002, SC-003)

**Precondition**: Site loads in English by default.

1. Click the language switcher in the navbar (shows "English" / "العربية")
2. Select Arabic — verify:
   - All nav labels switch to Arabic
   - Page direction flips to RTL
   - Layout mirrors (navbar items reorder)
3. Navigate to Home → Projects → Contact — verify Arabic persists
4. Refresh the page — verify Arabic is still active (localStorage persistence)
5. Switch back to English — verify all text returns to English and direction is LTR
6. Check each page for untranslated strings — there should be none

### Scenario 3: Mobile Navigation (Constitution III)

**Precondition**: Site loaded in browser.

1. Resize browser to 375px width (or use DevTools device mode)
2. Verify hamburger menu icon appears in navbar
3. Click hamburger — verify menu opens with all nav links + language switcher
4. Click a nav link — verify menu closes and page navigates
5. Open menu again, press Escape — verify menu closes
6. Open menu, click outside — verify menu closes
7. Verify all menu items are keyboard-focusable (Tab key)

### Scenario 4: Home Page Content (Spec SC-004)

**Precondition**: Admin logged in to Dashboard.

1. Navigate to `/admin/home`
2. Upload a new profile photo — save
3. Navigate to public Home page — verify new photo displays
4. Edit About text (English) — save
5. Verify updated text appears on Home page
6. Switch to Arabic — verify Arabic text displays (or English fallback if AR empty)

### Scenario 5: Featured Projects (Spec SC-010)

**Precondition**: Admin logged in, at least 3 projects exist.

1. Navigate to `/admin/home`
2. Mark 3 projects as featured (toggle/checkbox)
3. Try to mark a 4th — verify the UI prevents it (toggle disabled or warning shown)
4. Navigate to public Home page — verify exactly 3 featured projects display
5. Unfeature one project — verify Home page updates to show only 2

### Scenario 6: Contact Form (Spec SC-005, SC-009)

**Precondition**: Site loaded, Supabase configured.

1. Navigate to `/contact`
2. Leave all fields empty, click Submit — verify validation errors appear
3. Enter name, invalid email, message — click Submit — verify email validation error
4. Enter valid name, email, message — click Submit — verify success message
5. Navigate to `/admin/messages` — verify the submitted message appears with name, email, message, timestamp

### Scenario 7: Project Detail & Gallery (Spec SC-006)

**Precondition**: Admin logged in, project with gallery images exists.

1. Navigate to `/admin/projects` — open a project with images
2. Verify all gallery images display in the editor
3. Navigate to public project detail page (`/project/:id`)
4. Verify title, description (in current language), and gallery images display
5. Click a gallery thumbnail — verify lightbox/modal opens with full image
6. Navigate between images (if multiple) — verify prev/next works
7. Close lightbox — verify it closes cleanly

### Scenario 8: Dashboard Content Management (Spec SC-004)

**Precondition**: Admin logged in.

1. Navigate to `/admin/contact-footer`
2. Update contact email, phone, location — save
3. Update footer text — save
4. Navigate to public Contact page — verify updated info displays
5. Check footer on any page — verify updated text displays
6. Switch language — verify bilingual content updates

### Scenario 9: Image Upload Persistence (Spec SC-006)

**Precondition**: Admin logged in.

1. Navigate to `/admin/home` — upload a profile photo
2. Navigate to `/admin/projects/new` — upload cover + gallery images
3. Refresh the browser — verify all uploaded images still display
4. Navigate to public pages — verify images load correctly
5. Check Supabase Storage dashboard — verify files exist in `profile` and `projects` buckets

### Scenario 10: Production Build (Constitution Quality Gate)

```bash
npm run build
```

**Expected**: Build completes without errors. Verify:
- No warnings about unused variables or missing imports
- Output in `dist/` directory
- Can serve with `npx serve dist` and all features work
