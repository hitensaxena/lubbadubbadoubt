import { createClient } from '../../../../lib/supabase/server'
import ArtworkGalleryClient from '../../../../components/ArtworkGalleryClient'
import {
  isArtworkImagesQueryError,
  normalizeArtworks,
  type ArtworkRecord,
} from '../../../../lib/artworks'

export default async function ArtworksPage() {
  const supabase = await createClient()

  const initialQuery = await supabase
    .from('artworks')
    .select(`
      id,
      title,
      description,
      image_url,
      created_at,
      medium,
      dimensions,
      year,
      tags,
      is_featured,
      artwork_images (
        id,
        artwork_id,
        image_url,
        sort_order,
        created_at
      )
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })

  let artworks = initialQuery.data as ArtworkRecord[] | null
  let error = initialQuery.error

  if (error && isArtworkImagesQueryError(error)) {
    const fallbackQuery = await supabase
      .from('artworks')
      .select('id, title, description, image_url, created_at, medium, dimensions, year, tags, is_featured')
      .eq('published', true)
      .order('created_at', { ascending: false })

    artworks = fallbackQuery.data as ArtworkRecord[] | null
    error = fallbackQuery.error
  }

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

  const galleryArtworks = normalizeArtworks(artworks as ArtworkRecord[])

  return (
    <section className="site-section">
      <div className="site-container">
        <div className="glass-panel page-hero artwork-page-hero">
          <span className="eyebrow">Artwork gallery</span>
          <h1>Browse the collection as a gallery, not a list.</h1>
          <p>
            Explore finished pieces, multiple-image artwork sets, and a more immersive
            3D browsing mode built for visual work.
          </p>
        </div>

        {galleryArtworks.length > 0 ? (
          <ArtworkGalleryClient artworks={galleryArtworks} />
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
