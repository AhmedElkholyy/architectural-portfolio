# Quickstart Validation Guide: Bilingual Portfolio CMS

**Feature**: 001-portfolio-cms
**Date**: 2026-07-18

## Prerequisites

- Node.js 18+ installed
- Supabase project created with URL and anon key
- `.env.local` configured with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- SQL migrations run in Supabase SQL Editor (see `supabase/migrations/001_cms_schema.sql`)
- Storage buckets `profile` and `projects` created with public read access
- Admin user created in Supabase Auth

## Setup

```bash
npm install
npm run dev
```

Site runs at `http://localhost:5173`.

---

## Validation Scenarios

### V1: Admin Login & Dashboard

1. Navigate to `http://localhost:5173/admin`
2. **Expected**: Redirected to `/admin/login`
3. Enter admin email and password, submit
4. **Expected**: Redirected to `/admin` dashboard with project count, message count, unread count
5. Click sign out
6. **Expected**: Redirected to `/admin/login`; navigating to `/admin` again redirects back to login

### V2: Public Home Page

1. Navigate to `http://localhost:5173/`
2. **Expected**: About Me section with profile image and bilingual text
3. **Expected**: Three featured project cards with cover images, titles, categories
4. **Expected**: Footer with contact info and social links
5. Switch language to Arabic
6. **Expected**: All text updates to Arabic; layout switches to RTL
7. Switch back to English
8. **Expected**: Layout returns to LTR; all text in English

### V3: Portfolio Grid & Filtering

1. Navigate to `/portfolio`
2. **Expected**: Responsive grid of all published projects
3. Select a category filter
4. **Expected**: Only projects in that category are displayed
5. Click a project card
6. **Expected**: Project detail page with bilingual title, description, cover, category, year, location, and photo gallery

### V4: Contact Form

1. Navigate to `/contact`
2. **Expected**: Heading, intro, three contact cards, and form displayed
3. Submit form with empty fields
4. **Expected**: Validation errors appear
5. Fill in valid name, email, message; submit
6. **Expected**: Success message displayed
7. Check admin dashboard → Messages
8. **Expected**: Submitted message appears with correct sender info and timestamp

### V5: Project Management

1. Log in as admin, navigate to `/admin/projects`
2. Click "New Project"
3. Fill in bilingual title, description, category, year, location
4. Upload cover image
5. Add gallery images with bilingual alt text
6. Set as draft, save
7. **Expected**: Project appears in list as draft
8. Visit `/portfolio` as public visitor
9. **Expected**: Draft project NOT visible
10. Go back to admin, publish the project
11. **Expected**: Project now visible on `/portfolio`

### V6: Featured Projects

1. As admin, navigate to `/admin/home`
2. Select three projects as featured
3. Reorder them
4. Save
5. Visit home page as public visitor
6. **Expected**: Three selected projects appear in the admin-defined order in "Selected Projects" section

### V7: Home Content Editing

1. As admin, navigate to `/admin/home`
2. Upload a new profile image
3. Edit About Me text in English and Arabic
4. Save
5. Visit home page as public visitor
6. **Expected**: New profile image and updated About Me text displayed

### V8: Contact & Footer Editing

1. As admin, navigate to `/admin/contact-footer`
2. Edit contact page heading, intro, and cards in both languages
3. Edit footer copy and social links
4. Save
5. Visit `/contact` and any page footer as public visitor
6. **Expected**: All updated content displayed correctly

### V9: Message Management

1. Submit a message via the contact form
2. As admin, navigate to `/admin/messages`
3. **Expected**: Message appears with unread indicator
4. Mark as read
5. **Expected**: Unread indicator cleared; unread count decreases
6. Delete the message
7. **Expected**: Message removed from list

### V10: Appearance / Color Tokens

1. As admin, navigate to `/admin/appearance`
2. Change the `accent` token value
3. Save
4. Visit any public page
5. **Expected**: Accent-colored elements reflect the new value
6. Attempt to rename a token
7. **Expected**: System prevents the rename

### V11: Responsive & Keyboard Navigation

1. Resize browser to 320px width
2. **Expected**: All pages reflow correctly; nav collapses; project grid becomes single column
3. Navigate entire public site using only keyboard (Tab, Enter, Escape)
4. **Expected**: All links, forms, language switcher, and gallery are fully operable
5. Navigate admin dashboard using only keyboard
6. **Expected**: All controls, forms, and modals are fully operable

### V12: RTL Layout

1. Switch to Arabic
2. **Expected**: All text right-aligned; navigation mirrors; gallery images flow RTL
3. Navigate through all pages
4. **Expected**: Consistent RTL layout across home, portfolio, project detail, contact, and admin

### V13: Production Build

```bash
npm run build
npm run preview
```

1. Open preview URL
2. **Expected**: All validation scenarios above pass in production build
3. **Expected**: No console errors; all images load; language switching works

### V14: Supabase RLS Verification

1. Open browser DevTools → Network tab
2. As public visitor, attempt to query `contact_messages` via Supabase client
3. **Expected**: Empty result or permission denied (no admin session)
4. As public visitor, attempt to update `projects` table
5. **Expected**: Permission denied
6. As admin, perform all CRUD operations
7. **Expected**: All operations succeed

---

## Success Criteria Checklist

- [ ] SC-001: Language switch updates all content within 1 second
- [ ] SC-002: Home page loads in under 3 seconds
- [ ] SC-003: Portfolio grid reflows at 320px, 768px, 1200px
- [ ] SC-004: Admin can create and publish a project in under 5 minutes
- [ ] SC-005: Contact form message appears in dashboard within 5 seconds
- [ ] SC-006: All interactive elements keyboard-accessible
- [ ] SC-007: All images have bilingual alt text
- [ ] SC-008: Spam submissions rejected; rate limiting active
- [ ] SC-009: Production build completes; all routes render correctly
- [ ] SC-010: Draft projects never visible on public pages
