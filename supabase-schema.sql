-- Create tables
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  excerpt text,
  content_md text NOT NULL,
  content_html text,
  featured_image text,
  published boolean DEFAULT false,
  published_at timestamptz,
  read_time_minutes int,
  views int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE artworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Posts RLS policies
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can insert posts" ON posts
  FOR INSERT WITH CHECK (auth.email() IN (SELECT email FROM admins));

CREATE POLICY "Admins can update posts" ON posts
  FOR UPDATE USING (auth.email() IN (SELECT email FROM admins));

CREATE POLICY "Admins can delete posts" ON posts
  FOR DELETE USING (auth.email() IN (SELECT email FROM admins));

CREATE POLICY "Admins can view all posts" ON posts
  FOR SELECT USING (auth.email() IN (SELECT email FROM admins));

-- Artworks RLS policies
CREATE POLICY "Public can view published artworks" ON artworks
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can insert artworks" ON artworks
  FOR INSERT WITH CHECK (auth.email() IN (SELECT email FROM admins));

CREATE POLICY "Admins can update artworks" ON artworks
  FOR UPDATE USING (auth.email() IN (SELECT email FROM admins));

CREATE POLICY "Admins can delete artworks" ON artworks
  FOR DELETE USING (auth.email() IN (SELECT email FROM admins));

CREATE POLICY "Admins can view all artworks" ON artworks
  FOR SELECT USING (auth.email() IN (SELECT email FROM admins));

-- Admins RLS policies
CREATE POLICY "Admins can only see their own record" ON admins
  FOR SELECT USING (auth.email() = email);

CREATE POLICY "Admins can only update their own record" ON admins
  FOR UPDATE USING (auth.email() = email);

-- Storage policies for artworks bucket
CREATE POLICY "Admins can upload to artworks bucket" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'artworks' AND 
    auth.email() IN (SELECT email FROM admins)
  );

CREATE POLICY "Public can view artworks" ON storage.objects
  FOR SELECT USING (bucket_id = 'artworks');

CREATE POLICY "Admins can update artworks" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'artworks' AND 
    auth.email() IN (SELECT email FROM admins)
  );

CREATE POLICY "Admins can delete artworks" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'artworks' AND 
    auth.email() IN (SELECT email FROM admins)
  );

-- Insert admin email
INSERT INTO admins (email) VALUES ('developerhiten@gmail.com');