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
      
      const medium = formData.get('medium') as string
      const dimensions = formData.get('dimensions') as string
      const yearStr = formData.get('year') as string
      const year = yearStr ? parseInt(yearStr, 10) : null
      const tagsStr = formData.get('tags') as string
      const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : []
      const is_featured = formData.get('is_featured') === 'on'
      
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
          published: true,
          medium: medium || null,
          dimensions: dimensions || null,
          year,
          tags,
          is_featured
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

             {/* Grid for smaller fields */}
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
               <div>
                 <label className="md-body-large" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--md-sys-color-on-surface)' }}>
                   Medium
                 </label>
                 <input type="text" name="medium" className="md-body-large" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', backgroundColor: 'var(--md-sys-color-surface)', color: 'var(--md-sys-color-on-surface)', outline: 'none' }} placeholder="e.g., Oil on Canvas" />
               </div>
               <div>
                 <label className="md-body-large" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--md-sys-color-on-surface)' }}>
                   Dimensions
                 </label>
                 <input type="text" name="dimensions" className="md-body-large" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', backgroundColor: 'var(--md-sys-color-surface)', color: 'var(--md-sys-color-on-surface)', outline: 'none' }} placeholder="e.g., 24 x 36 inches" />
               </div>
               <div>
                 <label className="md-body-large" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--md-sys-color-on-surface)' }}>
                   Year
                 </label>
                 <input type="number" name="year" min="1000" max="3000" className="md-body-large" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', backgroundColor: 'var(--md-sys-color-surface)', color: 'var(--md-sys-color-on-surface)', outline: 'none' }} placeholder="e.g., 2024" />
               </div>
             </div>

             {/* Tags */}
             <div>
               <label className="md-body-large" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--md-sys-color-on-surface)' }}>
                 Tags (comma separated)
               </label>
               <input type="text" name="tags" className="md-body-large" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', backgroundColor: 'var(--md-sys-color-surface)', color: 'var(--md-sys-color-on-surface)', outline: 'none' }} placeholder="e.g., abstract, modern, landscape" />
             </div>

             {/* Featured Toggle */}
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <input type="checkbox" id="is_featured" name="is_featured" style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--md-sys-color-primary)' }} />
               <label htmlFor="is_featured" className="md-body-large" style={{ fontWeight: '600', color: 'var(--md-sys-color-on-surface)', cursor: 'pointer', userSelect: 'none' }}>
                 Feature this artwork on the home gallery
               </label>
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