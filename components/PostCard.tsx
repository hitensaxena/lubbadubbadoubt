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
    <article className="soft-card list-card">
      <Link href={`/blogs/${post.slug}`}>
        {post.featured_image ? (
          <div
            className="list-card-media"
            style={{
              backgroundImage: `url(${post.featured_image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ) : (
          <div
            className="list-card-media"
            style={{
              display: 'grid',
              placeItems: 'center',
              color: 'var(--md-sys-color-primary)',
              fontWeight: 600,
            }}
          >
            Editorial note
          </div>
        )}

        <div className="list-card-body">
          <div className="list-card-meta">
            <time>{format(new Date(post.published_at), 'MMM dd, yyyy')}</time>
            {post.read_time_minutes ? <span>{post.read_time_minutes} min read</span> : null}
            {post.views ? <span>{post.views.toLocaleString()} views</span> : null}
          </div>

          <h2>{post.title}</h2>

          {post.subtitle ? <h3>{post.subtitle}</h3> : null}

          {post.excerpt ? <p>{post.excerpt}</p> : null}

          <div className="list-card-footer">
            <span>Read article</span>
            <span aria-hidden="true">→</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
