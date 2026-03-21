import { createClient } from '../../../../../lib/supabase/server'
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

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function stripDuplicateIntroHeadings(contentHtml: string, title: string, subtitle?: string) {
  let normalizedHtml = contentHtml.trim()

  const titlePattern = new RegExp(
    `^<h1[^>]*>${escapeRegExp(title)}</h1>\\s*`,
    'i'
  )

  normalizedHtml = normalizedHtml.replace(titlePattern, '')

  if (subtitle) {
    const subtitlePattern = new RegExp(
      `^<h2[^>]*>${escapeRegExp(subtitle)}</h2>\\s*`,
      'i'
    )

    normalizedHtml = normalizedHtml.replace(subtitlePattern, '')
  }

  return normalizedHtml
}

function ArticleMeta({
  publishedAt,
  readTime,
  views,
}: {
  publishedAt: string
  readTime: number
  views: number
}) {
  return (
    <div className="article-meta">
      <time dateTime={publishedAt}>{format(new Date(publishedAt), 'MMMM d, yyyy')}</time>
      <span className="article-meta-divider">•</span>
      <span>{readTime} min read</span>
      <span className="article-meta-divider">•</span>
      <span>{views} views</span>
    </div>
  )
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !post) {
    notFound()
  }

  supabase
    .from('posts')
    .update({ views: post.views + 1 })
    .eq('id', post.id)
    .then(() => {})

  const articleHtml = stripDuplicateIntroHeadings(
    post.content_html,
    post.title,
    post.subtitle
  )

  return (
    <div className="article-shell">
      {post.featured_image ? (
        <section className="article-hero">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className="article-hero-overlay" />

          <div className="article-hero-copy">
            <span className="eyebrow" style={{ color: 'rgba(246, 241, 231, 0.9)' }}>
              Article
            </span>
            <h1>{post.title}</h1>
            {post.subtitle ? <p className="subtitle">{post.subtitle}</p> : null}
            <ArticleMeta
              publishedAt={post.published_at}
              readTime={post.read_time_minutes}
              views={post.views}
            />
            {post.tags && post.tags.length > 0 ? (
              <div className="article-tags">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="article-tag">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : (
        <section className="site-section article-simple-hero">
          <div className="site-container">
            <div className="glass-panel">
              <span className="eyebrow">Article</span>
              <h1>{post.title}</h1>
              {post.subtitle ? <p className="subtitle">{post.subtitle}</p> : null}
              <ArticleMeta
                publishedAt={post.published_at}
                readTime={post.read_time_minutes}
                views={post.views}
              />
              {post.tags && post.tags.length > 0 ? (
                <div className="article-tags" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="tag"
                      style={{
                        background:
                          'color-mix(in srgb, var(--md-sys-color-primary-container) 72%, transparent)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      <section className="article-content-wrap">
        <div
          className={`article-content-panel${post.featured_image ? '' : ' article-content-panel--flat'}`}
        >
          <div className="article-content-inner">
            <div className="article-reading-column">
              <div
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: articleHtml }}
              />

              <footer className="article-footer">
                <ArticleMeta
                  publishedAt={post.published_at}
                  readTime={post.read_time_minutes}
                  views={post.views}
                />
                {post.tags && post.tags.length > 0 ? (
                  <div className="tag-row">
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </footer>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
