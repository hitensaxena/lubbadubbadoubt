import { createClient } from '../../../../../lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'

interface Artwork {
  id: string
  title: string
  description?: string
  image_url?: string
  created_at: string
  published: boolean
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // Fetch the artwork
  const { data: artwork, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error || !artwork) {
    notFound()
  }

  return (
    <article className="md-surface" style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      {/* Header */}
      <header style={{
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        <h1 className="md-display-medium" style={{
          fontWeight: 'bold',
          lineHeight: '1.2',
          marginBottom: '1rem',
          color: 'var(--md-sys-color-on-surface)'
        }}>
          {artwork.title}
        </h1>
        
        <div className="md-label-large" style={{
          color: 'var(--md-sys-color-on-surface-variant)',
          marginBottom: '2rem'
        }}>
          <time dateTime={artwork.created_at}>
            Created on {format(new Date(artwork.created_at), 'MMMM d, yyyy')}
          </time>
        </div>
      </header>

      {/* Artwork Image */}
      {artwork.image_url && (
        <div className="md-surface-container" style={{
          marginBottom: '3rem',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          overflow: 'hidden',
          textAlign: 'center'
        }}>
          <img 
            src={artwork.image_url} 
            alt={artwork.title}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              maxHeight: '70vh',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* Description */}
      {artwork.description && (
        <div className="md-body-large" style={{
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: '1.7',
          color: 'var(--md-sys-color-on-surface)'
        }}>
          <h2 className="md-headline-medium" style={{
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--md-sys-color-on-surface)'
          }}>
            About this artwork
          </h2>
          <p style={{
            whiteSpace: 'pre-wrap'
          }}>
            {artwork.description}
          </p>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--md-sys-color-outline-variant)',
        textAlign: 'center'
      }}>
        <p className="md-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Created on {format(new Date(artwork.created_at), 'MMMM d, yyyy')}</p>
      </footer>
    </article>
  )
}