import { createClient } from '../../../../lib/supabase/server'
import ArtworkCard from '../../../../components/ArtworkCard'

interface Artwork {
  id: string
  title: string
  image_url?: string
  description?: string
  created_at: string
}

export default async function ArtworksPage() {
  const supabase = await createClient()

  const { data: artworks, error } = await supabase
    .from('artworks')
    .select('id, title, image_url, description, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching artworks:', error)

    return (
      <section className="site-section">
        <div className="site-container">
          <div className="glass-panel error-state">
            <h1 style={{ color: 'var(--md-sys-color-error)', marginBottom: '0.75rem' }}>
              Error loading artworks
            </h1>
            <p>Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="site-section">
      <div className="site-container">
        <div className="glass-panel page-hero">
          <span className="eyebrow">Artwork</span>
          <h1>Visual work presented with more breathing room.</h1>
          <p>
            A gallery for illustrations, digital pieces, and visual explorations with a
            cleaner frame and a warmer, more intentional color story.
          </p>
        </div>

        {artworks && artworks.length > 0 ? (
          <div className="list-grid">
            {artworks.map((artwork: Artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={{
                  id: artwork.id,
                  title: artwork.title,
                  image_url: artwork.image_url,
                  description: artwork.description,
                  created_at: artwork.created_at,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel empty-state">
            <h2 style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '0.75rem' }}>
              No artworks yet
            </h2>
            <p>Check back soon for new visual work.</p>
          </div>
        )}
      </div>
    </section>
  )
}
