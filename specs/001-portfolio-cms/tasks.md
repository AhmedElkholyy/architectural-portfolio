# Tasks: Bilingual Portfolio CMS

**Input**: Design documents from `/specs/001-portfolio-cms/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/, research.md, quickstart.md

**Tests**: Not requested in feature specification. Manual validation via quickstart.md scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- **Supabase**: `supabase/` at repository root
- Paths shown below follow the plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, configure tooling, prepare project structure

- [x] T001 Install React Router, i18next, react-i18next, browser-image-compression in `D:\Me\projects\architectural-portfolio`
- [x] T002 [P] Create `src/styles/tokens.css` with default CSS custom properties (background, surface, textPrimary, textMuted, accent, border, danger)
- [x] T003 [P] Create `src/styles/global.css` with base resets, font imports, and token references
- [x] T004 [P] Create `src/locales/en.json` with English translation keys for nav, home, portfolio, contact, admin, and shared UI text
- [x] T005 [P] Create `src/locales/ar.json` with Arabic translation keys matching en.json structure
- [x] T006 [P] Create `src/lib/i18n.js` configuring i18next with language detection, localStorage persistence, and JSON resources
- [x] T007 Create `supabase/migrations/001_cms_schema.sql` with new tables (site_settings, contact_page_settings, projects with bilingual fields, project_images, contact_messages), RLS policies, storage buckets, and seed data per data-model.md
- [x] T008 [P] Create `vercel.json` with SPA rewrite rule for client-side routing
- [x] T009 [P] Update `.env.example` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` placeholders

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T010 Refactor `src/main.jsx` to wrap app in React Router BrowserRouter and i18next provider
- [x] T011 Create `src/contexts/LanguageContext.jsx` providing current language, setLanguage function, and document direction (dir attribute) based on i18next language
- [x] T012 Create `src/contexts/AuthContext.jsx` providing user session, loading state, signIn, signOut functions using Supabase Auth
- [x] T013 Refactor `src/App.jsx` to define route structure: public routes (/, /portfolio, /project/:id, /contact) and admin routes (/admin, /admin/login, /admin/home, /admin/projects, /admin/projects/new, /admin/projects/:id, /admin/messages, /admin/contact-footer, /admin/appearance)
- [x] T014 Create `src/components/Layout.jsx` public layout wrapper with Navigation and Footer, using LanguageContext for direction
- [x] T015 Create `src/components/Navigation.jsx` bilingual nav with Home, Portfolio, Contact Me links and LanguageSwitcher component
- [x] T016 Create `src/components/LanguageSwitcher.jsx` EN/AR toggle that calls i18next changeLanguage and persists to localStorage
- [x] T017 Create `src/components/Footer.jsx` bilingual footer reading from site_settings via useSiteSettings hook
- [x] T018 Create `src/components/LoadingState.jsx` reusable loading spinner, error message, and empty state component
- [x] T019 Create `src/hooks/useSiteSettings.js` fetching site_settings singleton from Supabase with loading/error states
- [x] T020 Create `src/hooks/useColorTokens.js` fetching color_tokens from site_settings and applying them as CSS custom properties on document root
- [x] T021 Create `src/hooks/useProjects.js` fetching published projects from Supabase with optional category filter
- [x] T022 Create `src/hooks/useContactSettings.js` fetching contact_page_settings singleton from Supabase
- [x] T023 Create `src/pages/NotFound.jsx` bilingual 404 page

**Checkpoint**: Foundation ready - routing, i18n, auth, hooks, and layout components available for all user stories

---

## Phase 3: User Story 1 — Admin Login & Dashboard Access (Priority: P1)

**Goal**: Admin can log in at `/admin/login`, see dashboard overview with counts, and sign out

**Independent Test**: Log in with valid credentials → dashboard loads with project/message counts → sign out redirects to login

### Implementation for User Story 1

- [x] T024 [P] [US1] Create `src/pages/admin/Login.jsx` with email/password form, Supabase signInWithEmailAndPassword call, error handling, and redirect to /admin on success
- [x] T025 [P] [US1] Create `src/components/admin/AdminLayout.jsx` protected layout wrapper using AuthContext — redirects to /admin/login if no session, renders child routes with sign-out button
- [x] T026 [US1] Create `src/pages/admin/Dashboard.jsx` displaying project count, total message count, and unread message count from Supabase queries, with navigation shortcuts to projects, messages, home content, and appearance
- [x] T027 [US1] Update `src/App.jsx` to nest admin routes under AdminLayout with AuthContext provider

**Checkpoint**: Admin authentication flow fully functional; dashboard shows correct counts

---

## Phase 4: User Story 2 — Public Bilingual Portfolio Browsing (Priority: P1)

**Goal**: Visitor can browse home page (About Me, Featured Projects, Footer), switch languages (EN/AR with RTL), browse portfolio grid with filtering, and view project detail pages

**Independent Test**: Load home page → switch to Arabic (RTL) → navigate to portfolio → filter by category → click project card → view detail with gallery

### Implementation for User Story 2

- [x] T028 [P] [US2] Create `src/components/ProjectCard.jsx` bilingual project card component showing cover image, title (by language), category, and link to detail page
- [x] T029 [US2] Create `src/pages/Home.jsx` with About Me section (profile image + bilingual text from useSiteSettings), Selected Projects section (3 featured from useProjects), using Layout wrapper
- [x] T030 [US2] Create `src/pages/Portfolio.jsx` with responsive project grid, client-side category filter dropdown derived from loaded projects, using useProjects hook
- [x] T031 [US2] Create `src/pages/ProjectDetail.jsx` fetching single project by ID with gallery images, displaying bilingual title, description, cover, category, year, location, and image gallery with bilingual alt text
- [x] T032 [US2] Apply responsive styles to ProjectCard, Portfolio grid, and ProjectDetail for 320px, 768px, 1200px breakpoints
- [x] T033 [US2] Add `loading="lazy"` to all project and gallery images on public pages

**Checkpoint**: Full public portfolio experience functional in both languages with RTL support

---

## Phase 5: User Story 3 — Contact Form Submission (Priority: P2)

**Goal**: Visitor can fill and submit contact form with validation; submission stored in Supabase

**Independent Test**: Submit valid form → success message → message appears in admin dashboard

### Implementation for User Story 3

- [x] T034 [US3] Create `src/pages/Contact.jsx` with bilingual heading, intro, and contact cards from useContactSettings hook
- [x] T035 [US3] Create `src/components/ContactForm.jsx` with name, email, message fields, client-side validation (required, email type, minLength), honeypot hidden field, and success/error states
- [x] T036 [US3] Implement contact form submission to Supabase `contact_messages` table with rate limiting check (honeypot + submission frequency)
- [x] T037 [US3] Add responsive styles for Contact page layout (form + cards side by side on desktop, stacked on mobile)

**Checkpoint**: Contact form functional with validation; messages stored in Supabase

---

## Phase 6: User Story 4 — Project Management (Priority: P2)

**Goal**: Admin can create, edit, delete, publish/unpublish projects with bilingual fields, cover images, and gallery images

**Independent Test**: Create project → publish → appears on public Portfolio → unpublish → disappears → delete → removed

### Implementation for User Story 4

- [x] T038 [P] [US4] Create `src/pages/admin/Projects.jsx` listing all projects (draft + published) with status indicators, edit/delete/publish actions
- [x] T039 [US4] Create `src/pages/admin/ProjectEditor.jsx` form with bilingual title, description, category, location, year fields, cover image upload, draft/published toggle, and gallery image management
- [x] T040 [US4] Implement cover image upload to Supabase Storage `projects` bucket with client-side compression (browser-image-compression), size validation (5 MB max), and format validation (JPEG, PNG, WebP, AVIF)
- [x] T041 [US4] Implement gallery image upload with multiple file support, bilingual alt text inputs, drag-to-reorder (display_order), and individual upload progress
- [x] T042 [US4] Implement project CRUD operations (create, update, delete) with Supabase queries, including cover_image_url required validation when publishing
- [x] T043 [US4] Implement project delete with confirmation dialog, storage cleanup (delete associated images), and featured_position clearing

**Checkpoint**: Full project management lifecycle functional; public Portfolio reflects admin changes

---

## Phase 7: User Story 5 — Home Content Management (Priority: P3)

**Goal**: Admin can edit About Me profile image, bilingual paragraphs, and select/reorder three featured projects

**Independent Test**: Upload profile image → edit About Me text → select featured projects → home page reflects changes

### Implementation for User Story 5

- [x] T044 [US5] Create `src/pages/admin/HomeContent.jsx` with profile image upload, bilingual About Me text editors, and featured project selector (max 3, reorderable)
- [x] T045 [US5] Implement profile image upload to Supabase Storage `profile` bucket with compression and size validation
- [x] T046 [US5] Implement featured project selection logic: set featured_position on selected projects, clear position on deselected, enforce max 3
- [x] T047 [US5] Implement site_settings update (about_en, about_ar, profile_image_url) with Supabase query

**Checkpoint**: Home content editable from dashboard; public home page reflects all changes

---

## Phase 8: User Story 6 — Contact & Footer Content Management (Priority: P3)

**Goal**: Admin can edit contact page heading, intro, cards, footer copy, email, and social links in both languages

**Independent Test**: Edit contact page content → public Contact page updates → edit footer → footer updates

### Implementation for User Story 6

- [x] T048 [US6] Create `src/pages/admin/ContactFooter.jsx` with bilingual editors for contact page heading, intro, email, phone, location, and footer copy, email, social links
- [x] T049 [US6] Implement contact_page_settings and site_settings footer field updates with Supabase queries

**Checkpoint**: Contact page and footer content fully editable from dashboard

---

## Phase 9: User Story 7 — Message Management (Priority: P3)

**Goal**: Admin can view message list, mark read/unread, and delete messages

**Independent Test**: Submit message → view in dashboard → mark read → mark unread → delete

### Implementation for User Story 7

- [x] T050 [US7] Create `src/pages/admin/Messages.jsx` with message list table showing sender name, email, message preview, read status, and date
- [x] T051 [US7] Implement mark read/unread toggle and delete action with Supabase queries, confirmation dialog for delete

**Checkpoint**: Message inbox functional with all CRUD operations

---

## Phase 10: User Story 8 — Appearance / Color Token Management (Priority: P4)

**Goal**: Admin can view and edit semantic color-token values; token names fixed; changes reflected site-wide

**Independent Test**: Change accent token → public site updates → attempt rename → prevented

### Implementation for User Story 8

- [x] T052 [US8] Create `src/pages/admin/Appearance.jsx` with color token editor displaying current values, color pickers for each token, and save functionality
- [x] T053 [US8] Implement token name immutability (disable rename UI) and site_settings color_tokens update with Supabase query
- [x] T054 [US8] Ensure useColorTokens hook refreshes tokens after save, updating CSS custom properties in real time

**Checkpoint**: Color token management functional; site theme updates dynamically

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T055 [P] Add keyboard navigation support (focus styles, tab order, escape to close modals) across all public and admin pages
- [x] T056 [P] Add `prefers-reduced-motion` media query to disable animations for users who prefer reduced motion
- [x] T057 [P] Verify and fix WCAG 2.1 AA contrast ratios across all token-based color combinations
- [x] T058 [P] Add meaningful alt text placeholders and validation (Constitution Principle II) — ensure no image can be saved without bilingual alt text
- [x] T059 [P] Audit all hardcoded colors in existing styles and replace with CSS custom property references
- [x] T060 Run `npm run build` and verify production build completes without errors
- [x] T061 Run `npm run lint` and fix any linting issues
- [ ] T062 Validate all quickstart.md scenarios (V1–V14) manually
- [ ] T063 Verify Supabase RLS policies by testing unauthenticated access attempts in browser DevTools

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–10)**: All depend on Foundational phase completion
  - US1 (Admin Auth) and US2 (Public Browsing) are independent of each other
  - US3 (Contact Form) depends on US2 (Contact page layout exists)
  - US4 (Project Management) depends on US2 (Portfolio page exists)
  - US5 (Home Content) depends on US2 (Home page exists)
  - US6 (Contact/Footer Content) depends on US2 + US3 (Contact page + form exist)
  - US7 (Messages) depends on US3 (Contact form creates messages)
  - US8 (Appearance) depends on US2 (Color tokens affect public site)
- **Polish (Phase 11)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (Admin Auth, P1)**: Can start after Foundational — No dependencies on other stories
- **US2 (Public Browsing, P1)**: Can start after Foundational — No dependencies on other stories
- **US3 (Contact Form, P2)**: Can start after Foundational — Independently testable but benefits from US2 layout
- **US4 (Project Management, P2)**: Can start after Foundational — Independently testable but benefits from US2 pages
- **US5 (Home Content, P3)**: Depends on US2 (Home page must exist)
- **US6 (Contact/Footer Content, P3)**: Depends on US2 + US3 (Contact page must exist)
- **US7 (Messages, P3)**: Depends on US3 (Contact form must create messages)
- **US8 (Appearance, P4)**: Depends on US2 (Color tokens affect public site)

### Within Each User Story

- Components before pages (pages consume components)
- Hooks before pages (pages consume hooks)
- Forms before submission logic
- CRUD operations before UI polish

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, US1 and US2 can start in parallel
- US3, US4, US5 can start in parallel after US2 completes
- US6 and US7 can start in parallel after US3 completes
- US8 can start after US2 completes
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch all US2 tasks that can run in parallel:
Task: "Create src/components/ProjectCard.jsx"
Task: "Create src/pages/Home.jsx"
Task: "Create src/pages/Portfolio.jsx"

# After Home and Portfolio are created:
Task: "Create src/pages/ProjectDetail.jsx"

# After all pages exist:
Task: "Apply responsive styles to ProjectCard, Portfolio grid, and ProjectDetail"
Task: "Add loading='lazy' to all project and gallery images"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Admin Auth)
4. Complete Phase 4: User Story 2 (Public Browsing)
5. **STOP and VALIDATE**: Admin can log in; public site browsable in EN/AR
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 + US2 → Admin + Public site functional (MVP!)
3. Add US3 → Contact form working → Deploy/Demo
4. Add US4 → Project management working → Deploy/Demo
5. Add US5 + US6 + US7 → All content management working → Deploy/Demo
6. Add US8 → Appearance customization → Final release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Admin Auth)
   - Developer B: US2 (Public Browsing)
3. After US2 completes:
   - Developer A: US4 (Project Management)
   - Developer B: US3 (Contact Form)
4. After US3 completes:
   - Developer A: US5 + US6 (Home + Contact/Footer Content)
   - Developer B: US7 (Messages)
5. Developer C: US8 (Appearance) after US2

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Constitution compliance: All tasks must satisfy the 5 core principles (editorial clarity, image quality, responsive interaction, performance, honest stories)
