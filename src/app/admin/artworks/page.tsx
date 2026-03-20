'use client'

import { useEffect, useState } from 'react'
import AdminGuard from '../../../../components/AdminGuard'
import Link from 'next/link'
import { sb } from '../../../../lib/supabase/client'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

interface Artwork {
  id: string
  title: string
  image_url?: string
  created_at: string
  medium?: string
  year?: number
  is_featured?: boolean
  tags?: string[]
}

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = sb
  const router = useRouter()

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('id, title, image_url, created_at, medium, year, is_featured, tags')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching artworks:', error)
        } else {
          setArtworks(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArtworks()
  }, [])

  const handleDelete = async (artworkId: string, artworkTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${artworkTitle}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(artworkId)
    try {
      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', artworkId)

      if (error) {
        console.error('Error deleting artwork:', error)
        alert('Failed to delete artwork. Please try again.')
      } else {
        // Remove from local state
        setArtworks(artworks.filter(artwork => artwork.id !== artworkId))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to delete artwork. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (artworkId: string) => {
    router.push(`/admin/artworks/${artworkId}/edit`)
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="md-surface" style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem' }}>
          <div className="md-body-large" style={{ textAlign: 'center', color: 'var(--md-sys-color-on-surface)' }}>Loading artworks...</div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="md-surface" style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem' }}>
        {/* Back Button */}
        <div style={{
          marginBottom: '1rem'
        }}>
          <Link 
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--md-sys-color-primary)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            ← Back to Admin Home
          </Link>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="md-display-small" style={{ color: 'var(--md-sys-color-on-surface)' }}>Artworks</h1>
            <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>{artworks.length} artworks total</p>
          </div>
          <Link 
            href="/admin/artworks/new"
            className="md-filled-button"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Artwork
          </Link>
        </div>

        {/* Artworks List */}
        {artworks.length === 0 ? (
          <div className="md-surface-container" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--md-sys-shape-corner-large)' }}>
            <svg style={{ margin: '0 auto', height: '3rem', width: '3rem', color: 'var(--md-sys-color-on-surface-variant)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="md-headline-medium" style={{ marginTop: '0.5rem', color: 'var(--md-sys-color-on-surface)' }}>No artworks</h3>
            <p className="md-body-large" style={{ marginTop: '0.25rem', color: 'var(--md-sys-color-on-surface-variant)' }}>Get started by uploading your first artwork.</p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link 
                href="/admin/artworks/new"
                className="md-filled-button"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create your first artwork
              </Link>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {artworks.map((artwork) => (
              <div key={artwork.id} className="md-card" style={{
                backgroundColor: 'var(--md-sys-color-surface-container)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}>
                {/* Image */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4/3',
                  backgroundColor: 'var(--md-sys-color-surface-variant)'
                }}>
                  {artwork.image_url ? (
                    <img 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      src={artwork.image_url} 
                      alt={artwork.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
                      No Image
                    </div>
                  )}
                  {artwork.is_featured && (
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', padding: '0.25rem 0.75rem', backgroundColor: '#fef08a', color: '#854d0e', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      ★ Featured
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 className="md-title-large" style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--md-sys-color-on-surface)' }}>
                    {artwork.title}
                  </h3>
                  
                  <div className="md-body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {artwork.medium && <div>{artwork.medium}</div>}
                    {artwork.year && <div>Created: {artwork.year}</div>}
                    <div>Added: {format(new Date(artwork.created_at), 'MMM d, yyyy')}</div>
                    <div style={{ opacity: 0.5 }}>ID: {artwork.id.slice(0, 8)}</div>
                  </div>
                  
                  {/* Tags */}
                  {artwork.tags && artwork.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                      {artwork.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', backgroundColor: 'var(--md-sys-color-surface-variant)', color: 'var(--md-sys-color-on-surface-variant)', borderRadius: '4px' }}>
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                    <Link 
                      href={`/artworks/${artwork.id}`}
                      target="_blank"
                      className="md-outlined-button"
                      style={{ justifyContent: 'center', display: 'flex', padding: '0.5rem', borderRadius: '8px', textDecoration: 'none', border: '1px solid var(--md-sys-color-outline)', color: 'var(--md-sys-color-primary)', fontSize: '0.875rem' }}
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleEdit(artwork.id)}
                      className="md-filled-button"
                      style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(artwork.id, artwork.title)}
                      disabled={deleting === artwork.id}
                      className="md-filled-button"
                      style={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        backgroundColor: 'var(--md-sys-color-error)',
                        color: 'var(--md-sys-color-on-error)',
                        opacity: deleting === artwork.id ? 0.5 : 1,
                        cursor: deleting === artwork.id ? 'not-allowed' : 'pointer',
                        border: 'none'
                      }}
                      title="Delete"
                    >
                      {deleting === artwork.id ? '...' : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminGuard>
  )
}