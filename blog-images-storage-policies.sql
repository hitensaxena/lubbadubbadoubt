-- Storage policies for blog-images bucket
-- Run this script in your Supabase SQL editor to enable blog image uploads
-- Note: These policies should be created through the Supabase Dashboard > Storage > Policies
-- or using the Supabase CLI/API, not direct SQL on storage.objects

-- Create storage bucket policies using Supabase's storage API:
-- 1. Go to Supabase Dashboard > Storage > blog-images bucket > Policies
-- 2. Create the following policies:

-- Policy 1: "Admins can upload to blog-images bucket"
-- Operation: INSERT
-- Target roles: authenticated
-- Policy definition:
-- bucket_id = 'blog-images' AND auth.email() IN (SELECT email FROM public.admins)

-- Policy 2: "Public can view blog images"
-- Operation: SELECT  
-- Target roles: public
-- Policy definition:
-- bucket_id = 'blog-images'

-- Policy 3: "Admins can update blog images"
-- Operation: UPDATE
-- Target roles: authenticated
-- Policy definition:
-- bucket_id = 'blog-images' AND auth.email() IN (SELECT email FROM public.admins)

-- Policy 4: "Admins can delete blog images"
-- Operation: DELETE
-- Target roles: authenticated
-- Policy definition:
-- bucket_id = 'blog-images' AND auth.email() IN (SELECT email FROM public.admins)

-- Alternative: Use Supabase JavaScript client to create policies
-- const { data, error } = await supabase.storage.createPolicy({
--   bucketId: 'blog-images',
--   policy: 'INSERT',
--   definition: "bucket_id = 'blog-images' AND auth.email() IN (SELECT email FROM public.admins)"
-- });

-- SQL policies for storage.objects table (if creating via SQL editor):
CREATE POLICY "Admins can upload to blog-images bucket" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'blog-images' AND 
    auth.email() IN (SELECT email FROM public.admins)
  );

CREATE POLICY "Public can view blog images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can update blog images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'blog-images' AND 
    auth.email() IN (SELECT email FROM public.admins)
  );

CREATE POLICY "Admins can delete blog images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'blog-images' AND 
    auth.email() IN (SELECT email FROM public.admins)
  );

-- Note: You need to create the 'blog-images' bucket manually in the Supabase dashboard
-- or run: INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);