# UI Contracts: Portfolio Content System

**Feature**: `001-portfolio-cms-i18n`
**Date**: 2026-07-19

## Component Contracts

### Navigation Component

**Props**: None (fetches own data via hooks)
**Behavior**:
- Renders brand link, nav links (Home, Portfolio, Contact), language switcher
- On mobile (≤760px): renders hamburger menu button
- Hamburger menu: slide-in panel with nav links + language switcher
- Closes on: route change, Escape key, backdrop click

**State**:
- `isMenuOpen: boolean` — mobile menu visibility

### LanguageSwitcher Component

**Props**: None
**Behavior**:
- Toggles between "English" and "العربية"
- Calls `i18n.changeLanguage()` on toggle
- Updates `document.documentElement.dir` and `lang`
- Persists to `localStorage`

### Footer Component

**Props**: None
**Behavior**:
- Fetches `site_settings` via `useSiteSettings()` hook
- Renders heading (bilingual from `settings.heading_en/ar`)
- Renders social links (email, GitHub, LinkedIn, Instagram)
- Renders copyright text (bilingual from `settings.footer_copy_en/ar`)
- Falls back to hardcoded defaults if settings not loaded

### ContactForm Component

**Props**: None
**Behavior**:
- Renders form with: name, email, message fields + submit button
- Includes honeypot field (`_website`) for spam protection
- Validates: all fields required, email format validation
- On submit: inserts into `contact_messages` table via Supabase client
- Shows success/error state after submission
- Clears form on success

### ProjectCard Component

**Props**:
```typescript
{
  project: {
    id: string;
    title_en: string;
    title_ar?: string;
    cover_image_url?: string;
    category: string;
    location?: string;
    year?: number;
  }
}
```

**Behavior**:
- Renders project card with cover image, title (bilingual), category, location, year
- Links to `/project/:id`
- Uses current language for title display

### ProjectDetail Page

**Props**: `useParams()` → `{ id: string }`
**Behavior**:
- Fetches project by ID from Supabase
- Renders: title (bilingual), description (bilingual), metadata (category, year, location)
- Renders gallery: grid of images from `project_images` table
- Click thumbnail → lightbox modal with full image
- Handles: project not found (404), loading state, empty gallery

### Admin Pages

**HomeContent**:
- Fetches `site_settings` singleton
- Form fields: profile image upload, about_en, about_ar
- Featured projects: list of projects with toggle/checkbox for featured_position (1-3)
- Enforces max 3 featured projects

**ProjectEditor**:
- Creates/edits projects with bilingual fields
- Cover image upload with compression
- Gallery image upload with compression, reorder, delete
- Validates: title_en required, image size limits

**Messages**:
- Fetches all `contact_messages` ordered by `created_at` desc
- Displays: sender name, email, message, timestamp, read status
- Toggle read/unread, delete messages

**ContactFooter**:
- Fetches `contact_page_settings` and `site_settings`
- Form fields: heading_en/ar, intro_en/ar, email, phone, location_en/ar, footer_copy_en/ar, social links

**Appearance**:
- Fetches `site_settings.color_tokens` JSONB
- Form fields for each color token (color picker inputs)
- Saves updated tokens back to Supabase

## Supabase Client Contracts

### useSiteSettings Hook

**Returns**:
```typescript
{
  settings: SiteSettings | null;
  loading: boolean;
  error: Error | null;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>;
}
```

### useContactSettings Hook

**Returns**:
```typescript
{
  settings: ContactSettings | null;
  loading: boolean;
  error: Error | null;
  updateSettings: (updates: Partial<ContactSettings>) => Promise<void>;
}
```

### useProjects Hook

**Parameters**:
```typescript
{
  featuredOnly?: boolean;
  publishedOnly?: boolean;
  limit?: number;
}
```

**Returns**:
```typescript
{
  projects: Project[];
  loading: boolean;
  error: Error | null;
}
```

### useColorTokens Hook

**Returns**:
```typescript
{
  tokens: ColorTokens;
  loading: boolean;
}
```

**Behavior**: Fetches `color_tokens` JSONB from `site_settings`, applies each key as CSS custom property on `<html>` element.
