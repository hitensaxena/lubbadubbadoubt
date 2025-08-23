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
      <div className="md-surface" style={{
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 className="md-headline-large" style={{ color: 'var(--md-sys-color-error)', marginBottom: '1rem' }}>Error loading posts</h1>
        <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="md-surface" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      <h1 className="md-display-small" style={{
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        color: 'var(--md-sys-color-on-surface)'
      }}>Blog Posts</h1>
      
      <p className="md-title-medium" style={{
        color: 'var(--md-sys-color-on-surface-variant)',
        marginBottom: '3rem'
      }}>Thoughts, tutorials, and insights on web development and design.</p>

      {posts && posts.length > 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
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
                views: post.views
              }} 
            />
          ))}
        </div>
      ) : (
        <div className="md-surface-container" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          borderRadius: 'var(--md-sys-shape-corner-large)'
        }}>
          <h2 className="md-headline-medium" style={{ marginBottom: '1rem', color: 'var(--md-sys-color-on-surface)' }}>No posts yet</h2>
          <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Check back soon for new content!</p>
        </div>
      )}
    </div>
  )
}