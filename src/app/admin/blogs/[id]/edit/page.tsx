'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminGuard from '../../../../../../components/AdminGuard'
import Link from 'next/link'
import { sb } from '../../../../../../lib/supabase/client'
import { mdToHtml, estimateReadTime, extractFrontmatter } from '../../../../../../lib/md/parseMarkdown'

interface BlogPost {
  id: string
  title: string
  subtitle: string
  slug: string
  content_md: string
  content_html: string
  excerpt: string
  featured_image: string
  published: boolean
  created_at: string
  updated_at: string
}

export default function EditBlogPage() {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    excerpt: '',
    featured_image: '',
    content: ''
  })
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      const { data, error } = await sb
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error) {
        console.error('Error fetching post:', error)
        alert('Failed to load post')
        router.push('/admin/blogs')
        return
      }

      setPost(data)
      setFormData({
        title: data.title || '',
        subtitle: data.subtitle || '',
        excerpt: data.excerpt || '',
        featured_image: data.featured_image || '',
        content: data.content_md || ''
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to load post')
      router.push('/admin/blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `blog-images/${fileName}`

      const { error: uploadError } = await sb.storage
        .from('blog-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        alert('Error uploading image')
        return
      }

      const { data } = sb.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      const imageUrl = data.publicUrl
      setUploadedImageUrl(imageUrl)
      setFormData(prev => ({ ...prev, featured_image: imageUrl }))
    } catch (error) {
      console.error('Error:', error)
      alert('Error uploading image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async (publishStatus: boolean) => {
    setIsSaving(true)

    try {
      // Extract frontmatter and content (in case content has frontmatter)
      const { frontmatter, content: cleanContent } = extractFrontmatter(formData.content)
      
      // Convert markdown to HTML (using clean content without frontmatter)
      const htmlContent = await mdToHtml(cleanContent)
      
      // Estimate read time (using clean content)
      const readTime = estimateReadTime(cleanContent)
      
      // Generate slug from title
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const { error } = await sb
        .from('posts')
        .update({
          title: formData.title,
          subtitle: formData.subtitle,
          slug,
          content_md: cleanContent, // Store clean content without frontmatter
          content_html: htmlContent,
          excerpt: formData.excerpt,
          featured_image: formData.featured_image,
          published: publishStatus,
          read_time_minutes: readTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)

      if (error) {
        console.error('Error updating post:', error)
        alert('Failed to update post. Please try again.')
      } else {
        router.push('/admin/blogs')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="md-surface" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '3rem', height: '3rem', border: '2px solid var(--md-sys-color-primary)', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
            <p className="md-body-large" style={{ marginTop: '1rem', color: 'var(--md-sys-color-on-surface)' }}>Loading post...</p>
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="md-surface" style={{ minHeight: '100vh', padding: '2rem', backgroundColor: 'var(--md-sys-color-surface)' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 className="md-display-small" style={{ color: 'var(--md-sys-color-on-surface)', margin: 0 }}>Edit Blog Post</h1>
                <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>Update your blog post content</p>
              </div>
              <button
                onClick={() => router.push('/admin/blogs')}
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
                Back to Posts
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="md-surface-container" style={{ backgroundColor: 'var(--md-sys-color-surface-container)', borderRadius: '12px', border: '1px solid var(--md-sys-color-outline-variant)' }}>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label htmlFor="title" className="md-body-large" style={{ display: 'block', fontWeight: '600', color: 'var(--md-sys-color-on-surface)', marginBottom: '0.5rem' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <label htmlFor="subtitle" className="md-body-large" style={{ display: 'block', fontWeight: '600', color: 'var(--md-sys-color-on-surface)', marginBottom: '0.5rem' }}>
                    Subtitle
                  </label>
                  <input
                    type="text"
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
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
                    placeholder="Optional subtitle"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="excerpt" className="md-body-large" style={{ display: 'block', fontWeight: '600', color: 'var(--md-sys-color-on-surface)', marginBottom: '0.5rem' }}>
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
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
                  placeholder="Brief description of the post"
                />
              </div>

              <div>
                <label className="md-body-large" style={{ display: 'block', fontWeight: '600', color: 'var(--md-sys-color-on-surface)', marginBottom: '0.5rem' }}>
                  Featured Image
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(formData.featured_image || uploadedImageUrl) && (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={uploadedImageUrl || formData.featured_image}
                        alt="Featured image preview"
                        style={{
                          width: '100%',
                          height: '12rem',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid var(--md-sys-color-outline)'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, featured_image: '' }))
                          setUploadedImageUrl('')
                        }}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          backgroundColor: 'var(--md-sys-color-error)',
                          color: 'var(--md-sys-color-on-error)',
                          borderRadius: '50%',
                          padding: '0.25rem',
                          border: 'none',
                          cursor: 'pointer',
                          width: '2rem',
                          height: '2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
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
                  {isUploading && (
                    <p className="md-body-medium" style={{ color: 'var(--md-sys-color-primary)' }}>Uploading image...</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="content" className="md-body-large" style={{ display: 'block', fontWeight: '600', color: 'var(--md-sys-color-on-surface)', marginBottom: '0.5rem' }}>
                  Content *
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={15}
                  className="md-body-large"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--md-sys-color-outline)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--md-sys-color-surface)',
                    color: 'var(--md-sys-color-on-surface)',
                    outline: 'none',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                  placeholder="Write your post content here (Markdown supported)"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                <button
                  type="button"
                  onClick={() => router.push('/admin/blogs')}
                  className="md-outlined-button"
                  style={{
                    padding: '0.5rem 1.5rem',
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
                  type="button"
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                  className="md-outlined-button"
                  style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: 'transparent',
                    color: 'var(--md-sys-color-primary)',
                    border: '1px solid var(--md-sys-color-outline)',
                    borderRadius: '20px',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    opacity: isSaving ? 0.5 : 1
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                  className="md-filled-button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.5rem 1.5rem',
                    backgroundColor: isSaving ? 'var(--md-sys-color-surface-variant)' : 'var(--md-sys-color-primary)',
                    color: isSaving ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-primary)',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: isSaving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSaving ? (
                    <>
                      <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    'Publish'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}