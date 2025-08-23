import { createClient } from '../../../../../lib/supabase/server'
import { createClient as createStaticClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Image from 'next/image'



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
  tags?: string[]
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

       
       {/* Hero Cover Section */}
       {post.featured_image ? (
         <div
           style={{
             position: 'relative',
             width: '100%',
             height: '100vh',
             minHeight: '100vh',
             overflow: 'hidden',
             display: 'flex',
             alignItems: 'flex-end'
           }}
         >
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            priority
            sizes="100vw"
          />
          {/* Gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)'
              }}
            />
          {/* Content overlay */}
           <div
             style={{
               position: 'relative',
               width: '100%',
               padding: '2rem',
               paddingBottom: '4rem',
               zIndex: 2
             }}
           >
             <div
               style={{
                 maxWidth: '1200px',
                 width: '100%',
                 color: 'white'
               }}
             >
               <h1
                 style={{
                   fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                   fontWeight: '300',
                   marginBottom: '1rem',
                   lineHeight: '1.1',
                   background: 'linear-gradient(135deg, #c4b5fd 0%, #67e8f9 100%)',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   backgroundClip: 'text',
                   filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
                 }}
               >
                 {post.title}
               </h1>
               {post.subtitle && (
                 <p
                   style={{
                     fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                     marginBottom: '1.5rem',
                     opacity: 0.95,
                     textShadow: '0 3px 20px rgba(0,0,0,0.9), 0 1px 5px rgba(0,0,0,1)',
                     lineHeight: '1.4',
                     fontWeight: '400',
                     maxWidth: '600px',
                     color: 'rgba(255,255,255,0.95)'
                   }}
                 >
                   {post.subtitle}
                 </p>
               )}
               
               {/* Metadata group */}
               <div style={{
                 display: 'flex',
                 flexDirection: 'column',
                 gap: '1rem'
               }}>
                 <div
                   style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: '1rem',
                     fontSize: '0.85rem',
                     opacity: 0.9,
                     flexWrap: 'wrap',
                     textShadow: '0 2px 15px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)',
                     color: 'rgba(255,255,255,0.9)'
                   }}
                 >
                   <time dateTime={post.published_at}>
                     {format(new Date(post.published_at), 'MMMM d, yyyy')}
                   </time>
                   <span>•</span>
                   <span>{post.read_time_minutes} min read</span>
                   <span>•</span>
                   <span>{post.views} views</span>
                 </div>
                 
                 {post.tags && post.tags.length > 0 && (
                   <div style={{
                     display: 'flex',
                     gap: '0.5rem',
                     flexWrap: 'wrap'
                   }}>
                     {post.tags.map((tag: string, index: number) => (
                       <span
                         key={index}
                         style={{
                           background: 'rgba(0,0,0,0.4)',
                           backdropFilter: 'blur(10px)',
                           border: '1px solid rgba(255, 255, 255, 0.3)',
                           padding: '0.4rem 0.8rem',
                           borderRadius: '1.5rem',
                           fontSize: '0.75rem',
                           fontWeight: '500',
                           textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                           color: 'rgba(255,255,255,0.9)'
                         }}
                       >
                         {tag}
                       </span>
                     ))}
                   </div>
                 )}
               </div>
             </div>
           </div>
        </div>
      ) : (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--md-sys-color-surface)',
            position: 'relative',
            width: '100%'
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
            <h1
              style={{
                fontWeight: '700',
                lineHeight: '1.1',
                marginBottom: '1.5rem',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                color: 'var(--md-sys-color-on-surface)'
              }}
            >
              {post.title}
            </h1>
            {post.subtitle && (
              <p
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                  fontWeight: '300',
                  marginBottom: '2rem',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  lineHeight: '1.5'
                }}
              >
                {post.subtitle}
              </p>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                fontSize: '0.95rem',
                color: 'var(--md-sys-color-on-surface-variant)',
                marginBottom: '1.5rem'
              }}
            >
              <time dateTime={post.published_at}>
                {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </time>
              <span>•</span>
              <span>{post.read_time_minutes} min read</span>
              <span>•</span>
              <span>{post.views} views</span>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
       <article style={{
           background: 'var(--md-sys-color-surface)',
           padding: '0',
           position: 'relative'
         }}>
         <div style={{
           maxWidth: '800px',
           margin: '0 auto',
           padding: '4rem 2rem 6rem 2rem'
         }}>
           {/* Content */}
           <div 
             className="markdown-content"
             style={{
               fontFamily: 'var(--font-inter), sans-serif',
               fontSize: '1.125rem',
               lineHeight: '1.8',
               color: 'var(--md-sys-color-on-surface)',
               letterSpacing: '0.01em'
             }}
             dangerouslySetInnerHTML={{ __html: post.content_html }}
           />
 
           {/* Footer */}
           <footer style={{
             marginTop: '6rem',
             paddingTop: '3rem',
             borderTop: '1px solid var(--md-sys-color-outline-variant)',
             textAlign: 'center'
           }}>
             <div style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               gap: '2rem',
               flexWrap: 'wrap',
               marginBottom: '2rem'
             }}>
               <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                 Published on {format(new Date(post.published_at), 'MMMM d, yyyy')}
               </span>
               <span style={{ color: 'var(--md-sys-color-outline)' }}>•</span>
               <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                 {post.read_time_minutes} min read
               </span>
               <span style={{ color: 'var(--md-sys-color-outline)' }}>•</span>
               <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                 {post.views} views
               </span>
             </div>
             {post.tags && post.tags.length > 0 && (
               <div style={{
                 display: 'flex',
                 justifyContent: 'center',
                 gap: '0.75rem',
                 flexWrap: 'wrap'
               }}>
                 {post.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      style={{
                        background: 'var(--md-sys-color-secondary-container)',
                        color: 'var(--md-sys-color-on-secondary-container)',
                        padding: '0.5rem 1rem',
                        borderRadius: '2rem',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
               </div>
             )}
           </footer>
         </div>
       </article>
      

    </>
  )
}