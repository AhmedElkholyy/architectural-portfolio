# Feature Specification: Portfolio Content System

**Feature Branch**: `001-portfolio-cms-i18n`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Enhance the existing React + Vite + Supabase portfolio site with a centralized color system, EN/AR internationalization (with RTL support), a restructured Home page, an editable Contact page with a message inbox, and full-featured Project detail pages — all content-managed via the existing admin Dashboard."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor Views Localized Portfolio (Priority: P1)

A visitor lands on the portfolio site and sees all content in English (default). They click the language switcher in the navbar and toggle to Arabic. The entire site switches to Arabic with RTL layout — navigation, headings, paragraphs, footer, and project content all display in Arabic direction. The language preference persists as they navigate between pages.

**Why this priority**: Internationalization is foundational — all other features depend on content being translatable and the layout adapting to RTL. Without this, Arabic-speaking users cannot use the site.

**Independent Test**: Toggle the language switcher from EN to AR and verify all visible text changes, layout flips to RTL, and preference persists across page navigation.

**Acceptance Scenarios**:

1. **Given** the site loads in English by default, **When** the visitor clicks the language switcher and selects Arabic, **Then** all UI text (nav labels, headings, button labels, placeholders, footer) switches to Arabic without page reload.
2. **Given** the site is in Arabic mode, **When** the visitor navigates to Home, Projects, Contact, or a Project Detail page, **Then** the layout renders in RTL direction across all pages.
3. **Given** the visitor switches to Arabic, **When** they refresh the page or return later, **Then** the site loads in Arabic (language preference persists).
4. **Given** a page contains admin-managed content (about text, project descriptions, contact info), **When** viewing in Arabic, **Then** the Arabic version of that content is displayed if available, otherwise the English version is shown as fallback.

---

### User Story 2 - Admin Manages Color Theme (Priority: P2)

The admin can change the site's color scheme by modifying values in a single color bank file. All components across the site automatically reflect the updated colors — no manual component-by-component changes needed.

**Why this priority**: Centralized theming enables rapid visual iteration and brand consistency. It's a prerequisite for the CMS-driven approach where content and appearance should be separately managed.

**Independent Test**: Change a color value in the color bank and verify it updates everywhere that color is used across the site.

**Acceptance Scenarios**:

1. **Given** the color bank defines `--color-primary`, **When** the admin changes its value, **Then** all components using primary color (buttons, links, accents) display the new color.
2. **Given** the color bank is the single source of truth, **When** searching component files for raw hex/rgb color codes, **Then** no hardcoded color values are found outside the color bank file.
3. **Given** the color bank is updated, **When** the site is viewed, **Then** the new colors apply consistently across all pages (Home, Projects, Contact, Project Detail, Dashboard).

---

### User Story 3 - Admin Manages Home Page Content (Priority: P3)

The admin can update the About Me section (photo and paragraph text) and select up to 3 featured projects to display on the Home page — all from the Dashboard without code changes.

**Why this priority**: The Home page is the primary landing experience. Keeping it current with the engineer's latest photo, bio, and featured work is essential for portfolio effectiveness.

**Independent Test**: Upload a new About photo and change the About text in the Dashboard, then verify the Home page reflects the changes. Mark 3 projects as featured and verify they appear on Home.

**Acceptance Scenarios**:

1. **Given** the admin is in the Dashboard, **When** they upload a new About photo, **Then** the Home page displays the new photo in the About Me section.
2. **Given** the admin edits the About paragraph (EN and AR versions), **When** the Home page loads, **Then** the updated paragraph is displayed in the current language.
3. **Given** the admin marks 3 projects as "Featured" in the Dashboard, **When** the Home page loads, **Then** exactly those 3 projects appear in the Selected Projects section with links to their detail pages.
4. **Given** fewer than 3 projects are marked featured, **When** the Home page loads, **Then** the available featured projects are displayed (no empty slots or errors).

---

### User Story 4 - Visitor Explores Projects (Priority: P4)

A visitor can browse all projects on the Projects page and click any project to view its full details — title, descriptive paragraph, and photo gallery.

**Why this priority**: Project detail pages are the core value proposition of a portfolio — they showcase the engineer's work in depth.

**Independent Test**: Navigate to the Projects page, verify all projects are listed, click a project and verify its title, description, and gallery images load correctly.

**Acceptance Scenarios**:

1. **Given** projects exist in the system, **When** the visitor navigates to the Projects page, **Then** all projects are displayed in a grid/list layout.
2. **Given** a visitor clicks a project card, **When** the Project Detail page loads, **Then** the project title, description (in current language), and photo gallery are displayed.
3. **Given** a project has multiple gallery images, **When** viewing the Project Detail page, **Then** all images are accessible via a clean viewing experience (grid with lightbox/carousel).

---

### User Story 5 - Visitor Submits Contact Message (Priority: P5)

A visitor can fill out a contact form (name, email, message) on the Contact page and submit it. The message is stored and visible in the Dashboard inbox.

**Why this priority**: Contact forms enable potential clients/employers to reach out. The dashboard inbox provides a simple way to track inquiries without external tools.

**Independent Test**: Submit a contact form with valid data, then check the Dashboard to verify the message appears with sender info, message body, and timestamp.

**Acceptance Scenarios**:

1. **Given** the visitor is on the Contact page, **When** they fill in name, email, and message and click submit, **Then** the message is saved and a success confirmation is shown.
2. **Given** a message is submitted, **When** the admin views the Dashboard inbox, **Then** the message appears with sender name, email, message body, and submission timestamp.
3. **Given** the visitor submits the form with missing required fields, **When** they click submit, **Then** validation errors are displayed and the form is not submitted.
4. **Given** the visitor submits the form with an invalid email format, **When** they click submit, **Then** an email validation error is shown.

---

### User Story 6 - Admin Manages Contact Page & Footer (Priority: P6)

The admin can update the Contact page content (intro heading/text, email, phone, location) and Footer content (tagline, copyright, social links) from the Dashboard, per locale.

**Why this priority**: Contact information and footer details change over time. Making them admin-editable avoids code deployments for simple content updates.

**Independent Test**: Update contact info and footer text in the Dashboard, then verify the public Contact page and footer reflect the changes in both EN and AR.

**Acceptance Scenarios**:

1. **Given** the admin updates contact page intro text and info fields (email, phone, location) in the Dashboard, **When** the Contact page loads, **Then** the updated information is displayed.
2. **Given** the admin updates footer content (tagline, copyright, social links) in the Dashboard, **When** any page loads, **Then** the footer displays the updated content.
3. **Given** content has both EN and AR versions, **When** viewing in Arabic, **Then** the Arabic version is displayed; if AR is missing, English fallback is used.

---

### User Story 7 - Admin Manages Project Galleries (Priority: P7)

The admin can upload multiple images per project via the Dashboard, stored in cloud storage, and manage project descriptions in both EN and AR.

**Why this priority**: Rich project galleries are essential for an architectural portfolio. Multi-image support with per-locale descriptions enables comprehensive project showcases.

**Independent Test**: Upload multiple images to a project in the Dashboard, add EN and AR descriptions, then verify they appear correctly on the Project Detail page in both languages.

**Acceptance Scenarios**:

1. **Given** the admin uploads multiple images to a project, **When** viewing the Project Detail page, **Then** all images are displayed in the gallery.
2. **Given** the admin adds EN and AR descriptions to a project, **When** viewing in English, **Then** the English description is shown; when switching to Arabic, **Then** the Arabic description is shown.
3. **Given** a project has no AR description, **When** viewing in Arabic, **Then** the English description is displayed as fallback.

---

### Edge Cases

- What happens when the color bank file is missing a required variable? The site should use sensible fallback colors (defined in the CSS as default values).
- What happens when an admin uploads an image that exceeds size/format limits? The system should display a clear validation error and reject the upload.
- What happens when the Supabase Storage is unavailable? Image uploads fail gracefully with an error message; existing cached images continue to display.
- What happens when a visitor submits a contact message while the database is unreachable? The form should show an error and allow retry.
- What happens when more than 3 projects are marked as featured? The system should enforce the maximum of 3 in the Dashboard UI (disable additional selections).
- What happens when a project has zero gallery images? The Project Detail page should display the title and description without a gallery section (no broken layout).
- What happens when the language switcher is toggled rapidly? The UI should handle the switch without visual glitches or duplicate renders.
- What happens when an admin deletes a project that is marked as featured? The project should be automatically unfeatured and removed from the Home page selection.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST define all color values as CSS custom properties in a single color bank file, with no hardcoded color values in component files.
- **FR-002**: System MUST support English (default) and Arabic languages with a visible language switcher in the navbar.
- **FR-003**: System MUST switch document direction to RTL when Arabic is selected and revert to LTR for English.
- **FR-004**: System MUST persist language preference across page navigation and browser sessions (localStorage).
- **FR-005**: System MUST source all static UI strings (nav labels, headings, button labels, form labels, placeholders, footer labels) from translation files, not hardcoded in components.
- **FR-006**: System MUST support per-locale values for admin-editable content (about text, project descriptions, contact info, footer content) with English fallback when Arabic is missing.
- **FR-007**: System MUST display the About Me section on the Home page with a photo and paragraph text, both editable from the Dashboard.
- **FR-008**: System MUST display up to 3 featured projects on the Home page, selectable by the admin from the full projects list.
- **FR-009**: System MUST display all projects on the Projects page with links to individual Project Detail pages.
- **FR-010**: System MUST display Project Detail pages with title, description, and photo gallery (multiple images).
- **FR-011**: System MUST provide a gallery viewing experience that supports multiple images (grid with lightbox or carousel).
- **FR-012**: System MUST display a Contact page with editable intro content, info boxes (email, phone, location), and a message submission form.
- **FR-013**: System MUST validate contact form submissions (required fields, valid email format) before saving.
- **FR-014**: System MUST store submitted contact messages with sender name, email, message body, and timestamp.
- **FR-015**: System MUST display a read-only inbox of contact messages in the Dashboard.
- **FR-016**: System MUST allow the admin to manage footer content (tagline, copyright, social links) from the Dashboard.
- **FR-017**: System MUST support multi-image uploads per project via the Dashboard, stored in cloud storage.
- **FR-018**: System MUST enforce a maximum of 3 featured projects in the Dashboard UI.
- **FR-019**: System MUST automatically unfeature a project if it is deleted by the admin.
- **FR-020**: System MUST handle image upload failures gracefully with user-friendly error messages.

### Key Entities

- **Color Token**: A named color value (e.g., primary, secondary, accent, background, surface, text-primary, text-secondary, text-inverse, border, error, success) defined as a CSS custom property.
- **Translation**: A key-value pair for a specific locale (en or ar) mapping UI string identifiers to localized text.
- **Project**: An architectural project with title, description (per-locale), gallery images, and a featured flag.
- **About Content**: The engineer's photo and biographical paragraph (per-locale).
- **Footer Content**: Tagline, copyright text, and social links (per-locale).
- **Contact Page Content**: Intro heading/text, email, phone, location (per-locale).
- **Contact Message**: A visitor submission with name, email, message body, and timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Changing a color value in the color bank updates all corresponding UI elements across the site within a single page load.
- **SC-002**: Toggling between English and Arabic changes all visible text and layout direction without requiring a full page reload.
- **SC-003**: 100% of static UI strings are sourced from translation files — no hardcoded strings visible in either language.
- **SC-004**: Admin can update any content field (about, projects, contact, footer) from the Dashboard without touching code.
- **SC-005**: Contact form submissions appear in the Dashboard inbox within 5 seconds of submission.
- **SC-006**: All image uploads (about photo, project galleries) are stored in cloud storage and render correctly on the public site.
- **SC-007**: The site remains fully functional and visually correct across mobile (320px+) and desktop viewports.
- **SC-008**: RTL layout is correctly applied across all pages when Arabic is selected — no left-to-right artifacts remain.
- **SC-009**: Form validation prevents submission of invalid data (missing required fields, malformed email) with clear error messages.
- **SC-010**: Featured project count is enforced — selecting a 4th featured project is prevented in the Dashboard UI.

## Assumptions

- The existing Supabase authentication system for Dashboard login will be reused — no new auth implementation needed.
- The existing project CRUD functionality in the Dashboard will be extended, not replaced.
- Supabase Storage is already configured and accessible for image uploads.
- The site uses a CSS framework (e.g., Tailwind CSS) that can be extended to reference CSS custom properties.
- The existing navbar already has a responsive mobile menu that can be extended to include the language switcher.
- Gallery viewing pattern (lightbox vs. carousel) will be determined during implementation planning.
- Image size/format constraints will be defined during implementation planning (client-side validation + Supabase Storage policies).
- The footer's current structure and fields will be confirmed against the existing markup during implementation.
- Featured project selection will use a checkbox/toggle UX (drag-order is out of scope for initial implementation).
- Language preference storage via localStorage is acceptable (no server-side preference needed).
- The site already has a working Home, Projects, and Contact page structure that will be enhanced, not built from scratch.
