-- Migration 005: Add elkholyk35@gmail.com as admin

-- site_settings
DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;
CREATE POLICY "Admin can update site settings" ON public.site_settings
  FOR UPDATE USING (auth.jwt() ->> 'email' IN ('ahmed.elkholy6480@gmail.com', 'elkholyk35@gmail.com'));

-- contact_page_settings
DROP POLICY IF EXISTS "Admin can update contact settings" ON public.contact_page_settings;
CREATE POLICY "Admin can update contact settings" ON public.contact_page_settings
  FOR UPDATE USING (auth.jwt() ->> 'email' IN ('ahmed.elkholy6480@gmail.com', 'elkholyk35@gmail.com'));

-- projects
DROP POLICY IF EXISTS "Admin can do everything with projects" ON public.projects;
CREATE POLICY "Admin can do everything with projects" ON public.projects
  FOR ALL USING (auth.jwt() ->> 'email' IN ('ahmed.elkholy6480@gmail.com', 'elkholyk35@gmail.com'));

-- project_images
DROP POLICY IF EXISTS "Admin can do everything with project images" ON public.project_images;
CREATE POLICY "Admin can do everything with project images" ON public.project_images
  FOR ALL USING (auth.jwt() ->> 'email' IN ('ahmed.elkholy6480@gmail.com', 'elkholyk35@gmail.com'));

-- contact_messages
DROP POLICY IF EXISTS "Admin can read contact messages" ON public.contact_messages;
CREATE POLICY "Admin can read contact messages" ON public.contact_messages
  FOR SELECT USING (auth.jwt() ->> 'email' IN ('ahmed.elkholy6480@gmail.com', 'elkholyk35@gmail.com'));

DROP POLICY IF EXISTS "Admin can update contact messages" ON public.contact_messages;
CREATE POLICY "Admin can update contact messages" ON public.contact_messages
  FOR UPDATE USING (auth.jwt() ->> 'email' IN ('ahmed.elkholy6480@gmail.com', 'elkholyk35@gmail.com'));

DROP POLICY IF EXISTS "Admin can delete contact messages" ON public.contact_messages;
CREATE POLICY "Admin can delete contact messages" ON public.contact_messages
  FOR DELETE USING (auth.jwt() ->> 'email' IN ('ahmed.elkholy6480@gmail.com', 'elkholyk35@gmail.com'));

-- storage
DROP POLICY IF EXISTS "Admin can upload profile images" ON storage.objects;
CREATE POLICY "Admin can upload profile images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile' AND auth.jwt() ->> 'email' IN ('ahmed.elkholy6480@gmail.com', 'elkholyk35@gmail.com'));

DROP POLICY IF EXISTS "Admin can delete profile images" ON storage.objects;
CREATE POLICY "Admin can delete profile images" ON storage.objects
  FOR DELETE USING (bucket_id = 'profile' AND auth.jwt() ->> 'email' IN ('ahmed.elkholy6480@gmail.com', 'elkholyk35@gmail.com'));

DROP POLICY IF EXISTS "Admin can upload project images" ON storage.objects;
CREATE POLICY "Admin can upload project images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.jwt() ->> 'email' IN ('ahmed.elkholy6480@gmail.com', 'elkholyk35@gmail.com'));

DROP POLICY IF EXISTS "Admin can delete project images" ON storage.objects;
CREATE POLICY "Admin can delete project images" ON storage.objects
  FOR DELETE USING (bucket_id = 'projects' AND auth.jwt() ->> 'email' IN ('ahmed.elkholy6480@gmail.com', 'elkholyk35@gmail.com'));
