'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { sb } from '../lib/supabase/client'

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      // Check localStorage first
      const adminLoggedIn = localStorage.getItem('admin_logged_in')
      const adminEmail = localStorage.getItem('admin_email')
      
      if (adminLoggedIn !== 'true' || !adminEmail) {
        router.push('/admin/login')
        return
      }

      // Verify Supabase session
      const { data: { session }, error } = await sb.auth.getSession()
      
      if (error) {
        console.error('Error checking Supabase session:', error)
        // Clear localStorage and redirect
        localStorage.removeItem('admin_logged_in')
        localStorage.removeItem('admin_email')
        router.push('/admin/login')
        return
      }

      // Check if user is authenticated with Supabase and email matches
      const adminEmailEnv = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'developerhiten@gmail.com'
      
      if (session?.user?.email?.toLowerCase() === adminEmailEnv.toLowerCase() && 
          session.user.email.toLowerCase() === adminEmail.toLowerCase()) {
        setIsAdmin(true)
      } else {
        // Clear localStorage and redirect if session doesn't match
        localStorage.removeItem('admin_logged_in')
        localStorage.removeItem('admin_email')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error checking admin auth:', error)
      localStorage.removeItem('admin_logged_in')
      localStorage.removeItem('admin_email')
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: '1.1rem',
        color: '#666'
      }}>
        Loading...
      </div>
    )
  }

  if (!isAdmin) {
    // This will be handled by the redirect in checkAdminAuth
    return null
  }

  return <>{children}</>
}