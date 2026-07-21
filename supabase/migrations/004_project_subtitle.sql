-- Migration 004: Add subtitle to projects, add title/subtitle/paragraph to gallery images

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS subtitle_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS subtitle_ar text NOT NULL DEFAULT '';

ALTER TABLE public.project_images
  ADD COLUMN IF NOT EXISTS title_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS title_ar text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS subtitle_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS subtitle_ar text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS paragraph_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS paragraph_ar text NOT NULL DEFAULT '';
