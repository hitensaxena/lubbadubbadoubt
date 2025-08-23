'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminGuard from '../../../components/AdminGuard'
import { sb } from '../../../lib/supabase/client'
import Link from 'next/link'

export default function AdminDashboard() {
  const [postsCount, setPostsCount] = useState<number | null>(null)
  const [artworksCount, setArtworksCount] = useState<number | null>(null)
  const router = useRouter()
  
  useEffect(() => {
    fetchCounts()
  }, [])
  
  const fetchCounts = async () => {
    try {
      const [postsResult, artworksResult] = await Promise.all([
        sb.from('posts').select('*', { head: true, count: 'exact' }),
        sb.from('artworks').select('*', { head: true, count: 'exact' })
      ])
      
      setPostsCount(postsResult.count)
      setArtworksCount(artworksResult.count)
    } catch (error) {
      console.error('Error fetching counts:', error)
    } finally {
      // Counts fetched
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

        {/* Navigation Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <Link
            href="/admin/blogs"
            className="md-filled-button"
            style={{
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              backgroundColor: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)'
            }}
          >
            Manage Blogs
          </Link>

          <Link
            href="/admin/blogs/new"
            className="md-filled-button"
            style={{
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              backgroundColor: 'var(--md-sys-color-secondary)',
              color: 'var(--md-sys-color-on-secondary)'
            }}
          >
            New Blog Post
          </Link>

          <Link
            href="/admin/artworks"
            className="md-filled-button"
            style={{
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              backgroundColor: 'var(--md-sys-color-tertiary)',
              color: 'var(--md-sys-color-on-tertiary)'
            }}
          >
            Manage Artworks
          </Link>

          <Link
            href="/admin/artworks/new"
            className="md-outlined-button"
            style={{
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none'
            }}
          >
            New Artwork
          </Link>
        </div>
      </div>
    </AdminGuard>
  )
}