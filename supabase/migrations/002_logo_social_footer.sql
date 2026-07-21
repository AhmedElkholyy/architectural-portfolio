-- Migration 002: Logo, social links, footer title, hero title columns

-- Logo settings (text or image)
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS logo_type text NOT NULL DEFAULT 'text';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS logo_text text NOT NULL DEFAULT 'AK';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS logo_image_url text;

-- Additional social links
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_social_facebook text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_social_whatsapp text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_social_behance text;

-- Footer title (bilingual)
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_title_en text NOT NULL DEFAULT 'Architectural Engineer';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_title_ar text NOT NULL DEFAULT 'مهندسة معمارية';
