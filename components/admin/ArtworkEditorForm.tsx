'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { sb } from '../../lib/supabase/client'
import {
  isArtworkImagesQueryError,
  normalizeArtwork,
  type ArtworkRecord,
} from '../../lib/artworks'

interface ArtworkEditorFormProps {
  mode: 'create' | 'edit'
  artworkId?: string
}

interface GalleryItem {
  id?: string
  image_url: string
  file?: File
  isNew?: boolean
}

async function uploadArtworkFile(file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `artworks/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

  const { error: uploadError } = await sb.storage
    .from('artworks')
    .upload(fileName, file)

  if (uploadError) {
    throw uploadError
  }

  const {
    data: { publicUrl },
  } = sb.storage.from('artworks').getPublicUrl(fileName)

  return publicUrl
}

export default function ArtworkEditorForm({ mode, artworkId }: ArtworkEditorFormProps) {
  const router = useRouter()
  const isEditMode = mode === 'edit'

  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [medium, setMedium] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [year, setYear] = useState('')
  const [tags, setTags] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])

  useEffect(() => {
    if (!isEditMode || !artworkId) {
      return
    }

    let isMounted = true

    async function fetchArtwork() {
      try {
        const initialQuery = await sb
          .from('artworks')
          .select(`
            *,
            artwork_images (
              id,
              artwork_id,
              image_url,
              sort_order,
              created_at
            )
          `)
          .eq('id', artworkId)
          .single()

        let data = initialQuery.data as ArtworkRecord | null
        let error = initialQuery.error

        if (error && isArtworkImagesQueryError(error)) {
          const fallbackQuery = await sb
            .from('artworks')
            .select('*')
            .eq('id', artworkId)
            .single()

          data = fallbackQuery.data as ArtworkRecord | null
          error = fallbackQuery.error
        }

        if (error || !data) {
          throw error ?? new Error('Artwork not found')
        }

        if (!isMounted) {
          return
        }

        const artwork = normalizeArtwork(data as ArtworkRecord)

        setTitle(artwork.title)
        setDescription(artwork.description ?? '')
        setMedium(artwork.medium ?? '')
        setDimensions(artwork.dimensions ?? '')
        setYear(artwork.year ? artwork.year.toString() : '')
        setTags(artwork.tags?.join(', ') ?? '')
        setIsFeatured(Boolean(artwork.is_featured))
        setGalleryItems(
          artwork.artwork_images.map((image) => ({
            id: image.id,
            image_url: image.image_url,
          }))
        )
      } catch (error) {
        console.error('Error loading artwork:', error)
        alert('Failed to load artwork')
        router.push('/admin/artworks')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchArtwork()

    return () => {
      isMounted = false
    }
  }, [artworkId, isEditMode, router])

  const hasImages = galleryItems.length > 0

  const gallerySummary = useMemo(
    () => `${galleryItems.length} image${galleryItems.length === 1 ? '' : 's'} in gallery`,
    [galleryItems.length]
  )

  const appendFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return
    }

    const nextItems = Array.from(files).map((file) => ({
      image_url: URL.createObjectURL(file),
      file,
      isNew: true,
    }))

    setGalleryItems((current) => [...current, ...nextItems])
  }

  const moveImage = (index: number, direction: -1 | 1) => {
    setGalleryItems((current) => {
      const nextIndex = index + direction

      if (nextIndex < 0 || nextIndex >= current.length) {
        return current
      }

      const next = [...current]
      const [item] = next.splice(index, 1)
      next.splice(nextIndex, 0, item)
      return next
    })
  }

  const removeImage = (index: number) => {
    setGalleryItems((current) => {
      const item = current[index]
      if (item?.isNew) {
        URL.revokeObjectURL(item.image_url)
      }

      return current.filter((_, currentIndex) => currentIndex !== index)
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!title.trim()) {
      alert('Title is required')
      return
    }

    if (galleryItems.length === 0) {
      alert('Add at least one image to the artwork gallery')
      return
    }

    setSaving(true)

    try {
      const {
        data: { user },
        error: authError,
      } = await sb.auth.getUser()

      if (authError || !user) {
        throw new Error('Authentication required')
      }

      const orderedImageUrls: string[] = []

      for (const item of galleryItems) {
        if (item.file) {
          const uploadedUrl = await uploadArtworkFile(item.file)
          orderedImageUrls.push(uploadedUrl)
        } else {
          orderedImageUrls.push(item.image_url)
        }
      }

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        image_url: orderedImageUrls[0] ?? null,
        medium: medium.trim() || null,
        dimensions: dimensions.trim() || null,
        year: year ? parseInt(year, 10) : null,
        tags: tags
          ? tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        is_featured: isFeatured,
        published: true,
        updated_at: new Date().toISOString(),
      }

      let targetArtworkId = artworkId

      if (isEditMode && targetArtworkId) {
        const { error } = await sb
          .from('artworks')
          .update(payload)
          .eq('id', targetArtworkId)

        if (error) {
          throw error
        }

        const { error: deleteImagesError } = await sb
          .from('artwork_images')
          .delete()
          .eq('artwork_id', targetArtworkId)

        if (deleteImagesError) {
          throw deleteImagesError
        }
      } else {
        const { data, error } = await sb
          .from('artworks')
          .insert({
            ...payload,
            created_at: new Date().toISOString(),
          })
          .select('id')
          .single()

        if (error || !data) {
          throw error ?? new Error('Failed to create artwork')
        }

        targetArtworkId = data.id
      }

      if (!targetArtworkId) {
        throw new Error('Missing artwork id')
      }

      const imageRows = orderedImageUrls.map((imageUrl, index) => ({
        artwork_id: targetArtworkId,
        image_url: imageUrl,
        sort_order: index,
      }))

      const { error: insertImagesError } = await sb
        .from('artwork_images')
        .insert(imageRows)

      if (insertImagesError) {
        throw insertImagesError
      }

      router.push('/admin/artworks')
    } catch (error) {
      console.error('Error saving artwork:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save artwork'
      const migrationHint = errorMessage.toLowerCase().includes('artwork_images')
        ? ' The new artwork gallery schema is not active yet. Run the SQL in supabase_schema_updates.sql first, then try again.'
        : ''

      alert(`${errorMessage}${migrationHint}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="md-surface" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <div className="md-body-large" style={{ textAlign: 'center', color: 'var(--md-sys-color-on-surface)' }}>
          Loading artwork...
        </div>
      </div>
    )
  }

  return (
    <div className="md-surface" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 className="md-display-small" style={{ color: 'var(--md-sys-color-on-surface)', margin: 0 }}>
            {isEditMode ? 'Edit Artwork' : 'Create New Artwork'}
          </h1>
          <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>
            Build a polished multi-image artwork gallery entry.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/artworks')}
          className="md-outlined-button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            color: 'var(--md-sys-color-primary)',
            border: '1px solid var(--md-sys-color-outline)',
            borderRadius: '20px',
            cursor: 'pointer',
          }}
        >
          Back to Artworks
        </button>
      </div>

      <div
        className="md-surface-container"
        style={{
          backgroundColor: 'var(--md-sys-color-surface-container)',
          borderRadius: '12px',
          border: '1px solid var(--md-sys-color-outline-variant)',
          padding: '1.5rem',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="md-body-large" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
              Title *
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              type="text"
              required
              className="md-body-large"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', backgroundColor: 'var(--md-sys-color-surface)', color: 'var(--md-sys-color-on-surface)', outline: 'none' }}
              placeholder="Enter artwork title"
            />
          </div>

          <div>
            <label className="md-body-large" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="md-body-large"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', backgroundColor: 'var(--md-sys-color-surface)', color: 'var(--md-sys-color-on-surface)', outline: 'none', resize: 'vertical' }}
              placeholder="Describe the artwork or the gallery set"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="md-body-large" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
                Medium
              </label>
              <input value={medium} onChange={(event) => setMedium(event.target.value)} type="text" className="md-body-large" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', backgroundColor: 'var(--md-sys-color-surface)', color: 'var(--md-sys-color-on-surface)', outline: 'none' }} placeholder="e.g., Digital collage" />
            </div>
            <div>
              <label className="md-body-large" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
                Dimensions
              </label>
              <input value={dimensions} onChange={(event) => setDimensions(event.target.value)} type="text" className="md-body-large" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', backgroundColor: 'var(--md-sys-color-surface)', color: 'var(--md-sys-color-on-surface)', outline: 'none' }} placeholder="e.g., 3840 x 2160px" />
            </div>
            <div>
              <label className="md-body-large" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
                Year
              </label>
              <input value={year} onChange={(event) => setYear(event.target.value)} type="number" min="1000" max="3000" className="md-body-large" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', backgroundColor: 'var(--md-sys-color-surface)', color: 'var(--md-sys-color-on-surface)', outline: 'none' }} placeholder="e.g., 2026" />
            </div>
          </div>

          <div>
            <label className="md-body-large" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
              Tags (comma separated)
            </label>
            <input value={tags} onChange={(event) => setTags(event.target.value)} type="text" className="md-body-large" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', backgroundColor: 'var(--md-sys-color-surface)', color: 'var(--md-sys-color-on-surface)', outline: 'none' }} placeholder="e.g., abstract, process, series" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input type="checkbox" checked={isFeatured} onChange={(event) => setIsFeatured(event.target.checked)} style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--md-sys-color-primary)' }} />
            <label className="md-body-large" style={{ fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
              Feature this artwork
            </label>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ color: 'var(--md-sys-color-on-surface)', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                  Gallery images
                </h3>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{gallerySummary}. The first image becomes the cover.</p>
              </div>

              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '3rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '999px',
                  background: 'var(--gradient-primary)',
                  color: 'var(--md-sys-color-on-primary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Add images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(event) => {
                    appendFiles(event.target.files)
                    event.target.value = ''
                  }}
                />
              </label>
            </div>

            {hasImages ? (
              <div className="admin-artwork-gallery-grid">
                {galleryItems.map((item, index) => (
                  <div key={item.id ?? `${item.image_url}-${index}`} className="admin-artwork-gallery-item">
                    <div className="admin-artwork-gallery-preview">
                      <img src={item.image_url} alt={`Gallery item ${index + 1}`} />
                      <span className="admin-artwork-gallery-index">{index === 0 ? 'Cover' : `#${index + 1}`}</span>
                    </div>
                    <div className="admin-artwork-gallery-actions">
                      <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0}>
                        Up
                      </button>
                      <button type="button" onClick={() => moveImage(index, 1)} disabled={index === galleryItems.length - 1}>
                        Down
                      </button>
                      <button type="button" onClick={() => removeImage(index)} className="is-danger">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-artwork-empty-gallery">
                Add one or more images to start this artwork gallery.
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--md-sys-color-outline-variant)', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => router.push('/admin/artworks')}
              style={{ padding: '0.6rem 1rem', background: 'transparent', color: 'var(--md-sys-color-primary)', border: '1px solid var(--md-sys-color-outline)', borderRadius: '999px', cursor: 'pointer' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{ padding: '0.8rem 1.5rem', background: saving ? 'var(--md-sys-color-surface-variant)' : 'var(--gradient-primary)', color: saving ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-primary)', border: 'none', borderRadius: '999px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 600 }}
            >
              {saving ? 'Saving...' : isEditMode ? 'Update artwork' : 'Create artwork'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
