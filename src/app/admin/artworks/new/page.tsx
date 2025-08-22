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
        <h1 className="md-display-small" style={{
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '2rem'
        }}>
          Create New Artwork
        </h1>
        
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