# UI Contracts: Public Site Data Flow

**Feature**: 001-portfolio-cms
**Date**: 2026-07-18

This document defines the data contracts between the public-facing pages and the Supabase database. All queries use the Supabase JS client with the anon key (RLS-enforced).

---

## Contract 1: Home Page Load

**Trigger**: Visitor navigates to `/` (home page)

**Queries executed**:
1. `site_settings` → singleton row (id = 1)
2. `projects` → featured projects (`featured_position IS NOT NULL AND published = true`, ordered by `featured_position`)

**Response shapes**:

```json
// site_settings
{
  "profile_image_url": "string | null",
  "about_en": "string",
  "about_ar": "string",
  "footer_copy_en": "string",
  "footer_copy_ar": "string",
  "footer_email": "string",
  "footer_social_github": "string | null",
  "footer_social_linkedin": "string | null",
  "footer_social_instagram": "string | null"
}

// featured_projects
[
  {
    "id": "number",
    "title_en": "string",
    "title_ar": "string",
    "category": "string",
    "cover_image_url": "string | null",
    "featured_position": "number"
  }
]
```

**Error handling**: Show skeleton/loading state. If Supabase is unreachable, show fallback static content.

---

## Contract 2: Portfolio Grid Load

**Trigger**: Visitor navigates to `/portfolio`

**Queries executed**:
1. `projects` → all published projects (`published = true`, ordered by `created_at` desc)
2. `projects` → distinct categories (for filter UI)

**Response shape**:

```json
// projects
[
  {
    "id": "number",
    "title_en": "string",
    "title_ar": "string",
    "category": "string",
    "cover_image_url": "string | null",
    "year": "number | null",
    "location": "string | null"
  }
]

// categories (derived from projects)
["Residential", "Workplace", "Hospitality"]
```

**Filtering**: Client-side category filter. No additional query needed; filter from loaded data.

---

## Contract 3: Project Detail Load

**Trigger**: Visitor navigates to `/project/:id`

**Queries executed**:
1. `projects` → single project (`id = :id AND published = true`)
2. `project_images` → gallery images (`project_id = :id`, ordered by `display_order`)

**Response shapes**:

```json
// project
{
  "id": "number",
  "title_en": "string",
  "title_ar": "string",
  "description_en": "string",
  "description_ar": "string",
  "category": "string",
  "location": "string | null",
  "year": "number | null",
  "cover_image_url": "string | null"
}

// gallery_images
[
  {
    "id": "number",
    "image_url": "string",
    "alt_en": "string",
    "alt_ar": "string",
    "display_order": "number"
  }
]
```

**Error handling**: If project not found or not published, show 404 page.

---

## Contract 4: Contact Page Load

**Trigger**: Visitor navigates to `/contact`

**Queries executed**:
1. `contact_page_settings` → singleton row (id = 1)

**Response shape**:

```json
{
  "heading_en": "string",
  "heading_ar": "string",
  "intro_en": "string",
  "intro_ar": "string",
  "email": "string",
  "phone": "string",
  "location_en": "string",
  "location_ar": "string"
}
```

---

## Contract 5: Contact Form Submission

**Trigger**: Visitor submits contact form on `/contact`

**Mutation**:
1. `contact_messages` → INSERT

**Request shape**:

```json
{
  "sender_name": "string (2–120 chars)",
  "sender_email": "string (valid email, max 254 chars)",
  "message": "string (10–3000 chars)"
}
```

**Response**:
- Success: `{ "data": { "id": "number" }, "error": null }`
- Validation error: `{ "data": null, "error": { "message": "string" } }`
- Rate limit: `{ "data": null, "error": { "message": "Too many submissions. Please try again later." } }`

**Honeypot**: Hidden field `_website` must be empty; if filled, silently discard submission.

---

## Contract 6: Footer Data

**Trigger**: Any page load (footer is global)

**Queries executed**: Same as Contract 1 (site_settings singleton)

**Footer-specific fields**:
- `footer_copy_en` / `footer_copy_ar`
- `footer_email`
- `footer_social_github`
- `footer_social_linkedin`
- `footer_social_instagram`
