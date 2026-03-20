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
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(139, 92, 246, 0.15)'
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)'
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
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