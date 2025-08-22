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
    <article className="md-card" style={{
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <Link href={`/artworks/${artwork.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          width: '100%',
          height: '300px',
          backgroundColor: '#f0f0f0',
          backgroundImage: artwork.image_url ? `url(${artwork.image_url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '0.9rem'
        }}>
          {!artwork.image_url && 'No Image'}
        </div>
        
        <div style={{ padding: '1.5rem' }}>
          <div className="md-label-large" style={{
            color: 'var(--md-sys-color-on-surface-variant)',
            marginBottom: '0.75rem'
          }}>
            <time>{format(new Date(artwork.created_at), 'MMM dd, yyyy')}</time>
          </div>
          
          <h2 className="md-title-large" style={{
            fontWeight: 'bold',
            marginBottom: '0.75rem',
            color: 'var(--md-sys-color-on-surface)',
            lineHeight: '1.3'
          }}>
            {artwork.title}
          </h2>
          
          {artwork.description && (
            <p className="md-body-medium" style={{
              color: 'var(--md-sys-color-on-surface-variant)',
              lineHeight: '1.5',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {artwork.description}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}