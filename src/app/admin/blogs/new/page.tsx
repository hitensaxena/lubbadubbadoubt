'use client'

import { useState } from 'react'
import AdminGuard from '../../../../../components/AdminGuard'
import { sb } from '../../../../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import { extractFrontmatter, mdToHtml, estimateReadTime } from '../../../../../lib/md/parseMarkdown'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function NewBlogPost() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    excerpt: '',
    featured_image: ''
  })
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsProcessingFile(true)
    try {
      const mdContent = await file.text()
      const { frontmatter } = extractFrontmatter(mdContent)
      
      // Auto-populate form fields from frontmatter
      setFormData({
        title: (frontmatter.title as string) || '',
        subtitle: (frontmatter.subtitle as string) || '',
        excerpt: (frontmatter.excerpt as string) || (frontmatter.description as string) || '',
        featured_image: (frontmatter.featured_image as string) || (frontmatter.image as string) || ''
      })
    } catch (error) {
      console.error('Error processing markdown file:', error)
    } finally {
      setIsProcessingFile(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Check current user for debugging
    const { data: { user }, error: authError } = await sb.auth.getUser()
    console.log('Current user:', user?.email)
    
    if (authError || !user) {
      throw new Error('Authentication required')
    }
  
  // Extract form data
  const title = formData.get('title') as string
  const subtitle = formData.get('subtitle') as string
  const excerpt = formData.get('excerpt') as string
  const featured_image = formData.get('featured_image') as string
  const published = formData.get('published') === 'on'
  const mdFile = formData.get('md') as File
  
  if (!title || !mdFile) {
    throw new Error('Title and markdown file are required')
  }
  
  // Read markdown file
  const mdContent = await mdFile.text()
  
  // Extract frontmatter and content
  const { frontmatter, content } = extractFrontmatter(mdContent)
  
  // Generate slug
  const slug = frontmatter.slug || slugify(title)
  
  // Convert markdown to HTML
  const htmlContent = await mdToHtml(content)
  
  // Estimate read time
  const readTime = estimateReadTime(content)
  
  // Prepare post data
  const postData = {
    title,
    subtitle: subtitle || null,
    excerpt: excerpt || null,
    featured_image: featured_image || null,
    slug,
    content: htmlContent,
    read_time: readTime,
    published,
    published_at: published ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  // Insert into database
    const { error } = await sb
      .from('posts')
      .insert({
        slug,
        title,
        subtitle,
        excerpt,
        content_md: content,
        content_html: htmlContent,
        featured_image,
        published,
        published_at: published ? new Date().toISOString() : null,
        read_time_minutes: readTime
      })
    
    if (error) {
      throw new Error(`Failed to create post: ${error.message}`)
    }
    
    // Redirect to admin blogs page
    router.push('/admin/blogs')
}

  return (
    <AdminGuard>
      <div className="md-surface" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        backgroundColor: 'var(--md-sys-color-surface)',
        color: 'var(--md-sys-color-on-surface)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 className="md-display-small" style={{
              margin: 0,
              color: 'var(--md-sys-color-on-surface)'
            }}>
              Create New Blog Post
            </h1>
            <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>Upload a markdown file to create a new blog post</p>
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
        
        <form onSubmit={handleSubmit} className="md-surface-container" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          padding: '1.5rem',
          borderRadius: '12px',
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
              name="title"
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
              name="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="md-body-large"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: '8px',
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
              name="excerpt"
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
              Featured Image URL
            </label>
            <input
              type="url"
              name="featured_image"
              value={formData.featured_image}
              onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
              className="md-body-large"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: '8px',
                backgroundColor: 'var(--md-sys-color-surface)',
                color: 'var(--md-sys-color-on-surface)'
              }}
              placeholder="https://example.com/image.jpg (optional)"
            />
          </div>
          
          {/* Markdown File */}
          <div>
            <label className="md-body-large" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--md-sys-color-on-surface)'
            }}>
              Markdown File *
            </label>
            <input
              type="file"
              name="md"
              accept=".md,.markdown"
              onChange={handleFileChange}
              required
              className="md-body-large"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: '8px',
                backgroundColor: 'var(--md-sys-color-surface-container)',
                color: 'var(--md-sys-color-on-surface)'
              }}
            />
            {isProcessingFile && (
              <p className="md-body-small" style={{
                color: 'var(--md-sys-color-primary)',
                marginTop: '0.25rem'
              }}>
                Processing markdown file and extracting metadata...
              </p>
            )}
            <p className="md-body-small" style={{
              color: 'var(--md-sys-color-on-surface-variant)',
              marginTop: '0.25rem'
            }}>
              Upload a .md file with your blog post content. Fields above will be auto-populated from frontmatter if available.
            </p>
          </div>
          
          {/* Published Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <input
              type="checkbox"
              name="published"
              id="published"
              style={{
                width: '1.25rem',
                height: '1.25rem',
                accentColor: 'var(--md-sys-color-primary)'
              }}
            />
            <label htmlFor="published" className="md-body-large" style={{
              fontWeight: '600',
              color: 'var(--md-sys-color-on-surface)',
              cursor: 'pointer'
            }}>
              Publish immediately
            </label>
          </div>
          
          {/* Submit Button */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <button
              type="submit"
              className="md-filled-button"
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'var(--md-sys-color-primary)',
                color: 'var(--md-sys-color-on-primary)',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              Create Post
            </button>
            
            <a
              href="/admin/blogs"
              className="md-outlined-button"
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'transparent',
                color: 'var(--md-sys-color-primary)',
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: '20px',
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </AdminGuard>
  )
}