# Data Model: Portfolio Content System

**Feature**: `001-portfolio-cms-i18n`
**Date**: 2026-07-19

## Entity Relationship Diagram

```
┌─────────────────────┐       ┌─────────────────────┐
│   site_settings     │       │ contact_page_settings│
│   (singleton, id=1) │       │   (singleton, id=1)  │
├─────────────────────┤       ├─────────────────────┤
│ profile_image_url   │       │ heading_en          │
│ about_en            │       │ heading_ar          │
│ about_ar            │       │ intro_en            │
│ footer_copy_en      │       │ intro_ar            │
│ footer_copy_ar      │       │ email               │
│ footer_email        │       │ phone               │
│ footer_social_github│       │ location_en         │
│ footer_social_linkedin│     │ location_ar         │
│ footer_social_instagram│    └─────────────────────┘
│ color_tokens (JSONB)│
└─────────────────────┘
           │
           │ (referenced by components)
           ▼
┌─────────────────────┐       ┌─────────────────────┐
│      projects       │       │   project_images    │
├─────────────────────┤       ├─────────────────────┤
│ id (PK, uuid)       │──┐    │ id (PK, uuid)       │
│ title_en            │  │    │ project_id (FK)     │
│ title_ar            │  │    │ image_url           │
│ description_en      │  │    │ alt_en              │
│ description_ar      │  │    │ alt_ar              │
│ category            │  └───▶│ display_order       │
│ location            │       └─────────────────────┘
│ year                │
│ cover_image_url     │
│ featured_position   │  (1-3, unique, nullable)
│ published           │  (boolean)
└─────────────────────┘
           │
           │ (contact form submissions)
           ▼
┌─────────────────────┐
│  contact_messages   │
├─────────────────────┤
│ id (PK, uuid)       │
│ sender_name         │
│ sender_email        │
│ message             │
│ is_read             │  (boolean, default false)
│ created_at          │  (timestamptz)
└─────────────────────┘
```

## Entity Details

### site_settings (Singleton)

Global site configuration. Single row with `id = 1`.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | int | PK, default 1 | Singleton identifier |
| `profile_image_url` | text | nullable | URL to profile photo in Supabase Storage |
| `about_en` | text | nullable | About paragraph (English) |
| `about_ar` | text | nullable | About paragraph (Arabic) |
| `footer_copy_en` | text | nullable | Footer copyright text (English) |
| `footer_copy_ar` | text | nullable | Footer copyright text (Arabic) |
| `footer_email` | text | nullable | Footer contact email |
| `footer_social_github` | text | nullable | GitHub profile URL |
| `footer_social_linkedin` | text | nullable | LinkedIn profile URL |
| `footer_social_instagram` | text | nullable | Instagram profile URL |
| `color_tokens` | jsonb | default `'{}'` | Dynamic color overrides |

**color_tokens JSONB schema**:
```json
{
  "background": "#edece6",
  "surface": "#d8d4c9",
  "textPrimary": "#1d211e",
  "textMuted": "#5d625d",
  "accent": "#bc4e32",
  "border": "rgba(29, 33, 30, 0.2)",
  "danger": "#9b3925"
}
```

### contact_page_settings (Singleton)

Contact page configuration. Single row with `id = 1`.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | int | PK, default 1 | Singleton identifier |
| `heading_en` | text | nullable | Page heading (English) |
| `heading_ar` | text | nullable | Page heading (Arabic) |
| `intro_en` | text | nullable | Intro paragraph (English) |
| `intro_ar` | text | nullable | Intro paragraph (Arabic) |
| `email` | text | nullable | Contact email |
| `phone` | text | nullable | Contact phone |
| `location_en` | text | nullable | Location text (English) |
| `location_ar` | text | nullable | Location text (Arabic) |

### projects

Individual architectural projects.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | uuid | PK, default gen_random_uuid() | Unique identifier |
| `title_en` | text | not null | Project title (English) |
| `title_ar` | text | nullable | Project title (Arabic) |
| `description_en` | text | nullable | Description (English) |
| `description_ar` | text | nullable | Description (Arabic) |
| `category` | text | not null | Project category |
| `location` | text | nullable | Project location |
| `year` | int | nullable | Project year |
| `cover_image_url` | text | nullable | Cover image URL |
| `featured_position` | int | unique, nullable | 1-3 for featured, null for non-featured |
| `published` | boolean | default false | Whether visible on public site |

**Validation rules**:
- `featured_position` must be 1, 2, or 3 if not null
- Maximum 3 rows with non-null `featured_position` (app-level enforcement)
- When a project is deleted, its `featured_position` is automatically cleared (cascade or trigger)

### project_images

Gallery images belonging to a project.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | uuid | PK, default gen_random_uuid() | Unique identifier |
| `project_id` | uuid | FK → projects.id, on delete cascade | Parent project |
| `image_url` | text | not null | Image URL in Supabase Storage |
| `alt_en` | text | nullable | Alt text (English) |
| `alt_ar` | text | nullable | Alt text (Arabic) |
| `display_order` | int | default 0 | Sort order within gallery |

### contact_messages

Visitor-submitted contact form messages.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | uuid | PK, default gen_random_uuid() | Unique identifier |
| `sender_name` | text | not null | Visitor's name |
| `sender_email` | text | not null | Visitor's email |
| `message` | text | not null | Message body |
| `is_read` | boolean | default false | Admin read status |
| `created_at` | timestamptz | default now() | Submission timestamp |

## RLS Policies

| Table | Operation | Policy |
|-------|-----------|--------|
| `site_settings` | SELECT | Public (anyone can read) |
| `site_settings` | UPDATE | Admin only (via `app.admin_email` setting) |
| `contact_page_settings` | SELECT | Public |
| `contact_page_settings` | UPDATE | Admin only |
| `projects` | SELECT | Public (where `published = true`) |
| `projects` | INSERT/UPDATE/DELETE | Admin only |
| `project_images` | SELECT | Public (only for published projects via JOIN) |
| `project_images` | INSERT/UPDATE/DELETE | Admin only |
| `contact_messages` | INSERT | Public (anyone can submit) |
| `contact_messages` | SELECT/UPDATE/DELETE | Admin only |
| `storage.objects` | SELECT | Public on `profile` and `projects` buckets |
| `storage.objects` | INSERT/DELETE | Admin only |

## State Transitions

### Project Lifecycle
```
[draft] → published=true → [published]
[published] → published=false → [draft]
[published] → DELETE → [deleted]
```

### Featured Position
```
[not featured] → featured_position=1/2/3 → [featured]
[featured] → featured_position=null → [not featured]
[featured] → DELETE project → [not featured] (auto-cleanup)
```

### Contact Message
```
[submitted] → is_read=false → [unread]
[unread] → is_read=true → [read]
[read/unread] → DELETE → [deleted]
```
