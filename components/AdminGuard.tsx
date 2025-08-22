'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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

  const checkAdminAuth = () => {
    try {
      const adminLoggedIn = localStorage.getItem('admin_logged_in')
      const adminEmail = localStorage.getItem('admin_email')
      
      if (adminLoggedIn === 'true' && adminEmail) {
        setIsAdmin(true)
      } else {
        // Redirect to login page
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error checking admin auth:', error)
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