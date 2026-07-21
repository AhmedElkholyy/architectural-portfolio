# Feature Specification: Bilingual Portfolio CMS

**Feature Branch**: `001-portfolio-cms`

**Created**: 2026-07-18

**Status**: Draft

**Input**: Transform the existing React portfolio into a bilingual Arabic/English architectural-engineer portfolio with a protected content dashboard at `/admin`. The owner will manage public content, projects, images, and incoming contact messages without changing code.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Login & Dashboard Access (Priority: P1)

The portfolio owner visits `/admin`, enters their email and password, and sees a dashboard overview with project count, message count, and unread-message count. From the dashboard, they can navigate to manage projects, messages, home content, and appearance settings. If they are not logged in, they are redirected to `/admin/login`. They can sign out from the dashboard.

**Why this priority**: Without authentication and dashboard access, no content can be managed. This is the foundation for all admin functionality.

**Independent Test**: Can be fully tested by logging in with valid credentials and verifying the dashboard loads with correct counts. Signing out redirects back to login.

**Acceptance Scenarios**:

1. **Given** the admin is on `/admin/login`, **When** they enter valid credentials and submit, **Then** they are redirected to `/admin` and see the dashboard overview.
2. **Given** the admin is on `/admin` and signed in, **When** they click sign out, **Then** they are redirected to `/admin/login` and cannot access `/admin` again without logging in.
3. **Given** a visitor is on any `/admin` page without being signed in, **When** the page loads, **Then** they are redirected to `/admin/login`.
4. **Given** the admin is on the dashboard, **When** they view the overview, **Then** they see project count, total message count, and unread message count.

---

### User Story 2 - Public Bilingual Portfolio Browsing (Priority: P1)

A visitor lands on the home page and sees the About Me section with a profile image and bilingual text, three featured published projects as cards, and a footer with contact information and social links. They can switch between English and Arabic using the navigation language control. The Arabic layout uses right-to-left direction. Their language choice persists between visits. They can navigate to the Portfolio page to see all published projects in a responsive grid with category filtering, and click into any project to see its detail page with title, description, cover image, category, year, location, and photo gallery with bilingual alt text.

**Why this priority**: The public-facing portfolio is the core product. Without it, there is no site to manage.

**Independent Test**: Can be fully tested by loading the home page, switching languages, navigating to the portfolio grid, filtering by category, and viewing a project detail page. All content respects the selected language and direction.

**Acceptance Scenarios**:

1. **Given** a visitor is on the home page in English, **When** they switch to Arabic, **Then** all text updates to Arabic and the layout switches to right-to-left.
2. **Given** a visitor has selected Arabic, **When** they navigate to another page, **Then** the language remains Arabic and the direction remains right-to-left.
3. **Given** a visitor is on the Portfolio page, **When** they select a category filter, **Then** only published projects in that category are displayed.
4. **Given** a visitor clicks a project card, **When** the detail page loads, **Then** they see the bilingual title, description, cover image, category, year, location, and photo gallery.
5. **Given** a visitor views a gallery image, **When** they inspect the image, **Then** meaningful alt text is present in the current language.

---

### User Story 3 - Contact Form Submission (Priority: P2)

A visitor navigates to the Contact Me page and sees a bilingual heading, intro text, and three contact cards (email, phone, location) alongside a contact form with name, email, and message fields. They fill out the form with valid information, submit it, and see a success message. If they submit with invalid data, they see clear validation errors. The submitted message is stored and visible only to the admin in the dashboard.

**Why this priority**: Contact forms are essential for a portfolio site to generate leads. Lower priority than browsing because it depends on the public site being functional.

**Independent Test**: Can be fully tested by filling out and submitting the contact form, verifying success/error states, and confirming the message appears in the admin dashboard.

**Acceptance Scenarios**:

1. **Given** a visitor is on the Contact Me page, **When** they fill in name, email, and message with valid data and submit, **Then** they see a success confirmation.
2. **Given** a visitor submits the form with an invalid email, **When** validation runs, **Then** they see a clear error message on the email field.
3. **Given** a message is submitted, **When** the admin views messages in the dashboard, **Then** the message appears with sender name, email, message text, read status, and timestamp.
4. **Given** a visitor submits the form repeatedly in quick succession, **When** rate limiting triggers, **Then** they see an appropriate error message.

---

### User Story 4 - Project Management (Priority: P2)

The admin navigates to project management from the dashboard and can create, edit, delete, publish, and unpublish projects. Each project has bilingual title and description, category, location, year, cover image, and multiple gallery images with display order and bilingual alt text. The admin can set a project as draft or published. Published projects appear on the public Portfolio page; drafts do not.

**Why this priority**: Projects are the core content of an architectural portfolio. Without project management, the portfolio has nothing to display.

**Independent Test**: Can be fully tested by creating a project with all fields, publishing it, verifying it appears on the public Portfolio page, then unpublishing it and confirming it disappears.

**Acceptance Scenarios**:

1. **Given** the admin creates a project with bilingual fields and publishes it, **When** a visitor loads the Portfolio page, **Then** the project appears in the grid.
2. **Given** the admin creates a project and leaves it as draft, **When** a visitor loads the Portfolio page, **Then** the project does not appear.
3. **Given** the admin uploads gallery images to a project, **When** a visitor views the project detail page, **Then** the images appear in the specified order with correct bilingual alt text.
4. **Given** the admin sets a project's featured position to one of the three slots, **When** a visitor loads the home page, **Then** the project appears in the Selected Projects section at the specified position.
5. **Given** the admin deletes a project, **When** a visitor loads the Portfolio page, **Then** the project no longer appears.

---

### User Story 5 - Home Content Management (Priority: P3)

The admin navigates to Home Content from the dashboard and can upload or change the About Me profile image, edit English and Arabic About Me paragraphs, and choose and reorder three featured projects. Changes are reflected on the public home page.

**Why this priority**: Home content is important but less critical than project management since it can be updated after projects are in place.

**Independent Test**: Can be fully tested by uploading a profile image, editing the About Me text in both languages, selecting three featured projects, and verifying the home page reflects all changes.

**Acceptance Scenarios**:

1. **Given** the admin uploads a new profile image, **When** a visitor loads the home page, **Then** the new image appears in the About Me section.
2. **Given** the admin edits the About Me paragraph in Arabic, **When** a visitor switches to Arabic on the home page, **Then** the updated Arabic text is displayed.
3. **Given** the admin reorders the three featured projects, **When** a visitor loads the home page, **Then** the projects appear in the new order.

---

### User Story 6 - Contact & Footer Content Management (Priority: P3)

The admin navigates to Contact and Footer Content from the dashboard and can edit the contact page heading, intro text, and contact cards (email, phone, location) in both languages. They can also edit footer copy, email, and social links. Changes are reflected on the public Contact Me page and footer.

**Why this priority**: Contact and footer content are editable elements that support the portfolio but are not the primary content.

**Independent Test**: Can be fully tested by editing contact page content and footer content, then verifying both the Contact Me page and footer display the updated information.

**Acceptance Scenarios**:

1. **Given** the admin edits the contact page heading in English, **When** a visitor views the Contact Me page in English, **Then** the updated heading is displayed.
2. **Given** the admin updates the footer social links, **When** a visitor views any page, **Then** the footer shows the updated social links.

---

### User Story 7 - Message Management (Priority: P3)

The admin navigates to Messages from the dashboard and sees a list of submitted messages with sender name, email, message text, read/unread status, and date. They can mark messages as read or unread, and delete messages.

**Why this priority**: Message management is important for the admin but depends on the contact form being functional first.

**Independent Test**: Can be fully tested by submitting a message via the contact form, then viewing it in the dashboard, marking it read/unread, and deleting it.

**Acceptance Scenarios**:

1. **Given** messages exist in the dashboard, **When** the admin views the messages list, **Then** each message shows sender name, email, message text, read status, and date.
2. **Given** the admin marks an unread message as read, **When** they refresh the messages list, **Then** the message shows as read and the unread count decreases.
3. **Given** the admin deletes a message, **When** they refresh the messages list, **Then** the message no longer appears.

---

### User Story 8 - Appearance / Color Token Management (Priority: P4)

The admin navigates to Appearance from the dashboard and can view and edit semantic color-token values. Token names remain fixed; only their values can be changed. Changes are reflected across the entire site in real time.

**Why this priority**: Color token management is a polish feature. The site functions with default tokens, and customization is a nice-to-have.

**Independent Test**: Can be fully tested by changing a color token value in the dashboard and verifying the corresponding element changes color on the public site.

**Acceptance Scenarios**:

1. **Given** the admin changes the `accent` token value, **When** a visitor loads any page, **Then** elements using the accent color reflect the new value.
2. **Given** the admin attempts to rename a token, **When** they try to save, **Then** the system prevents the rename and the token name remains fixed.

---

### Edge Cases

- What happens when the admin uploads an image that exceeds size or format limits? The system rejects the upload with a clear error message.
- What happens when the admin tries to feature more than three projects? The system prevents selection beyond three.
- What happens when the admin deletes a project that is currently featured on the home page? The featured slot becomes empty or the next available project fills it.
- What happens when a visitor submits the contact form with a script or spam content? Basic anti-spam protection blocks the submission.
- What happens when the admin tries to publish a project without a cover image? The system requires a cover image before publishing.
- What happens when the network is slow and the admin uploads many gallery images? Images are uploaded individually with progress feedback.
- What happens when the admin changes the site language while editing content? The dashboard remains in its current language until explicitly switched.
- What happens when the Supabase connection is lost during a form submission? The system displays an error message and allows retry.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate the single admin account via email and password.
- **FR-002**: System MUST redirect unauthenticated visitors from `/admin` and all nested admin pages to `/admin/login`.
- **FR-003**: System MUST allow the admin to sign out from the dashboard.
- **FR-004**: System MUST store and retrieve all public content from the database, including bilingual text fields.
- **FR-005**: System MUST support English (`en`) and Arabic (`ar`) with automatic layout direction switching (LTR/RTL).
- **FR-006**: System MUST persist the visitor's language selection between visits.
- **FR-007**: System MUST display exactly three featured, published projects on the home page in admin-defined order.
- **FR-008**: System MUST display all published projects on the Portfolio page in a responsive grid with category filtering.
- **FR-009**: System MUST display draft projects only in the admin dashboard, never on public pages.
- **FR-010**: System MUST allow the admin to create, edit, delete, publish, and unpublish projects with bilingual fields.
- **FR-011**: System MUST support cover images and multiple gallery images per project with display order and bilingual alt text.
- **FR-012**: System MUST display the project detail page with bilingual title, description, cover image, category, year, location, and photo gallery.
- **FR-013**: System MUST provide a contact form with name, email, and message fields with client-side validation.
- **FR-014**: System MUST store contact form submissions and display them only in the admin dashboard.
- **FR-015**: System MUST allow the admin to mark messages as read/unread and delete messages.
- **FR-016**: System MUST allow the admin to edit the About Me profile image and bilingual paragraphs.
- **FR-017**: System MUST allow the admin to edit contact page heading, intro, and contact cards in both languages.
- **FR-018**: System MUST allow the admin to edit footer copy, email, and social links.
- **FR-019**: System MUST allow the admin to view and edit semantic color-token values with fixed token names.
- **FR-020**: System MUST validate uploaded images for size and format before accepting them.
- **FR-021**: System MUST compress uploaded images and lazy-load them on public pages.
- **FR-022**: System MUST provide basic anti-spam protection and rate limiting on the contact form.
- **FR-023**: System MUST restrict database write operations to the authenticated admin via row-level security.
- **FR-024**: System MUST restrict public access to the messages table entirely.
- **FR-025**: System MUST display the dashboard overview with project count, message count, and unread message count.

### Key Entities

- **Site Settings**: Stores the profile image, bilingual About Me text, color token values, and footer configuration (copy, email, social links).
- **Contact Page Settings**: Stores the bilingual heading, intro text, and contact card values (email, phone, location).
- **Project**: Represents a portfolio project with bilingual title and description, category, location, year, cover image URL, featured position (one of three slots or none), and publication status (draft/published).
- **Project Image**: Represents a gallery image linked to a project, with image URL, display order, and bilingual alt text.
- **Contact Message**: Represents a submitted inquiry with sender name, sender email, message text, read status, and timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can switch between English and Arabic and see all content update within 1 second.
- **SC-002**: The home page loads with profile image, three featured projects, and footer in under 3 seconds on a standard broadband connection.
- **SC-003**: The Portfolio page displays all published projects in a responsive grid that reflows cleanly at 320px, 768px, and 1200px widths.
- **SC-004**: The admin can create and publish a new project with all fields in under 5 minutes.
- **SC-005**: The admin can submit and view a contact form message in the dashboard within 5 seconds of submission.
- **SC-006**: All interactive elements (navigation, forms, dashboard controls, galleries) are fully operable via keyboard alone.
- **SC-007**: All uploaded images have meaningful alt text that updates correctly when the language is switched.
- **SC-008**: The contact form rejects spam submissions and limits rapid repeated submissions.
- **SC-009**: The production build completes without errors and all public routes, admin access, English, Arabic, and RTL layouts render correctly.
- **SC-010**: Draft projects are never visible on any public page under any circumstance.

## Assumptions

- The portfolio owner has a single admin account with known email and password credentials.
- The existing React project structure (Vite + React) will be extended rather than replaced.
- Supabase will provide authentication, database, and file storage services.
- The site will be deployed to Vercel.
- All managed public content (text, images, settings) will be stored in Supabase and fetched at runtime.
- The admin dashboard interface will be in English initially; only managed public content must be bilingual.
- Image uploads will have reasonable size limits (e.g., 5 MB for profile/cover, 10 MB per gallery image) that can be adjusted.
- The site will use semantic color tokens defined as CSS custom properties for theming.
- Category values for projects will be predefined or free-text entered by the admin.
- The contact form does not send email notifications; messages are viewable only in the dashboard.
