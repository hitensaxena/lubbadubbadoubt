import { createClient } from '../../../../../lib/supabase/server'
import { createClient as createStaticClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'

interface Post {
  id: string
  slug: string
  title: string
  subtitle?: string
  content_html: string
  featured_image?: string
  published_at: string
  read_time_minutes: number
  views: number
  published: boolean
}

interface PageProps {
  params: Promise<{ slug: string }>
}

// Note: generateStaticParams removed to avoid build-time cookie issues
// This will make the page dynamic instead of static
// export async function generateStaticParams() {
//   const supabase = createStaticClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )
//   
//   const { data: posts } = await supabase
//     .from('posts')
//     .select('slug')
//     .eq('published', true)
//
//   return posts?.map((post) => ({
//     slug: post.slug,
//   })) ?? []
// }

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  // Fetch the post
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !post) {
    notFound()
  }

  // Optimistically increment views (non-blocking)
  supabase
    .from('posts')
    .update({ views: post.views + 1 })
    .eq('id', post.id)
    .then(() => {}) // Fire and forget

  return (
    <article className="md-surface" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      {/* Header */}
      <header style={{
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        <h1 className="md-display-medium" style={{
          fontWeight: 'bold',
          lineHeight: '1.2',
          marginBottom: '1rem',
          color: 'var(--md-sys-color-on-surface)'
        }}>
          {post.title}
        </h1>
        
        {post.subtitle && (
          <p className="md-title-large" style={{
            color: 'var(--md-sys-color-on-surface-variant)',
            marginBottom: '2rem',
            fontStyle: 'italic'
          }}>
            {post.subtitle}
          </p>
        )}

        <div className="md-label-large" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          color: 'var(--md-sys-color-on-surface-variant)',
          marginBottom: '2rem'
        }}>
          <time dateTime={post.published_at}>
            {format(new Date(post.published_at), 'MMMM d, yyyy')}
          </time>
          <span>•</span>
          <span>{post.read_time_minutes} min read</span>
          <span>•</span>
          <span>{post.views} views</span>
        </div>
      </header>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="md-surface-container" style={{
          marginBottom: '3rem',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          overflow: 'hidden'
        }}>
          <img 
            src={post.featured_image} 
            alt={post.title}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>
      )}

      {/* Content */}
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: post.content_html }}
      />

      {/* Footer */}
      <footer style={{
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--md-sys-color-outline-variant)',
        textAlign: 'center'
      }}>
        <p className="md-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Published on {format(new Date(post.published_at), 'MMMM d, yyyy')}</p>
      </footer>
    </article>
  )
}