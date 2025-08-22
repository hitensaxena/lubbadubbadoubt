'use client'

import { useEffect, useState } from 'react'
import AdminGuard from '../../../../components/AdminGuard'
import Link from 'next/link'
import { sb } from '../../../../lib/supabase/client'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

interface BlogPost {
  id: string
  title: string
  slug: string
  published: boolean
  created_at: string
}

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = sb
  const router = useRouter()

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, slug, published, created_at')
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) {
          console.error('Error fetching posts:', error)
        } else {
          setPosts(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleDelete = async (postId: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(postId)
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) {
        console.error('Error deleting post:', error)
        alert('Failed to delete post. Please try again.')
      } else {
        // Remove from local state
        setPosts(posts.filter(post => post.id !== postId))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to delete post. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (postId: string) => {
    router.push(`/admin/blogs/${postId}/edit`)
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="md-surface" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div className="md-body-large" style={{ textAlign: 'center', color: 'var(--md-sys-color-on-surface)' }}>Loading posts...</div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="md-surface" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="md-display-small" style={{ fontWeight: 'bold', color: 'var(--md-sys-color-on-surface)', margin: 0 }}>Blog Posts</h1>
            <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.5rem' }}>{posts.length} posts total</p>
          </div>
          <Link 
            href="/admin/blogs/new"
            className="md-filled-button"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </Link>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="md-surface-container" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--md-sys-shape-corner-large)' }}>
            <svg style={{ margin: '0 auto', height: '3rem', width: '3rem', color: 'var(--md-sys-color-on-surface-variant)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="md-headline-medium" style={{ marginTop: '1rem', color: 'var(--md-sys-color-on-surface)' }}>No blog posts</h3>
            <p className="md-body-large" style={{ marginTop: '0.5rem', color: 'var(--md-sys-color-on-surface-variant)' }}>Get started by creating your first blog post.</p>
            <div style={{ marginTop: '2rem' }}>
              <Link 
                href="/admin/blogs/new"
                className="md-filled-button"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create your first post
              </Link>
            </div>
          </div>
        ) : (
          <div className="md-surface-container" style={{ borderRadius: 'var(--md-sys-shape-corner-large)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead className="md-surface-container-high">
                <tr>
                  <th className="md-label-large" style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: '500' }}>
                    Title
                  </th>
                  <th className="md-label-large" style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: '500' }}>
                    Status
                  </th>
                  <th className="md-label-large" style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: '500' }}>
                    Created
                  </th>
                  <th className="md-label-large" style={{ padding: '1rem 1.5rem', textAlign: 'right', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: '500' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div className="md-body-medium" style={{ fontWeight: '500', color: 'var(--md-sys-color-on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '20rem' }}>
                        {post.title}
                      </div>
                      <div className="md-body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        /{post.slug}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <span className="md-label-medium" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--md-sys-shape-corner-full)',
                        backgroundColor: post.published ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-secondary-container)',
                        color: post.published ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-secondary-container)'
                      }}>
                        <span style={{
                          width: '0.375rem',
                          height: '0.375rem',
                          marginRight: '0.375rem',
                          borderRadius: '50%',
                          backgroundColor: post.published ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-secondary)'
                        }}></span>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="md-body-medium" style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', color: 'var(--md-sys-color-on-surface-variant)' }}>
                      {format(new Date(post.created_at), 'MMM d, yyyy')}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {post.published && (
                          <Link 
                            href={`/blogs/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="md-text-button"
                            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', fontSize: '0.75rem' }}
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Preview
                          </Link>
                        )}
                        <button
                          onClick={() => handleEdit(post.id)}
                          className="md-outlined-button"
                          style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.75rem' }}
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deleting === post.id}
                          className="md-filled-button"
                          style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            fontSize: '0.75rem',
                            backgroundColor: 'var(--md-sys-color-error)',
                            color: 'var(--md-sys-color-on-error)',
                            opacity: deleting === post.id ? 0.5 : 1,
                            cursor: deleting === post.id ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {deleting === post.id ? (
                            <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminGuard>
  )
}