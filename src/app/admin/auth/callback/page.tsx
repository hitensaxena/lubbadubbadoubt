'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { sb } from '../../../../../lib/supabase/client'

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    handleAuthCallback()
  }, [])

  const handleAuthCallback = async () => {
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await sb.auth.getSession()
      
      if (sessionError) {
        throw sessionError
      }

      if (session?.user?.email) {
        // Verify this is the admin email
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'developerhiten@gmail.com'
        
        if (session.user.email.toLowerCase() === adminEmail.toLowerCase()) {
          // Store admin session in localStorage for additional verification
          localStorage.setItem('admin_email', session.user.email.toLowerCase())
          localStorage.setItem('admin_logged_in', 'true')
          
          // Redirect to admin dashboard
          router.push('/admin')
          return
        } else {
          // Not an admin email
          await sb.auth.signOut()
          setError('Unauthorized: This email is not authorized for admin access.')
        }
      } else {
        setError('Authentication failed. Please try logging in again.')
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      setError('Authentication failed. Please try logging in again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="md-surface" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--md-sys-color-outline-variant)',
            borderTop: '3px solid var(--md-sys-color-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface)' }}>
            Authenticating...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div className="md-surface" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div className="md-surface-container-high" style={{
          maxWidth: '400px',
          width: '100%',
          padding: '2rem',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          textAlign: 'center'
        }}>
          <h1 className="md-display-small" style={{
            color: 'var(--md-sys-color-error)',
            marginBottom: '1rem'
          }}>
            Authentication Error
          </h1>
          <p className="md-body-large" style={{
            color: 'var(--md-sys-color-on-surface)',
            marginBottom: '2rem'
          }}>
            {error}
          </p>
          <button
            onClick={() => router.push('/admin/login')}
            className="md-filled-button"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)',
              border: 'none',
              borderRadius: 'var(--md-sys-shape-corner-full)',
              cursor: 'pointer'
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return null
}