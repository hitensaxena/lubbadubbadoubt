import { createClient } from '../../../../lib/supabase/server'
import ArtworkCard from '../../../../components/ArtworkCard'

interface Artwork {
  id: string
  title: string
  image_url: string
}

export default async function ArtworksPage() {
  const supabase = await createClient()
  
  const { data: artworks, error } = await supabase
    .from('artworks')
    .select('id, title, image_url')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching artworks:', error)
    return (
      <div className="md-surface" style={{
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 className="md-headline-large" style={{ color: 'var(--md-sys-color-error)', marginBottom: '1rem' }}>Error loading artworks</h1>
        <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="md-surface" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      <h1 className="md-display-small" style={{
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        color: 'var(--md-sys-color-on-surface)',
        textAlign: 'center'
      }}>Artworks</h1>
      
      <p className="md-title-medium" style={{
        color: 'var(--md-sys-color-on-surface-variant)',
        marginBottom: '3rem',
        textAlign: 'center'
      }}>A collection of creative works and visual explorations.</p>

      {artworks && artworks.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {artworks.map((artwork: Artwork) => (
             <ArtworkCard 
               key={artwork.id} 
               artwork={{
                 id: artwork.id,
                 title: artwork.title,
                 image_url: artwork.image_url,
                 description: '', // Not needed for list view
                 created_at: new Date().toISOString() // Placeholder since not fetched
               }} 
             />
           ))}
        </div>
      ) : (
        <div className="md-surface-container" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          borderRadius: 'var(--md-sys-shape-corner-large)'
        }}>
          <h2 className="md-headline-medium" style={{ marginBottom: '1rem', color: 'var(--md-sys-color-on-surface)' }}>No artworks yet</h2>
          <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Check back soon for new creative works!</p>
        </div>
      )}
    </div>
  )
}