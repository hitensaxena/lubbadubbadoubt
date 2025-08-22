-- Storage policies for artworks bucket
-- Run this script in your Supabase SQL editor to enable artwork uploads
-- Note: These policies should be created through the Supabase Dashboard > Storage > Policies
-- or using the Supabase CLI/API, not direct SQL on storage.objects

-- Create storage bucket policies using Supabase's storage API:
-- 1. Go to Supabase Dashboard > Storage > artworks bucket > Policies
-- 2. Create the following policies:

-- Policy 1: "Admins can upload to artworks bucket"
-- Operation: INSERT
-- Target roles: authenticated
-- Policy definition:
-- bucket_id = 'artworks' AND auth.email() IN (SELECT email FROM public.admins)

-- Policy 2: "Public can view artworks"
-- Operation: SELECT  
-- Target roles: public
-- Policy definition:
-- bucket_id = 'artworks'

-- Policy 3: "Admins can update artworks"
-- Operation: UPDATE
-- Target roles: authenticated
-- Policy definition:
-- bucket_id = 'artworks' AND auth.email() IN (SELECT email FROM public.admins)

-- Policy 4: "Admins can delete artworks"
-- Operation: DELETE
-- Target roles: authenticated
-- Policy definition:
-- bucket_id = 'artworks' AND auth.email() IN (SELECT email FROM public.admins)

-- Alternative: Use Supabase JavaScript client to create policies
-- const { data, error } = await supabase.storage.createPolicy({
--   bucketId: 'artworks',
--   policy: 'INSERT',
--   definition: "bucket_id = 'artworks' AND auth.email() IN (SELECT email FROM public.admins)"
-- });

-- Create the artworks bucket if it doesn't exist
-- Note: You may need to create this bucket manually in the Supabase dashboard
-- or run: INSERT INTO storage.buckets (id, name, public) VALUES ('artworks', 'artworks', true);