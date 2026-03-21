import { createClient } from '../../../../../lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import ArtworkDetailClient from '../../../../../components/ArtworkDetailClient'
import {
  isArtworkImagesQueryError,
  normalizeArtwork,
  type ArtworkRecord,
} from '../../../../../lib/artworks'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { id } = await params
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
      published,
      artwork_images (
        id,
        artwork_id,
        image_url,
        sort_order,
        created_at
      )
    `)
    .eq('id', id)
    .eq('published', true)
    .single()

  let artwork = initialQuery.data as ArtworkRecord | null
  let error = initialQuery.error

  if (error && isArtworkImagesQueryError(error)) {
    const fallbackQuery = await supabase
      .from('artworks')
      .select('id, title, description, image_url, created_at, medium, dimensions, year, tags, is_featured, published')
      .eq('id', id)
      .eq('published', true)
      .single()

    artwork = fallbackQuery.data as ArtworkRecord | null
    error = fallbackQuery.error
  }

  if (error || !artwork) {
    notFound()
  }

  const normalizedArtwork = normalizeArtwork(artwork as ArtworkRecord)

  return (
    <section className="site-section">
      <div className="site-container">
        <article className="artwork-detail-page">
          <header className="artwork-detail-header">
            <div>
              <span className="eyebrow">Artwork</span>
              <h1>{normalizedArtwork.title}</h1>
            </div>

            <div className="artwork-detail-header-meta">
              <span>Created {format(new Date(normalizedArtwork.created_at), 'MMMM d, yyyy')}</span>
              {normalizedArtwork.year ? <span>{normalizedArtwork.year}</span> : null}
              <span>{normalizedArtwork.image_count} image{normalizedArtwork.image_count === 1 ? '' : 's'}</span>
            </div>
          </header>

          <ArtworkDetailClient artwork={normalizedArtwork} />
        </article>
      </div>
    </section>
  )
}
