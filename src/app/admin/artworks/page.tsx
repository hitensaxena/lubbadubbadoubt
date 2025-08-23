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
          .select('id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(20)

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
          <div className="md-surface-container-high" style={{ borderRadius: 'var(--md-sys-shape-corner-large)', overflow: 'hidden' }}>
            <table style={{ width: '100%' }}>
              <thead className="md-surface-container">
                <tr>
                  <th className="md-label-large" style={{ padding: '0.75rem 1.5rem', textAlign: 'left', color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Artwork
                  </th>
                  <th className="md-label-large" style={{ padding: '0.75rem 1.5rem', textAlign: 'left', color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Created
                  </th>
                  <th className="md-label-large" style={{ padding: '0.75rem 1.5rem', textAlign: 'right', color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {artworks.map((artwork) => (
                  <tr key={artwork.id} style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {artwork.image_url && (
                          <div style={{ flexShrink: 0, height: '3rem', width: '3rem', marginRight: '1rem' }}>
                            <img 
                              style={{ height: '3rem', width: '3rem', borderRadius: 'var(--md-sys-shape-corner-medium)', objectFit: 'cover', border: '1px solid var(--md-sys-color-outline-variant)' }}
                              src={artwork.image_url} 
                              alt={artwork.title}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <div className="md-body-medium" style={{ fontWeight: '500', color: 'var(--md-sys-color-on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '20rem' }}>
                            {artwork.title}
                          </div>
                          <div className="md-body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            ID: {artwork.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="md-body-medium" style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', color: 'var(--md-sys-color-on-surface-variant)' }}>
                      {format(new Date(artwork.created_at), 'MMM d, yyyy')}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link 
                          href={`/artworks/${artwork.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="md-text-button"
                          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', fontSize: '0.75rem' }}
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Preview
                        </Link>
                        <button
                          onClick={() => handleEdit(artwork.id)}
                          className="md-outlined-button"
                          style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.75rem' }}
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(artwork.id, artwork.title)}
                          disabled={deleting === artwork.id}
                          className="md-filled-button"
                          style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            fontSize: '0.75rem',
                            backgroundColor: 'var(--md-sys-color-error)',
                            color: 'var(--md-sys-color-on-error)',
                            opacity: deleting === artwork.id ? 0.5 : 1,
                            cursor: deleting === artwork.id ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {deleting === artwork.id ? (
                            <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminGuard>
  )
}