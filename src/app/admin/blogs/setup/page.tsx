'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminGuard from '../../../../../components/AdminGuard'
import Link from 'next/link'
import { sb } from '../../../../../lib/supabase/client'
import { mdToHtml, estimateReadTime } from '../../../../../lib/md/parseMarkdown'

interface BlogData {
  frontmatter?: {
    title?: string
    subtitle?: string
    excerpt?: string
    description?: string
    featured_image?: string
    image?: string
  }
  parsedContent?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function BlogSetup() {
  const router = useRouter()
  const [blogData, setBlogData] = useState<BlogData | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    excerpt: '',
    featured_image: '',
    content: ''
  })
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')

  useEffect(() => {
    // Get blog data from sessionStorage
    const storedData = sessionStorage.getItem('newBlogData')
    if (!storedData) {
      router.push('/admin/blogs/new')
      return
    }

    const data = JSON.parse(storedData)
    setBlogData(data)
    
    // Pre-populate form fields
    setFormData({
      title: (data.frontmatter?.title as string) || '',
      subtitle: (data.frontmatter?.subtitle as string) || '',
      excerpt: (data.frontmatter?.excerpt as string) || (data.frontmatter?.description as string) || '',
      featured_image: (data.frontmatter?.featured_image as string) || (data.frontmatter?.image as string) || '',
      content: data.parsedContent || ''
    })
  }, [])

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `blog-images/${fileName}`

      const { error: uploadError } = await sb.storage
        .from('blog-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = sb.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      setUploadedImageUrl(publicUrl)
      setFormData(prev => ({ ...prev, featured_image: publicUrl }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB')
        return
      }
      setFeaturedImageFile(file)
      handleImageUpload(file)
    }
  }

  const handleSave = async (published: boolean) => {
    if (!formData.title || !formData.content) {
      alert('Title and content are required')
      return
    }

    setIsSaving(true)
    try {
      // Check authentication
      const { data: { user }, error: authError } = await sb.auth.getUser()
      if (authError || !user) {
        throw new Error('Authentication required')
      }

      // Generate slug
      const slug = slugify(formData.title)

      // Convert markdown to HTML
      const htmlContent = await mdToHtml(formData.content)

      // Estimate read time
      const readTime = estimateReadTime(formData.content)

      // Insert into database
      const { error } = await sb
        .from('posts')
        .insert({
          slug,
          title: formData.title,
          subtitle: formData.subtitle || null,
          excerpt: formData.excerpt || null,
          content_md: formData.content,
          content_html: htmlContent,
          featured_image: formData.featured_image || null,
          published,
          published_at: published ? new Date().toISOString() : null,
          read_time_minutes: readTime
        })

      if (error) {
        throw new Error(`Failed to create post: ${error.message}`)
      }

      // Clear session storage
      sessionStorage.removeItem('newBlogData')

      // Redirect to admin blogs page
      router.push('/admin/blogs')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!blogData) {
    return (
      <AdminGuard>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="md-surface" style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem',
        backgroundColor: 'var(--md-sys-color-surface)',
        color: 'var(--md-sys-color-on-surface)'
      }}>
        {/* Back Button */}
        <div style={{ marginBottom: '1rem' }}>
          <Link 
            href="/admin/blogs/new"
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
            ← Back to File Upload
          </Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="md-display-small" style={{
            color: 'var(--md-sys-color-on-surface)',
            marginBottom: '0.5rem',
            fontWeight: 'bold'
          }}>
            Setup Blog Post
          </h1>
          <p className="md-body-large" style={{
            color: 'var(--md-sys-color-on-surface-variant)'
          }}>
            Review and edit your blog post details before publishing
          </p>
        </div>

        {/* Form */}
        <div className="md-surface-container" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          padding: '2rem',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          backgroundColor: 'var(--md-sys-color-surface-container)'
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
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="md-body-large"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                backgroundColor: 'var(--md-sys-color-surface)',
                color: 'var(--md-sys-color-on-surface)'
              }}
              placeholder="Enter post title"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="md-body-large" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--md-sys-color-on-surface)'
            }}>
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="md-body-large"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                backgroundColor: 'var(--md-sys-color-surface)',
                color: 'var(--md-sys-color-on-surface)'
              }}
              placeholder="Enter post subtitle (optional)"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="md-body-large" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--md-sys-color-on-surface)'
            }}>
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="md-body-large"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                backgroundColor: 'var(--md-sys-color-surface)',
                color: 'var(--md-sys-color-on-surface)',
                resize: 'vertical'
              }}
              placeholder="Brief description of the post (optional)"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="md-body-large" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--md-sys-color-on-surface)'
            }}>
              Featured Image
            </label>
            
            {/* Image Upload */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <button
                type="button"
                onClick={() => document.getElementById('image-upload')?.click()}
                disabled={isUploading}
                className="md-outlined-button"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--md-sys-shape-corner-full)',
                  border: '1px solid var(--md-sys-color-outline)',
                  backgroundColor: 'transparent',
                  color: 'var(--md-sys-color-on-surface)',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  opacity: isUploading ? 0.6 : 1
                }}
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </button>
              
              {(formData.featured_image || uploadedImageUrl) && (
                <div style={{
                  width: '100px',
                  height: '60px',
                  borderRadius: 'var(--md-sys-shape-corner-medium)',
                  overflow: 'hidden',
                  border: '1px solid var(--md-sys-color-outline)'
                }}>
                  <img
                    src={uploadedImageUrl || formData.featured_image}
                    alt="Featured image preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Manual URL Input */}
            <input
              type="url"
              value={formData.featured_image}
              onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
              className="md-body-large"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                backgroundColor: 'var(--md-sys-color-surface)',
                color: 'var(--md-sys-color-on-surface)'
              }}
              placeholder="Or enter image URL manually"
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="md-body-large" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--md-sys-color-on-surface)'
            }}>
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={20}
              required
              className="md-body-large"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                backgroundColor: 'var(--md-sys-color-surface)',
                color: 'var(--md-sys-color-on-surface)',
                resize: 'vertical',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}
              placeholder="Write your blog post content in Markdown..."
            />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="md-outlined-button"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                border: '1px solid var(--md-sys-color-outline)',
                backgroundColor: 'transparent',
                color: 'var(--md-sys-color-on-surface)',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.6 : 1
              }}
            >
              {isSaving ? 'Saving...' : 'Save as Draft'}
            </button>
            
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="md-filled-button"
              style={{
                padding: '0.75rem 2rem',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                backgroundColor: 'var(--md-sys-color-primary)',
                color: 'var(--md-sys-color-on-primary)',
                border: 'none',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.6 : 1
              }}
            >
              {isSaving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}