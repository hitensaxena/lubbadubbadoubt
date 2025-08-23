'use client'

import Link from 'next/link'
import { format } from 'date-fns'

interface Post {
  id: string
  slug: string
  title: string
  subtitle?: string
  excerpt?: string
  published_at: string
  read_time_minutes?: number
  views?: number
  featured_image?: string
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="md-card" style={{
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      borderRadius: 'var(--md-sys-shape-corner-large)',
      border: '1px solid var(--md-sys-color-outline-variant)',
      backgroundColor: 'var(--md-sys-color-surface-container-low)',
      boxShadow: 'var(--md-sys-elevation-1)',
      height: 'fit-content'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
      e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-4)'
      e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container)'
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)'
      e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-1)'
      e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-low)'
    }}>
      <Link href={`/blogs/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {post.featured_image && (
          <div style={{
            width: '100%',
            height: '220px',
            backgroundColor: 'var(--md-sys-color-surface-variant)',
            backgroundImage: `url(${post.featured_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.3))'
            }} />
          </div>
        )}
        
        <div style={{ padding: '1.75rem' }}>
          <div className="md-label-large" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            color: 'var(--md-sys-color-primary)',
            fontWeight: '500'
          }}>
            <time>{format(new Date(post.published_at), 'MMM dd, yyyy')}</time>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              {post.read_time_minutes && (
                <span>{post.read_time_minutes} min read</span>
              )}
              {post.views && (
                <span>{post.views.toLocaleString()} views</span>
              )}
            </div>
          </div>
          
          <h2 className="md-title-large" style={{
            fontWeight: 'bold',
            marginBottom: '0.75rem',
            color: 'var(--md-sys-color-on-surface)',
            lineHeight: '1.3',
            fontSize: '1.375rem'
          }}>
            {post.title}
          </h2>
          
          {post.subtitle && (
            <h3 className="md-title-medium" style={{
              fontWeight: '500',
              marginBottom: '1rem',
              color: 'var(--md-sys-color-on-surface-variant)',
              lineHeight: '1.4',
              fontSize: '1.125rem'
            }}>
              {post.subtitle}
            </h3>
          )}
          
          {post.excerpt && (
            <p className="md-body-medium" style={{
              color: 'var(--md-sys-color-on-surface-variant)',
              lineHeight: '1.6',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.95rem',
              marginBottom: '1rem'
            }}>
              {post.excerpt}
            </p>
          )}
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: 'auto',
            paddingTop: '0.5rem'
          }}>
            <span className="md-label-medium" style={{
              color: 'var(--md-sys-color-primary)',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}>
              Read more →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}