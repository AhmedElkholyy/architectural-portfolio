# UI Contracts: Admin Dashboard Data Flow

**Feature**: 001-portfolio-cms
**Date**: 2026-07-18

This document defines the data contracts between the admin dashboard pages and the Supabase database. All queries use the authenticated admin session.

---

## Contract A1: Admin Authentication

**Trigger**: Admin navigates to any `/admin/*` route

**Queries executed**:
1. `supabase.auth.getSession()` → check for valid session

**Response**:

```json
{
  "session": {
    "access_token": "string",
    "user": { "id": "uuid", "email": "string" }
  } | null
}
```

**Behavior**: If session is null, redirect to `/admin/login`. If session exists, proceed to dashboard.

---

## Contract A2: Dashboard Overview

**Trigger**: Admin navigates to `/admin`

**Queries executed**:
1. `projects` → COUNT (all projects, admin sees all)
2. `contact_messages` → COUNT (all messages)
3. `contact_messages` → COUNT where `is_read = false` (unread)

**Response shape**:

```json
{
  "project_count": "number",
  "message_count": "number",
  "unread_count": "number"
}
```

---

## Contract A3: Home Content Read

**Trigger**: Admin navigates to `/admin/home`

**Queries executed**:
1. `site_settings` → singleton row (id = 1)
2. `projects` → all published projects (for featured project picker)

**Response shape**: Same as public Contract 1, plus full project list for selection.

---

## Contract A4: Home Content Update

**Trigger**: Admin saves home content changes

**Mutations**:
1. `site_settings` → UPDATE (id = 1)
2. Storage: `profile` bucket → upload/delete profile image

**Request shape**:

```json
{
  "about_en": "string",
  "about_ar": "string",
  "profile_image": "File | null (upload)",
  "featured_project_ids": ["number", "number", "number"]
}
```

**Featured project logic**:
- Set `featured_position` on selected projects (1, 2, 3).
- Clear `featured_position` on previously featured projects not in the new list.
- Maximum 3 featured projects enforced client-side and server-side.

---

## Contract A5: Project List

**Trigger**: Admin navigates to `/admin/projects`

**Queries executed**:
1. `projects` → all projects (admin sees drafts + published), ordered by `created_at` desc

**Response shape**:

```json
[
  {
    "id": "number",
    "title_en": "string",
    "title_ar": "string",
    "category": "string",
    "published": "boolean",
    "cover_image_url": "string | null",
    "featured_position": "number | null",
    "created_at": "string (ISO)"
  }
]
```

---

## Contract A6: Project Create/Update

**Trigger**: Admin creates or edits a project at `/admin/projects/new` or `/admin/projects/:id`

**Mutations**:
1. `projects` → INSERT or UPDATE
2. Storage: `projects` bucket → upload cover and gallery images

**Request shape**:

```json
{
  "title_en": "string",
  "title_ar": "string",
  "description_en": "string",
  "description_ar": "string",
  "category": "string",
  "location": "string | null",
  "year": "number | null",
  "cover_image": "File | null (upload)",
  "published": "boolean",
  "gallery_images": [
    {
      "id": "number | null (null = new)",
      "image": "File | null (upload for new)",
      "image_url": "string | null (existing)",
      "alt_en": "string",
      "alt_ar": "string",
      "display_order": "number"
    }
  ]
}
```

**Validation**:
- `title_en` and `title_ar` required.
- `cover_image_url` required if `published = true`.
- Gallery `alt_en` and `alt_ar` required for each image.

---

## Contract A7: Project Delete

**Trigger**: Admin deletes a project from `/admin/projects`

**Mutations**:
1. `project_images` → DELETE WHERE `project_id = :id` (cascade)
2. `projects` → DELETE WHERE `id = :id`
3. Storage: delete associated images from `projects` bucket

**Behavior**: If project was featured, `featured_position` is cleared automatically (via ON DELETE cascade or application logic).

---

## Contract A8: Message List

**Trigger**: Admin navigates to `/admin/messages`

**Queries executed**:
1. `contact_messages` → all messages, ordered by `created_at` desc

**Response shape**:

```json
[
  {
    "id": "number",
    "sender_name": "string",
    "sender_email": "string",
    "message": "string",
    "is_read": "boolean",
    "created_at": "string (ISO)"
  }
]
```

---

## Contract A9: Message Actions

**Trigger**: Admin marks read/unread or deletes a message

**Mutations**:
- Mark read/unread: `contact_messages` → UPDATE `is_read` WHERE `id = :id`
- Delete: `contact_messages` → DELETE WHERE `id = :id`

---

## Contract A10: Contact & Footer Content Read/Update

**Trigger**: Admin navigates to `/admin/contact-footer`

**Queries executed**:
1. `contact_page_settings` → singleton row (id = 1)
2. `site_settings` → footer fields

**Update mutation**: UPDATE on both tables with new bilingual values.

---

## Contract A11: Appearance (Color Tokens) Read/Update

**Trigger**: Admin navigates to `/admin/appearance`

**Queries executed**:
1. `site_settings` → `color_tokens` JSON field

**Update mutation**: UPDATE `site_settings` SET `color_tokens = :new_value` WHERE `id = 1`

**Token structure**:

```json
{
  "background": "#edece6",
  "surface": "#d8d4c9",
  "textPrimary": "#1d211e",
  "textMuted": "#5d625d",
  "accent": "#bc4e32",
  "border": "rgba(29,33,30,0.2)",
  "danger": "#9b3925"
}
```

**Constraint**: Token names are fixed. Only values can be changed. The dashboard prevents renaming keys.
