# Tasks: Portfolio Content System

**Input**: Design documents from `/specs/001-portfolio-cms-i18n/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test framework configured — manual QA only via quickstart.md validation scenarios.

**Organization**: Tasks are grouped by user story. Note: the project is ~85% implemented. Most tasks are verification, cleanup, and targeted fixes rather than building from scratch.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Verify project compiles and dev server runs

- [x] T001 Run `npm install` to ensure all dependencies are present
- [x] T002 Start dev server with `npm run dev` and verify site loads at localhost
- [x] T003 Verify Supabase connection by checking browser console for errors

---

## Phase 2: Foundational — Color Bank Cleanup (Blocks US2)

**Purpose**: Eliminate all hardcoded hex/rgb values from component files. Must complete before US2 verification.

**⚠️ CRITICAL**: US2 (color theme management) cannot be validated until this phase is complete.

- [x] T004 Audit `src/App.css` for all hardcoded hex values and list each occurrence with line number
- [x] T005 [P] Add missing CSS custom properties to `src/index.css` `:root` block (e.g., `--accent-dark`, `--card-accent-1/2/3`, `--text-inverse`) based on research.md color mapping
- [x] T006 [P] Update `src/hooks/useColorTokens.js` to apply any new CSS variables added in T005 from the Supabase `color_tokens` JSONB
- [x] T007 [P] Update `src/pages/admin/Appearance.jsx` to expose new color tokens in the admin color picker UI
- [x] T008 Replace all hardcoded hex values in `src/App.css` with CSS custom property references per research.md mapping (e.g., `#bc4e32` → `var(--accent)`, `#f5f0e5` → `var(--background)`)
- [x] T009 Replace hardcoded `#fff`/`#000` in admin JSX inline styles (src/pages/admin/Projects.jsx, src/pages/admin/Messages.jsx) with CSS variable references
- [x] T010 Run grep verification: `grep -r '#[0-9a-fA-F]\{3,6\}' src/ --include='*.css' --include='*.jsx'` — confirm no hardcoded values remain outside `src/index.css`
- [ ] T011 Verify color contrast meets WCAG 2.1 AA after token changes (check text on background combinations)

**Checkpoint**: All colors driven by CSS custom properties. Changing a variable in `index.css` or Supabase `color_tokens` updates the entire site.

---

## Phase 3: User Story 1 — Localized Portfolio (Priority: P1) 🎯 MVP

**Goal**: i18n works across all pages with RTL support and mobile navigation functional

**Independent Test**: Toggle EN/AR on every page; verify RTL layout; verify mobile hamburger menu works at 320px+

### Implementation for User Story 1

- [ ] T012 [US1] Audit `src/locales/en.json` and `src/locales/ar.json` — verify all 97 keys exist in both files with no missing translations
- [ ] T013 [US1] Scan all components in `src/components/` and `src/pages/` for hardcoded English strings not using `t()` function — list any found
- [ ] T014 [US1] Add any missing translation keys to `src/locales/en.json` and `src/locales/ar.json` for hardcoded strings found in T013
- [ ] T015 [US1] Verify `src/contexts/LanguageContext.jsx` correctly sets `dir="rtl"` and `lang` attribute on `<html>` element when Arabic is selected
- [ ] T016 [US1] Verify `src/components/LanguageSwitcher.jsx` persists language choice to localStorage and reads it on app init
- [ ] T017 [US1] Test RTL layout on Home page (`src/pages/Home.jsx`) — verify no left-to-right artifacts (margins, padding, text alignment)
- [ ] T018 [US1] Test RTL layout on Portfolio page (`src/pages/Portfolio.jsx`) — verify grid/list renders correctly
- [ ] T019 [US1] Test RTL layout on Project Detail page (`src/pages/ProjectDetail.jsx`) — verify gallery and text alignment
- [ ] T020 [US1] Test RTL layout on Contact page (`src/pages/Contact.jsx`) — verify form and info boxes
- [ ] T021 [US1] Test RTL layout on 404 page (`src/pages/NotFound.jsx`)
- [ ] T022 [US1] Add RTL-aware CSS adjustments in `src/App.css` using logical properties (`margin-inline-start`, `padding-inline-end`, `text-align: start`) where needed
- [ ] T023 [US1] Add hamburger menu button to `src/components/Navigation.jsx` — visible only at ≤760px via CSS media query
- [ ] T024 [US1] Implement mobile menu panel in `src/components/Navigation.jsx` — slide-in/dropdown with nav links + language switcher
- [ ] T025 [US1] Add keyboard accessibility to mobile menu: focus trap, Escape key to close, ARIA attributes (`aria-expanded`, `aria-label`)
- [ ] T026 [US1] Add route change listener to close mobile menu on navigation (use `useEffect` with `useLocation` from React Router)
- [ ] T027 [US1] Add CSS for mobile menu in `src/App.css` — responsive styles for hamburger button, menu panel, backdrop overlay
- [ ] T028 [US1] Test mobile navigation at 320px, 375px, 768px breakpoints — verify all links accessible
- [ ] T029 [US1] Verify bilingual content fallback: when AR field is empty, English version displays (check all components using `lang === 'ar' ? data.field_ar : data.field_en` pattern)

**Checkpoint**: Language toggle works on all pages. RTL renders cleanly. Mobile navigation functional. 100% of static strings from translation files.

---

## Phase 4: User Story 2 — Admin Manages Color Theme (Priority: P2)

**Goal**: Changing a color in the color bank (index.css or Supabase) updates all UI

**Independent Test**: Change `--accent` in `src/index.css` to a different color, refresh, verify all accent-colored elements update

### Implementation for User Story 2

- [ ] T030 [US2] Verify `src/hooks/useColorTokens.js` fetches `color_tokens` JSONB from `site_settings` and applies each key as CSS custom property on `<html>`
- [ ] T031 [US2] Verify `src/pages/admin/Appearance.jsx` displays all color tokens with color picker inputs and saves back to Supabase
- [ ] T032 [US2] Test: change accent color in Appearance admin → verify site updates without page reload
- [ ] T033 [US2] Test: change background color → verify all background-colored elements update
- [ ] T034 [US2] Verify `src/index.css` `:root` has sensible fallback defaults for all tokens (site works even if Supabase is unreachable)

**Checkpoint**: Color bank is single source of truth. Admin can change any color from Dashboard.

---

## Phase 5: User Story 3 — Admin Manages Home Page Content (Priority: P3)

**Goal**: About Me section and featured projects fully CMS-driven

**Independent Test**: Upload new About photo and edit About text in Dashboard; verify Home page updates. Mark 3 projects featured; verify they appear on Home.

### Implementation for User Story 3

- [ ] T035 [US3] Verify `src/pages/Home.jsx` fetches `site_settings` via `useSiteSettings()` hook and renders `profile_image_url` and `about_en`/`about_ar`
- [ ] T036 [US3] Verify About Me section layout: photo + text side-by-side on desktop, stacked on mobile (check CSS in `src/App.css`)
- [ ] T037 [US3] Verify `src/pages/admin/HomeContent.jsx` allows profile photo upload to Supabase Storage `profile` bucket
- [ ] T038 [US3] Verify `src/pages/admin/HomeContent.jsx` allows editing `about_en` and `about_ar` text fields
- [ ] T039 [US3] Verify Home page fetches featured projects: `projects where featured_position is not null order by featured_position limit 3`
- [ ] T040 [US3] Verify `src/pages/admin/HomeContent.jsx` enforces max 3 featured projects (toggle disabled or warning when 3 already selected)
- [ ] T041 [US3] Test: mark 3 projects as featured in Dashboard → verify exactly those 3 appear on Home page
- [ ] T042 [US3] Test: unfeature a project → verify Home page updates to show fewer featured projects
- [ ] T043 [US3] Verify featured project cards link to `/project/:id` detail pages

**Checkpoint**: Home page fully dynamic. About photo/text and featured projects managed from Dashboard.

---

## Phase 6: User Story 4 — Visitor Explores Projects (Priority: P4)

**Goal**: All projects browsable with detail pages and gallery

**Independent Test**: Navigate to Projects page, verify all published projects listed. Click project, verify title, description, gallery.

### Implementation for User Story 4

- [ ] T044 [US4] Verify `src/pages/Portfolio.jsx` fetches all published projects and renders in grid layout
- [ ] T045 [US4] Verify `src/components/ProjectCard.jsx` renders project title (bilingual), cover image, category, location, year
- [ ] T046 [US4] Verify `src/pages/ProjectDetail.jsx` fetches project by ID and renders title, description (bilingual), metadata
- [ ] T047 [US4] Verify `src/pages/ProjectDetail.jsx` fetches gallery images from `project_images` table and renders grid
- [x] T048 [US4] Implement lightbox modal in `src/pages/ProjectDetail.jsx` — click thumbnail opens full-screen overlay with image
- [x] T049 [US4] Add keyboard navigation to lightbox: Left/Right arrows for prev/next, Escape to close
- [x] T050 [US4] Add ARIA attributes to lightbox: `role="dialog"`, `aria-label`, focus management
- [ ] T051 [US4] Verify project with zero gallery images renders title + description without broken layout
- [ ] T052 [US4] Verify `src/hooks/useProjects.js` supports `featuredOnly` and `publishedOnly` filter parameters

**Checkpoint**: Full project browsing and detail viewing flow with accessible lightbox gallery.

---

## Phase 7: User Story 5 — Visitor Submits Contact Message (Priority: P5)

**Goal**: Contact form works, messages appear in Dashboard inbox

**Independent Test**: Submit contact form with valid data. Check Dashboard messages page for the submission.

### Implementation for User Story 5

- [x] T053 [US5] Verify `src/pages/Contact.jsx` renders contact info boxes (email, phone, location) from `useContactSettings()` hook
- [x] T054 [US5] Verify `src/components/ContactForm.jsx` has form fields: name, email, message + submit button
- [x] T055 [US5] Verify `src/components/ContactForm.jsx` validates required fields and email format before submission
- [x] T056 [US5] Verify `src/components/ContactForm.jsx` inserts into `contact_messages` table via Supabase client on submit
- [x] T057 [US5] Verify `src/components/ContactForm.jsx` shows success confirmation after successful submission
- [x] T058 [US5] Verify `src/components/ContactForm.jsx` shows error message if submission fails (database unreachable)
- [x] T059 [US5] Verify honeypot field (`_website`) is present and hidden in `src/components/ContactForm.jsx`
- [x] T060 [US5] Verify `src/pages/admin/Messages.jsx` fetches all `contact_messages` ordered by `created_at` desc
- [x] T061 [US5] Verify `src/pages/admin/Messages.jsx` displays sender name, email, message body, timestamp, read status
- [x] T062 [US5] Verify `src/pages/admin/Messages.jsx` allows toggling read/unread status and deleting messages

**Checkpoint**: Contact form submits successfully. Messages visible in Dashboard inbox with all required fields.

---

## Phase 8: User Story 6 — Admin Manages Contact Page & Footer (Priority: P6)

**Goal**: Contact page content and footer fully CMS-driven per locale

**Independent Test**: Update contact info and footer in Dashboard. Verify public pages reflect changes in both EN and AR.

### Implementation for User Story 6

- [x] T063 [US6] Verify `src/pages/admin/ContactFooter.jsx` loads `contact_page_settings` and `site_settings` into form
- [x] T064 [US6] Verify `src/pages/admin/ContactFooter.jsx` has fields for: heading_en/ar, intro_en/ar, email, phone, location_en/ar
- [x] T065 [US6] Verify `src/pages/admin/ContactFooter.jsx` has fields for: footer_copy_en/ar, footer_email, social links (GitHub, LinkedIn, Instagram)
- [x] T066 [US6] Verify save operation updates both `contact_page_settings` and `site_settings` tables in Supabase
- [x] T067 [US6] Verify `src/pages/Contact.jsx` renders updated heading, intro, email, phone, location from `useContactSettings()` hook
- [x] T068 [US6] Verify `src/components/Footer.jsx` renders updated footer content from `useSiteSettings()` hook
- [ ] T069 [US6] Test: update contact info in Dashboard → verify Contact page displays new values
- [ ] T070 [US6] Test: update footer text in Dashboard → verify footer displays new values on all pages
- [ ] T071 [US6] Test: switch language → verify bilingual content updates (EN version in English, AR version in Arabic)

**Checkpoint**: Contact page and footer fully editable from Dashboard. Bilingual content works correctly.

---

## Phase 9: User Story 7 — Admin Manages Project Galleries (Priority: P7)

**Goal**: Multi-image uploads per project with bilingual descriptions

**Independent Test**: Upload multiple images to a project. Add EN/AR descriptions. Verify Project Detail page shows all images and correct language description.

### Implementation for User Story 7

- [x] T072 [US7] Verify `src/pages/admin/ProjectEditor.jsx` has fields for `description_en` and `description_ar`
- [x] T073 [US7] Verify `src/pages/admin/ProjectEditor.jsx` supports cover image upload with compression (browser-image-compression)
- [x] T074 [US7] Verify `src/pages/admin/ProjectEditor.jsx` supports multiple gallery image uploads with compression
- [x] T075 [US7] Verify gallery images are stored in Supabase Storage `projects` bucket with correct file paths
- [x] T076 [US7] Verify gallery images have `alt_en` and `alt_ar` fields for accessibility
- [x] T077 [US7] Verify `src/pages/admin/ProjectEditor.jsx` allows reordering gallery images (drag or sort controls)
- [x] T078 [US7] Verify `src/pages/admin/ProjectEditor.jsx` allows deleting individual gallery images
- [x] T079 [US7] Verify client-side validation: file size ≤5MB, file type JPEG/PNG/WebP
- [x] T080 [US7] Verify graceful error handling when image upload fails (user-friendly error message, no crash)
- [ ] T081 [US7] Test: upload 5 images to a project → verify all appear in Project Detail gallery
- [ ] T082 [US7] Test: add EN and AR descriptions → verify correct language displays on Project Detail page
- [ ] T083 [US7] Test: leave AR description empty → verify English description displays as fallback in Arabic mode

**Checkpoint**: Project galleries fully manageable from Dashboard. Multi-image uploads work with compression and validation.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final QA pass and production readiness

- [ ] T084 Run production build: `npm run build` — verify no errors or warnings
- [ ] T085 Run full grep verification for hardcoded colors: `grep -r '#[0-9a-fA-F]\{3,6\}' src/ --include='*.css' --include='*.jsx' | grep -v 'index.css'`
- [ ] T086 Verify mobile responsiveness on all public pages (Home, Portfolio, Project Detail, Contact, 404) at 320px, 375px, 768px, 1024px
- [ ] T087 Verify keyboard navigation works on all interactive elements (nav links, form inputs, buttons, lightbox)
- [ ] T088 Verify WCAG 2.1 AA contrast ratios for all text-on-background combinations
- [ ] T089 Verify all Supabase RLS policies are enabled (check `supabase/migrations/001_cms_schema.sql`)
- [ ] T090 Run quickstart.md validation scenarios 1-10 end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Color Bank)**: Depends on Phase 1 — BLOCKS US2
- **Phase 3 (US1 - i18n)**: Depends on Phase 1 — can run parallel with Phase 2
- **Phase 4 (US2 - Colors)**: Depends on Phase 2 completion
- **Phase 5 (US3 - Home)**: Depends on Phase 1 — can run parallel with Phases 2-4
- **Phase 6 (US4 - Projects)**: Depends on Phase 1 — can run parallel with Phases 2-5
- **Phase 7 (US5 - Contact)**: Depends on Phase 1 — can run parallel with Phases 2-6
- **Phase 8 (US6 - Contact/Footer CMS)**: Depends on Phase 1 — can run parallel with Phases 2-7
- **Phase 9 (US7 - Galleries)**: Depends on Phase 1 — can run parallel with Phases 2-8
- **Phase 10 (Polish)**: Depends on ALL previous phases

### User Story Dependencies

- **US1 (i18n + Mobile Nav)**: Independent — can start after Phase 1
- **US2 (Color Theme)**: Depends on Phase 2 (color bank cleanup)
- **US3 (Home Content)**: Independent — can start after Phase 1
- **US4 (Projects)**: Independent — can start after Phase 1
- **US5 (Contact Form)**: Independent — can start after Phase 1
- **US6 (Contact/Footer CMS)**: Independent — can start after Phase 1
- **US7 (Galleries)**: Independent — can start after Phase 1

### Within Each User Story

- Verification tasks before fix tasks
- Fix tasks before integration testing
- Core implementation before polish

### Parallel Opportunities

- Phases 3, 5, 6, 7, 8, 9 can all run in parallel (independent user stories)
- Phase 2 can run parallel with Phase 3 (different files: App.css vs i18n files)
- T005, T006, T007 within Phase 2 can run in parallel (different files)
- T023-T029 within US1 can be grouped: CSS tasks (T027) parallel with JSX tasks (T023-T026)

---

## Parallel Example: User Story 1

```bash
# CSS and JSX tasks can be parallelized:
Task T023: "Add hamburger menu button to src/components/Navigation.jsx"
Task T027: "Add CSS for mobile menu in src/App.css"

# After both complete, integrate:
Task T024: "Implement mobile menu panel in src/components/Navigation.jsx"
Task T025: "Add keyboard accessibility to mobile menu"
Task T026: "Add route change listener to close mobile menu"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 3: US1 - i18n + Mobile Nav (T012-T029)
3. **STOP and VALIDATE**: Test language toggle and mobile nav
4. Deploy if ready

### Incremental Delivery

1. Phase 1 + Phase 2 → Foundation ready (color bank clean)
2. Phase 3 (US1) → i18n + mobile nav working → Deploy
3. Phase 4 (US2) → Color theme admin working → Deploy
4. Phase 5 (US3) → Home content CMS working → Deploy
5. Phase 6 (US4) → Project browsing + lightbox working → Deploy
6. Phase 7 (US5) → Contact form + inbox working → Deploy
7. Phase 8 (US6) → Contact/footer CMS working → Deploy
8. Phase 9 (US7) → Gallery management working → Deploy
9. Phase 10 → Polish + QA → Final deploy

### Parallel Team Strategy

With multiple developers:

1. Developer A: Phase 2 (Color Bank) → Phase 4 (US2)
2. Developer B: Phase 3 (US1 - i18n + Mobile Nav)
3. Developer C: Phases 5-9 (US3-US7) — these are mostly verification tasks

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- The project is ~85% implemented — most tasks are verification, not building from scratch
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No test framework configured — all testing is manual QA via quickstart.md
