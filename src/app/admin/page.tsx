'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminGuard from '../../../components/AdminGuard'
import { sb } from '../../../lib/supabase/client'
import Link from 'next/link'

interface RecentPost {
  id: string
  title: string
  created_at: string
  published: boolean
}

interface RecentArtwork {
  id: string
  title: string
  created_at: string
}

export default function AdminDashboard() {
  const [postsCount, setPostsCount] = useState<number | null>(null)
  const [artworksCount, setArtworksCount] = useState<number | null>(null)
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [recentArtworks, setRecentArtworks] = useState<RecentArtwork[]>([])
  const router = useRouter()
  
  useEffect(() => {
    fetchDashboardData()
  }, [])
  
  const fetchDashboardData = async () => {
    try {
      const [
        postsResult, 
        artworksResult,
        recentPostsResult,
        recentArtworksResult
      ] = await Promise.all([
        sb.from('posts').select('*', { head: true, count: 'exact' }),
        sb.from('artworks').select('*', { head: true, count: 'exact' }),
        sb.from('posts').select('id, title, created_at, published').order('created_at', { ascending: false }).limit(3),
        sb.from('artworks').select('id, title, created_at').order('created_at', { ascending: false }).limit(3)
      ])
      
      setPostsCount(postsResult.count)
      setArtworksCount(artworksResult.count)
      setRecentPosts(recentPostsResult.data || [])
      setRecentArtworks(recentArtworksResult.data || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in')
    localStorage.removeItem('admin_email')
    router.push('/admin/login')
  }
  
  // Crude DB health check
  const dbStatus = (postsCount !== null && artworksCount !== null) ? 'Connected' : 'Disconnected'

  return (
    <AdminGuard>
      <div className="md-surface" style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 className="md-display-small" style={{
            fontWeight: 'bold',
            color: 'var(--md-sys-color-on-surface)',
            margin: 0
          }}>
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="md-filled-button"
            style={{
              backgroundColor: 'var(--md-sys-color-error)',
              color: 'var(--md-sys-color-on-error)'
            }}
          >
            Logout
          </button>
        </div>

        {/* Status Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {/* Database Status Card */}
          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            backgroundColor: dbStatus === 'Connected' ? '#f0f9ff' : '#fef2f2',
            borderColor: dbStatus === 'Connected' ? '#0ea5e9' : '#ef4444'
          }}>
            <h3 className="md-title-medium" style={{
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--md-sys-color-on-surface)'
            }}>
              Database Status
            </h3>
            <p className="md-headline-small" style={{
              fontWeight: 'bold',
              color: dbStatus === 'Connected' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-error)'
            }}>
              {dbStatus}
            </p>
          </div>

          {/* Posts Count Card */}
          <div className="md-card" style={{
            padding: '1.5rem'
          }}>
            <h3 className="md-title-medium" style={{
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--md-sys-color-on-surface)'
            }}>
              Total Posts
            </h3>
            <p className="md-headline-medium" style={{
              fontWeight: 'bold',
              color: 'var(--md-sys-color-primary)'
            }}>
              {postsCount ?? 'N/A'}
            </p>
          </div>

          {/* Artworks Count Card */}
          <div className="md-card" style={{
            padding: '1.5rem'
          }}>
            <h3 className="md-title-medium" style={{
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--md-sys-color-on-surface)'
            }}>
              Total Artworks
            </h3>
            <p className="md-headline-medium" style={{
              fontWeight: 'bold',
              color: 'var(--md-sys-color-secondary)'
            }}>
              {artworksCount ?? 'N/A'}
            </p>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <Link
            href="/admin/blogs/new"
            className="md-filled-button"
            style={{
              display: 'flex',
              padding: '1.5rem',
              textAlign: 'center',
              textDecoration: 'none',
              backgroundColor: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)',
              borderRadius: '12px',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <svg style={{ width: '2rem', height: '2rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Create Post</span>
            <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Write a new blog post</span>
          </Link>

          <Link
            href="/admin/artworks/new"
            className="md-filled-button"
            style={{
              display: 'flex',
              padding: '1.5rem',
              textAlign: 'center',
              textDecoration: 'none',
              backgroundColor: 'var(--md-sys-color-secondary)',
              color: 'var(--md-sys-color-on-secondary)',
              borderRadius: '12px',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <svg style={{ width: '2rem', height: '2rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Upload Artwork</span>
            <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Add new piece to gallery</span>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Recent Blogs */}
          <div className="md-surface-container" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="md-title-large" style={{ fontWeight: 'bold', margin: 0, color: 'var(--md-sys-color-on-surface)' }}>
                Recent Blogs
              </h3>
              <Link href="/admin/blogs" style={{ color: 'var(--md-sys-color-primary)', textDecoration: 'none', fontWeight: 500 }}>
                View All
              </Link>
            </div>
            
            {recentPosts.length === 0 ? (
              <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>No posts yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentPosts.map(post => (
                  <div key={post.id} style={{
                    padding: '1rem',
                    backgroundColor: 'var(--md-sys-color-surface)',
                    border: '1px solid var(--md-sys-color-outline-variant)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: '600', color: 'var(--md-sys-color-on-surface)' }}>{post.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      {post.published ? (
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)', borderRadius: '4px' }}>Published</span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--md-sys-color-secondary-container)', color: 'var(--md-sys-color-on-secondary-container)', borderRadius: '4px' }}>Draft</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Artworks */}
          <div className="md-surface-container" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="md-title-large" style={{ fontWeight: 'bold', margin: 0, color: 'var(--md-sys-color-on-surface)' }}>
                Recent Artworks
              </h3>
              <Link href="/admin/artworks" style={{ color: 'var(--md-sys-color-secondary)', textDecoration: 'none', fontWeight: 500 }}>
                View All
              </Link>
            </div>
            
            {recentArtworks.length === 0 ? (
              <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>No artworks yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentArtworks.map(artwork => (
                  <div key={artwork.id} style={{
                    padding: '1rem',
                    backgroundColor: 'var(--md-sys-color-surface)',
                    border: '1px solid var(--md-sys-color-outline-variant)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: '600', color: 'var(--md-sys-color-on-surface)' }}>{artwork.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {new Date(artwork.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}