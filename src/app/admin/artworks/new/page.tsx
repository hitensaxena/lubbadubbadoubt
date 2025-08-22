'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminGuard from '../../../../../components/AdminGuard'
import { sb } from '../../../../../lib/supabase/client'

export default function NewArtwork() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      
      // Check authentication
      const { data: { user }, error: authError } = await sb.auth.getUser()
      if (authError || !user) {
        throw new Error('Authentication required')
      }
      
      // Extract form data
      const title = formData.get('title') as string
      const description = formData.get('description') as string
      const imageFile = formData.get('image') as File
      
      if (!title || !imageFile) {
        throw new Error('Title and image are required')
      }
      
      // Get file extension
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `art-${Date.now()}.${fileExt}`
      
      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await sb.storage
        .from('artworks')
        .upload(fileName, imageFile)
      
      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`)
      }
      
      // Get public URL
      const { data: { publicUrl } } = sb.storage
        .from('artworks')
        .getPublicUrl(fileName)
      
      // Insert artwork record
      const { error: insertError } = await sb
        .from('artworks')
        .insert({
          title,
          description: description || null,
          image_url: publicUrl,
          published: true
        })
      
      if (insertError) {
        throw new Error(`Failed to create artwork: ${insertError.message}`)
      }
      
      // Redirect to admin artworks page
      router.push('/admin/artworks')
    } catch (error) {
      console.error('Error creating artwork:', error)
      alert(error instanceof Error ? error.message : 'Failed to create artwork')
    } finally {
      setLoading(false)
    }
  }
  return (
    <AdminGuard>
      <div className="md-surface" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        backgroundColor: 'var(--md-sys-color-surface)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 className="md-display-small" style={{
              color: 'var(--md-sys-color-on-surface)',
              margin: 0
            }}>
              Create New Artwork
            </h1>
            <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>Upload an image and add artwork details</p>
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
        
        <div className="md-surface-container" style={{
          backgroundColor: 'var(--md-sys-color-surface-container)',
          borderRadius: '12px',
          border: '1px solid var(--md-sys-color-outline-variant)',
          padding: '1.5rem'
        }}>
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Title */}
            <div>
              <label className="md-body-large" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--md-sys-color-on-surface)'
              }}>
                Title *
              </label>
              <input
                type="text"
                name="title"
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
          
             {/* Description */}
             <div>
               <label className="md-body-large" style={{
                 display: 'block',
                 marginBottom: '0.5rem',
                 fontWeight: '600',
                 color: 'var(--md-sys-color-on-surface)'
               }}>
                 Description
               </label>
               <textarea
                 name="description"
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
                 placeholder="Enter artwork description (optional)"
               />
             </div>
             
             {/* Image Upload */}
             <div>
               <label className="md-body-large" style={{
                 display: 'block',
                 marginBottom: '0.5rem',
                 fontWeight: '600',
                 color: 'var(--md-sys-color-on-surface)'
               }}>
                 Image *
               </label>
               <input
                 type="file"
                 name="image"
                 accept="image/*"
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
               />
             </div>
             
             {/* Submit Button */}
             <button
               type="submit"
               disabled={loading}
               className="md-filled-button"
               style={{
                 padding: '0.75rem 1.5rem',
                 backgroundColor: loading ? 'var(--md-sys-color-surface-variant)' : 'var(--md-sys-color-primary)',
                 color: loading ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-primary)',
                 border: 'none',
                 borderRadius: '20px',
                 cursor: loading ? 'not-allowed' : 'pointer'
               }}
             >
               {loading ? 'Creating...' : 'Create Artwork'}
             </button>
           </form>
         </div>
       </div>
    </AdminGuard>
  )
}