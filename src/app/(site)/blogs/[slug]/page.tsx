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
    <>
      {/* Hero Section with Full-Screen Featured Image */}
      {post.featured_image ? (
        <section style={{
          position: 'relative',
          height: '100vh',
          minHeight: '600px',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${post.featured_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '800px',
            padding: '2rem',
            zIndex: 2
          }}>
            <h1 className="md-display-large" style={{
              fontWeight: 'bold',
              lineHeight: '1.1',
              marginBottom: '1.5rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)'
            }}>
              {post.title}
            </h1>
            
            {post.subtitle && (
              <p className="md-title-large" style={{
                marginBottom: '2rem',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                opacity: 0.9
              }}>
                {post.subtitle}
              </p>
            )}

            <div className="md-label-large" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
              opacity: 0.9
            }}>
              <time dateTime={post.published_at}>
                {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </time>
              <span>•</span>
              <span>{post.read_time_minutes} min read</span>
              <span>•</span>
              <span>{post.views} views</span>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite'
          }}>
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </div>
        </section>
      ) : (
        /* Fallback header for posts without featured image */
        <section className="md-surface" style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          backgroundColor: 'var(--md-sys-color-surface-container)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
                marginBottom: '2rem'
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
              flexWrap: 'wrap'
            }}>
              <time dateTime={post.published_at}>
                {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </time>
              <span>•</span>
              <span>{post.read_time_minutes} min read</span>
              <span>•</span>
              <span>{post.views} views</span>
            </div>
          </div>
        </section>
      )}

      {/* Content Section with smooth transition */}
      <article className="md-surface" style={{
        position: 'relative',
        zIndex: 3,
        backgroundColor: 'var(--md-sys-color-surface)',
        borderRadius: post.featured_image ? '2rem 2rem 0 0' : '0',
        marginTop: post.featured_image ? '-2rem' : '0',
        paddingTop: post.featured_image ? '3rem' : '2rem',
        paddingBottom: '4rem',
        paddingLeft: '2rem',
        paddingRight: '2rem'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Content */}
          <div 
            className="markdown-content"
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.7',
              color: 'var(--md-sys-color-on-surface)'
            }}
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />

          {/* Footer */}
          <footer style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--md-sys-color-outline-variant)',
            textAlign: 'center'
          }}>
            <p className="md-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Published on {format(new Date(post.published_at), 'MMMM d, yyyy')}
            </p>
          </footer>
        </div>
      </article>
      

    </>
  )
}