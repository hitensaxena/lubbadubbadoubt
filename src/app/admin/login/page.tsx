'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { sb } from '../../../../lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Check if the email matches the admin email from environment
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'developerhiten@gmail.com'
      
      if (email.toLowerCase().trim() !== adminEmail.toLowerCase()) {
        setError('Invalid admin email. Please check your email address.')
        return
      }

      // Send magic link for authentication
      const { error } = await sb.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/admin/auth/callback`
        }
      })

      if (error) {
        throw error
      }

      // Show success message
      setError('')
      alert('Magic link sent! Please check your email and click the link to complete login.')
      
    } catch (error) {
      console.error('Login error:', error)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
        borderRadius: 'var(--md-sys-shape-corner-large)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 className="md-display-small" style={{
            color: 'var(--md-sys-color-on-surface)',
            marginBottom: '0.5rem'
          }}>
            Admin Login
          </h1>
          <p className="md-body-large" style={{
            color: 'var(--md-sys-color-on-surface-variant)'
          }}>
            Enter your admin email to access the dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="email" 
              className="md-body-large"
              style={{
                display: 'block',
                fontWeight: '500',
                color: 'var(--md-sys-color-on-surface)',
                marginBottom: '0.5rem'
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="md-body-large"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: 'var(--md-sys-shape-corner-small)',
                backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                color: 'var(--md-sys-color-on-surface)',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--md-sys-color-primary)'
                e.target.style.boxShadow = '0 0 0 2px var(--md-sys-color-primary-container)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--md-sys-color-outline)'
                e.target.style.boxShadow = 'none'
              }}
              placeholder="Enter your admin email"
            />
          </div>

          {error && (
            <div className="md-surface-container" style={{
              padding: '0.75rem',
              backgroundColor: 'var(--md-sys-color-error-container)',
              border: '1px solid var(--md-sys-color-error)',
              borderRadius: 'var(--md-sys-shape-corner-small)',
              marginBottom: '1.5rem'
            }}>
              <p className="md-body-medium" style={{
                color: 'var(--md-sys-color-on-error-container)',
                margin: 0
              }}>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="md-filled-button"
            style={{
              width: '100%',
              backgroundColor: loading || !email.trim() ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-primary)',
              color: loading || !email.trim() ? 'var(--md-sys-color-surface-variant)' : 'var(--md-sys-color-on-primary)',
              cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !email.trim() ? 0.6 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center'
        }}>
          <Link 
            href="/"
            className="md-text-button"
            style={{
              color: 'var(--md-sys-color-on-surface-variant)',
              textDecoration: 'none'
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}