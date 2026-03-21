import { createClient } from '../../../../lib/supabase/server'
import PostCard from '../../../../components/PostCard'

export const revalidate = 60

interface Post {
  id: string
  slug: string
  title: string
  subtitle?: string
  excerpt?: string
  featured_image?: string
  read_time_minutes: number
  published_at: string
  views: number
}

export default async function BlogsPage() {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, slug, title, subtitle, excerpt, featured_image, read_time_minutes, published_at, views')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)

    return (
      <section className="site-section">
        <div className="site-container">
          <div className="glass-panel error-state">
            <h1 style={{ color: 'var(--md-sys-color-error)', marginBottom: '0.75rem' }}>
              Error loading posts
            </h1>
            <p>Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="site-section">
      <div className="site-container">
        <div className="glass-panel page-hero">
          <span className="eyebrow">Blog</span>
          <h1>Writing with a calmer reading experience.</h1>
          <p>
            Essays, tutorials, and notes on design, development, and the craft of
            making digital work feel intentional.
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="list-grid">
            {posts.map((post: Post) => (
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  title: post.title,
                  subtitle: post.subtitle,
                  excerpt: post.excerpt,
                  slug: post.slug,
                  featured_image: post.featured_image,
                  published_at: post.published_at,
                  read_time_minutes: post.read_time_minutes,
                  views: post.views,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel empty-state">
            <h2 style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '0.75rem' }}>
              No posts yet
            </h2>
            <p>Check back soon for new writing.</p>
          </div>
        )}
      </div>
    </section>
  )
}
