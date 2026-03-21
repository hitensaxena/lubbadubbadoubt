-- Updates for the 'posts' table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Updates for the 'artworks' table
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS medium text;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS dimensions text;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS year integer;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Multi-image support for artworks
CREATE TABLE IF NOT EXISTS artwork_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id uuid NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_artwork_images_artwork_id
  ON artwork_images (artwork_id);

CREATE INDEX IF NOT EXISTS idx_artwork_images_artwork_sort
  ON artwork_images (artwork_id, sort_order);

ALTER TABLE artwork_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view artwork images for published artworks" ON artwork_images;
DROP POLICY IF EXISTS "Admins can insert artwork images" ON artwork_images;
DROP POLICY IF EXISTS "Admins can update artwork images" ON artwork_images;
DROP POLICY IF EXISTS "Admins can delete artwork images" ON artwork_images;
DROP POLICY IF EXISTS "Admins can view all artwork images" ON artwork_images;

CREATE POLICY "Public can view artwork images for published artworks" ON artwork_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM artworks
      WHERE artworks.id = artwork_images.artwork_id
        AND artworks.published = true
    )
  );

CREATE POLICY "Admins can insert artwork images" ON artwork_images
  FOR INSERT WITH CHECK (auth.email() IN (SELECT email FROM admins));

CREATE POLICY "Admins can update artwork images" ON artwork_images
  FOR UPDATE USING (auth.email() IN (SELECT email FROM admins));

CREATE POLICY "Admins can delete artwork images" ON artwork_images
  FOR DELETE USING (auth.email() IN (SELECT email FROM admins));

CREATE POLICY "Admins can view all artwork images" ON artwork_images
  FOR SELECT USING (auth.email() IN (SELECT email FROM admins));

INSERT INTO artwork_images (artwork_id, image_url, sort_order, created_at)
SELECT artworks.id, artworks.image_url, 0, artworks.created_at
FROM artworks
WHERE artworks.image_url IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM artwork_images
    WHERE artwork_images.artwork_id = artworks.id
  );
