'use client'

import { useEffect, useState } from 'react'
import AdminGuard from '../../../../components/AdminGuard'
import Link from 'next/link'
import { sb } from '../../../../lib/supabase/client'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import {
  isArtworkImagesQueryError,
  normalizeArtworks,
  type ArtworkRecord,
  type ArtworkWithImages,
} from '../../../../lib/artworks'

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState<ArtworkWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const initialQuery = await sb
          .from('artworks')
          .select(`
            id,
            title,
            description,
            image_url,
            created_at,
            medium,
            year,
            is_featured,
            tags,
            artwork_images (
              id,
              artwork_id,
              image_url,
              sort_order,
              created_at
            )
          `)
          .order('created_at', { ascending: false })

        let data = initialQuery.data as ArtworkRecord[] | null
        let error = initialQuery.error

        if (error && isArtworkImagesQueryError(error)) {
          const fallbackQuery = await sb
            .from('artworks')
            .select('id, title, description, image_url, created_at, medium, year, is_featured, tags')
            .order('created_at', { ascending: false })

          data = fallbackQuery.data as ArtworkRecord[] | null
          error = fallbackQuery.error
        }

        if (error) {
          console.error('Error fetching artworks:', error)
        } else {
          setArtworks(normalizeArtworks(data as ArtworkRecord[]))
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
      const { error } = await sb.from('artworks').delete().eq('id', artworkId)

      if (error) {
        console.error('Error deleting artwork:', error)
        alert('Failed to delete artwork. Please try again.')
      } else {
        setArtworks((current) => current.filter((artwork) => artwork.id !== artworkId))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to delete artwork. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="md-surface" style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem' }}>
          <div className="md-body-large" style={{ textAlign: 'center', color: 'var(--md-sys-color-on-surface)' }}>
            Loading artworks...
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="md-surface" style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--md-sys-color-primary)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            ← Back to Admin Home
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 className="md-display-small" style={{ color: 'var(--md-sys-color-on-surface)' }}>
              Artworks
            </h1>
            <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>
              {artworks.length} artworks total
            </p>
          </div>
          <Link href="/admin/artworks/new" className="button-primary" style={{ textDecoration: 'none' }}>
            New Artwork
          </Link>
        </div>

        {artworks.length === 0 ? (
          <div className="md-surface-container" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--md-sys-shape-corner-large)' }}>
            <h3 className="md-headline-medium" style={{ marginTop: '0.5rem', color: 'var(--md-sys-color-on-surface)' }}>
              No artworks
            </h3>
            <p className="md-body-large" style={{ marginTop: '0.25rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Get started by uploading your first artwork.
            </p>
          </div>
        ) : (
          <div className="admin-artwork-list-grid">
            {artworks.map((artwork) => (
              <div key={artwork.id} className="soft-card admin-artwork-card">
                <div
                  className="admin-artwork-card-media"
                  style={{
                    backgroundImage: artwork.cover_image_url ? `url(${artwork.cover_image_url})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!artwork.cover_image_url ? <span>No image</span> : null}
                  <div className="artwork-grid-card-badges">
                    {artwork.is_featured ? <span className="artwork-badge">Featured</span> : null}
                    <span className="artwork-badge">{artwork.image_count} image{artwork.image_count === 1 ? '' : 's'}</span>
                  </div>
                </div>

                <div className="admin-artwork-card-body">
                  <h3>{artwork.title}</h3>
                  <div className="admin-artwork-card-meta">
                    {artwork.medium ? <div>{artwork.medium}</div> : null}
                    {artwork.year ? <div>{artwork.year}</div> : null}
                    <div>Added {format(new Date(artwork.created_at), 'MMM d, yyyy')}</div>
                  </div>

                  {artwork.tags && artwork.tags.length > 0 ? (
                    <div className="tag-row">
                      {artwork.tags.map((tag) => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                  ) : null}

                  <div className="admin-artwork-card-actions">
                    <Link href={`/artworks/${artwork.id}`} target="_blank" className="button-secondary">
                      View
                    </Link>
                    <button type="button" className="button-primary" onClick={() => router.push(`/admin/artworks/${artwork.id}/edit`)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-danger-button"
                      onClick={() => handleDelete(artwork.id, artwork.title)}
                      disabled={deleting === artwork.id}
                    >
                      {deleting === artwork.id ? '...' : 'Delete'}
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
