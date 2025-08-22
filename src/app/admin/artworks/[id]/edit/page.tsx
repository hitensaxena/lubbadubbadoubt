'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminGuard from '../../../../../../components/AdminGuard'
import { sb } from '../../../../../../lib/supabase/client'

interface Artwork {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
  updated_at: string
}

export default function EditArtworkPage() {
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const router = useRouter()
  const params = useParams()
  const artworkId = params.id as string

  useEffect(() => {
    if (artworkId) {
      fetchArtwork()
    }
  }, [artworkId])

  const fetchArtwork = async () => {
    try {
      const { data, error } = await sb
        .from('artworks')
        .select('*')
        .eq('id', artworkId)
        .single()

      if (error) {
        console.error('Error fetching artwork:', error)
        alert('Failed to load artwork')
        router.push('/admin/artworks')
        return
      }

      setArtwork(data)
      setTitle(data.title)
      setDescription(data.description || '')
      setImageUrl(data.image_url)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to load artwork')
      router.push('/admin/artworks')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `artworks/${fileName}`

    const { error: uploadError } = await sb.storage
      .from('artworks')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = sb.storage
      .from('artworks')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let finalImageUrl = imageUrl

      // Upload new image if selected
      if (imageFile) {
        setUploading(true)
        finalImageUrl = await handleImageUpload(imageFile)
        setUploading(false)
      }

      const { error } = await sb
        .from('artworks')
        .update({
          title,
          description,
          image_url: finalImageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', artworkId)

      if (error) {
        console.error('Error updating artwork:', error)
        alert('Failed to update artwork. Please try again.')
      } else {
        router.push('/admin/artworks')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update artwork. Please try again.')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImageUrl(previewUrl)
    }
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading artwork...</p>
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 className="md-display-small" style={{ color: 'var(--md-sys-color-on-surface)', margin: 0 }}>Edit Artwork</h1>
                <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>Update your artwork details</p>
              </div>
              <button
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
                  cursor: 'pointer'
                }}
              >
                <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Artworks
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="md-surface-container" style={{ backgroundColor: 'var(--md-sys-color-surface-container)', borderRadius: '12px', border: '1px solid var(--md-sys-color-outline-variant)' }}>
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label htmlFor="title" className="md-body-large" style={{ display: 'block', fontWeight: '600', color: 'var(--md-sys-color-on-surface)', marginBottom: '0.5rem' }}>
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="md-body-large"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--md-sys-color-outline)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--md-sys-color-surface)',
                    color: 'var(--md-sys-color-on-surface)',
                    outline: 'none'
                  }}
                  placeholder="Enter artwork title"
                />
              </div>

              <div>
                <label htmlFor="description" className="md-body-large" style={{ display: 'block', fontWeight: '600', color: 'var(--md-sys-color-on-surface)', marginBottom: '0.5rem' }}>
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="md-body-large"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--md-sys-color-outline)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--md-sys-color-surface)',
                    color: 'var(--md-sys-color-on-surface)',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  placeholder="Describe your artwork"
                />
              </div>

              <div>
                <label htmlFor="image" className="md-body-large" style={{ display: 'block', fontWeight: '600', color: 'var(--md-sys-color-on-surface)', marginBottom: '0.5rem' }}>
                  Artwork Image
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Current Image Preview */}
                  {imageUrl && (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={imageUrl}
                        alt="Artwork preview"
                        style={{ width: '100%', maxWidth: '28rem', height: '16rem', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--md-sys-color-outline-variant)' }}
                      />
                      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                        <span className="md-body-small" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.5rem', backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '500' }}>
                          {imageFile ? 'New Image' : 'Current Image'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* File Input */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <label htmlFor="image-upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '8rem', border: '2px dashed var(--md-sys-color-outline)', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'var(--md-sys-color-surface-variant)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '1.25rem', paddingBottom: '1.5rem' }}>
                        <svg style={{ width: '2rem', height: '2rem', marginBottom: '1rem', color: 'var(--md-sys-color-on-surface-variant)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="md-body-medium" style={{ marginBottom: '0.5rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                          <span style={{ fontWeight: '600' }}>Click to upload</span> a new image
                        </p>
                        <p className="md-body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.75rem' }}>PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                <button
                  type="button"
                  onClick={() => router.push('/admin/artworks')}
                  className="md-outlined-button"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: 'var(--md-sys-color-primary)',
                    border: '1px solid var(--md-sys-color-outline)',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="md-filled-button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.5rem 1.5rem',
                    backgroundColor: saving || uploading ? 'var(--md-sys-color-surface-variant)' : 'var(--md-sys-color-primary)',
                    color: saving || uploading ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-primary)',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: saving || uploading ? 'not-allowed' : 'pointer',
                    opacity: saving || uploading ? 0.6 : 1
                  }}
                >
                  {saving || uploading ? (
                    <>
                      <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {uploading ? 'Uploading...' : 'Updating...'}
                    </>
                  ) : (
                    'Update Artwork'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}