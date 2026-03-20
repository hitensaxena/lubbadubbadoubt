-- Updates for the 'posts' table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Updates for the 'artworks' table
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS medium text;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS dimensions text;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS year integer;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
