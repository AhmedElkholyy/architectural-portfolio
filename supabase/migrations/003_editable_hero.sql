-- Migration 003: Editable hero title/subtitle in site_settings

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_title_en text NOT NULL DEFAULT 'Spaces that';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_title_ar text NOT NULL DEFAULT 'مساحات تحمل';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_subtitle_en text NOT NULL DEFAULT 'hold a feeling.';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_subtitle_ar text NOT NULL DEFAULT 'شعوراً.';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_text_en text NOT NULL DEFAULT 'Thoughtful architecture shaped by light, material, and the rituals of everyday life.';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_text_ar text NOT NULL DEFAULT 'عمارة مدروسة تشكلها الضوء والمواد وطقوس الحياة اليومية.';
