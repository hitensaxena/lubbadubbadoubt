'use client'

import Link from 'next/link'
import { format } from 'date-fns'

interface Artwork {
  id: string
  title: string
  description?: string
  image_url?: string
  created_at: string
}

interface ArtworkCardProps {
  artwork: Artwork
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <article className="soft-card list-card">
      <Link href={`/artworks/${artwork.id}`}>
        <div
          className="list-card-media"
          style={{
            minHeight: '320px',
            backgroundImage: artwork.image_url ? `url(${artwork.image_url})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: artwork.image_url ? undefined : 'grid',
            placeItems: artwork.image_url ? undefined : 'center',
            color: artwork.image_url ? undefined : 'var(--md-sys-color-primary)',
            fontWeight: artwork.image_url ? undefined : 600,
          }}
        >
          {!artwork.image_url ? 'Artwork preview' : null}
        </div>

        <div className="list-card-body">
          <div className="list-card-meta">
            <time>{format(new Date(artwork.created_at), 'MMM dd, yyyy')}</time>
            <span>Artwork</span>
          </div>

          <h2>{artwork.title}</h2>

          {artwork.description ? <p>{artwork.description}</p> : null}

          <div className="list-card-footer">
            <span>Open artwork</span>
            <span aria-hidden="true">→</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
