'use client'

import Link from 'next/link'
import { format } from 'date-fns'

interface Artwork {
  id: string
  title: string
  description?: string | null
  cover_image_url?: string
  created_at: string
  year?: number | null
  medium?: string | null
  image_count?: number
  is_featured?: boolean | null
}

interface ArtworkCardProps {
  artwork: Artwork
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <article className="soft-card artwork-grid-card">
      <Link href={`/artworks/${artwork.id}`} className="artwork-grid-card-link">
        <div
          className="artwork-grid-card-media"
          style={{
            backgroundImage: artwork.cover_image_url
              ? `url(${artwork.cover_image_url})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!artwork.cover_image_url ? <span>Artwork preview</span> : null}
          <div className="artwork-grid-card-badges">
            {artwork.is_featured ? <span className="artwork-badge">Featured</span> : null}
            {(artwork.image_count ?? 0) > 1 ? (
              <span className="artwork-badge">{artwork.image_count} images</span>
            ) : null}
          </div>
        </div>

        <div className="artwork-grid-card-body">
          <div className="list-card-meta">
            <time>{format(new Date(artwork.created_at), 'MMM dd, yyyy')}</time>
            {artwork.year ? <span>{artwork.year}</span> : null}
          </div>

          <h2>{artwork.title}</h2>

          {artwork.medium ? <h3>{artwork.medium}</h3> : null}

          {artwork.description ? <p>{artwork.description}</p> : null}

          <div className="list-card-footer">
            <span>View artwork</span>
            <span aria-hidden="true">→</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
