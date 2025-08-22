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
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <Link href={`/blogs/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {post.featured_image && (
          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#f0f0f0',
            backgroundImage: `url(${post.featured_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        )}
        
        <div style={{ padding: '1.5rem' }}>
          <div className="md-label-large" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
            color: 'var(--md-sys-color-on-surface-variant)'
          }}>
            <time>{format(new Date(post.published_at), 'MMM dd, yyyy')}</time>
            <div style={{ display: 'flex', gap: '1rem' }}>
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
            marginBottom: '0.5rem',
            color: 'var(--md-sys-color-on-surface)',
            lineHeight: '1.3'
          }}>
            {post.title}
          </h2>
          
          {post.subtitle && (
            <h3 className="md-title-medium" style={{
              fontWeight: '500',
              marginBottom: '0.75rem',
              color: 'var(--md-sys-color-on-surface-variant)',
              lineHeight: '1.4'
            }}>
              {post.subtitle}
            </h3>
          )}
          
          {post.excerpt && (
            <p className="md-body-medium" style={{
              color: 'var(--md-sys-color-on-surface-variant)',
              lineHeight: '1.5',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {post.excerpt}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}