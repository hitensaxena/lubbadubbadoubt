'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // Hide navigation on blog detail pages
  const isBlogDetailPage = pathname?.startsWith('/blogs/') && pathname !== '/blogs'

  // Theme toggle functionality
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark
    
    setIsDarkMode(shouldUseDark)
    applyTheme(shouldUseDark)
  }, [])

  const applyTheme = (isDark: boolean) => {
    const root = document.documentElement
    
    if (isDark) {
      // Apply dark theme variables - Midnight Blue Spatial Effect
      root.style.setProperty('--md-sys-color-primary', '#8b5cf6')
      root.style.setProperty('--md-sys-color-on-primary', '#0f0a1e')
      root.style.setProperty('--md-sys-color-primary-container', '#1e1b4b')
      root.style.setProperty('--md-sys-color-on-primary-container', '#c7d2fe')
      
      root.style.setProperty('--md-sys-color-secondary', '#06b6d4')
      root.style.setProperty('--md-sys-color-on-secondary', '#0a1929')
      root.style.setProperty('--md-sys-color-secondary-container', '#0c4a6e')
      root.style.setProperty('--md-sys-color-on-secondary-container', '#7dd3fc')
      
      root.style.setProperty('--md-sys-color-tertiary', '#ec4899')
      root.style.setProperty('--md-sys-color-on-tertiary', '#1e0a14')
      root.style.setProperty('--md-sys-color-tertiary-container', '#831843')
      root.style.setProperty('--md-sys-color-on-tertiary-container', '#fce7f3')
      
      root.style.setProperty('--md-sys-color-error', '#ef4444')
      root.style.setProperty('--md-sys-color-on-error', '#1a0a0a')
      root.style.setProperty('--md-sys-color-error-container', '#7f1d1d')
      root.style.setProperty('--md-sys-color-on-error-container', '#fecaca')
      
      root.style.setProperty('--md-sys-color-background', '#020617')
      root.style.setProperty('--md-sys-color-on-background', '#cbd5e1')
      root.style.setProperty('--md-sys-color-surface', '#0f172a')
      root.style.setProperty('--md-sys-color-on-surface', '#e2e8f0')
      root.style.setProperty('--md-sys-color-surface-variant', '#1e293b')
      root.style.setProperty('--md-sys-color-on-surface-variant', '#94a3b8')
      root.style.setProperty('--md-sys-color-outline', '#475569')
      root.style.setProperty('--md-sys-color-outline-variant', '#334155')
      
      root.style.setProperty('--md-sys-color-surface-container-lowest', '#0c0a1f')
      root.style.setProperty('--md-sys-color-surface-container-low', '#1a1a3a')
      root.style.setProperty('--md-sys-color-surface-container', '#262654')
      root.style.setProperty('--md-sys-color-surface-container-high', '#2d2d5f')
      root.style.setProperty('--md-sys-color-surface-container-highest', '#34346b')
      
      root.style.setProperty('--md-sys-color-inverse-surface', '#f1f5f9')
      root.style.setProperty('--md-sys-color-inverse-on-surface', '#0f172a')
      root.style.setProperty('--md-sys-color-inverse-primary', '#4f46e5')
      
      // Dark theme gradients - Deep Spatial Effect
      root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)')
      root.style.setProperty('--gradient-secondary', 'linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)')
      root.style.setProperty('--gradient-tertiary', 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)')
      root.style.setProperty('--gradient-surface', 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)')
      root.style.setProperty('--gradient-background', 'linear-gradient(135deg, #020617 0%, #0f172a 100%)')
    } else {
      // Apply light theme variables
      root.style.setProperty('--md-sys-color-primary', '#8b5cf6')
      root.style.setProperty('--md-sys-color-on-primary', '#ffffff')
      root.style.setProperty('--md-sys-color-primary-container', '#e0e7ff')
      root.style.setProperty('--md-sys-color-on-primary-container', '#4c1d95')
      
      root.style.setProperty('--md-sys-color-secondary', '#06b6d4')
      root.style.setProperty('--md-sys-color-on-secondary', '#ffffff')
      root.style.setProperty('--md-sys-color-secondary-container', '#cffafe')
      root.style.setProperty('--md-sys-color-on-secondary-container', '#0e7490')
      
      root.style.setProperty('--md-sys-color-tertiary', '#f472b6')
      root.style.setProperty('--md-sys-color-on-tertiary', '#ffffff')
      root.style.setProperty('--md-sys-color-tertiary-container', '#fce7f3')
      root.style.setProperty('--md-sys-color-on-tertiary-container', '#be185d')
      
      root.style.setProperty('--md-sys-color-error', '#ef4444')
      root.style.setProperty('--md-sys-color-on-error', '#ffffff')
      root.style.setProperty('--md-sys-color-error-container', '#fecaca')
      root.style.setProperty('--md-sys-color-on-error-container', '#991b1b')
      
      root.style.setProperty('--md-sys-color-background', '#fafafa')
      root.style.setProperty('--md-sys-color-on-background', '#374151')
      root.style.setProperty('--md-sys-color-surface', '#ffffff')
      root.style.setProperty('--md-sys-color-on-surface', '#374151')
      root.style.setProperty('--md-sys-color-surface-variant', '#f3f4f6')
      root.style.setProperty('--md-sys-color-on-surface-variant', '#6b7280')
      root.style.setProperty('--md-sys-color-outline', '#d1d5db')
      root.style.setProperty('--md-sys-color-outline-variant', '#e5e7eb')
      
      root.style.setProperty('--md-sys-color-surface-container-lowest', '#ffffff')
      root.style.setProperty('--md-sys-color-surface-container-low', '#f4f7f7')
      root.style.setProperty('--md-sys-color-surface-container', '#eef1f1')
      root.style.setProperty('--md-sys-color-surface-container-high', '#e8ebeb')
      root.style.setProperty('--md-sys-color-surface-container-highest', '#e3e6e6')
      
      root.style.setProperty('--md-sys-color-inverse-surface', '#2e3131')
      root.style.setProperty('--md-sys-color-inverse-on-surface', '#eff1f1')
      root.style.setProperty('--md-sys-color-inverse-primary', '#4ddadb')
      
      // Light theme gradients
      root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)')
      root.style.setProperty('--gradient-secondary', 'linear-gradient(135deg, #06b6d4 0%, #f472b6 100%)')
      root.style.setProperty('--gradient-tertiary', 'linear-gradient(135deg, #f472b6 0%, #8b5cf6 100%)')
      root.style.setProperty('--gradient-surface', 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)')
      root.style.setProperty('--gradient-background', 'linear-gradient(135deg, #fafafa 0%, #f1f5f9 100%)')
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    applyTheme(newTheme)
  }

  return (
    <>
      <style jsx global>{`
        @keyframes floatAnimation {
           0%, 100% {
             transform: translateY(0px);
           }
           50% {
             transform: translateY(-8px);
           }
         }
         
         @keyframes pulse {
           0%, 100% {
             opacity: 0.6;
             transform: translate(-50%, -50%) scale(1);
           }
           50% {
             opacity: 1;
             transform: translate(-50%, -50%) scale(1.1);
           }
         }
         
         @keyframes themeTransition {
           0% {
             opacity: 0;
             transform: scale(0.8);
           }
           100% {
             opacity: 1;
             transform: scale(1);
           }
         }
      `}</style>
      <div className="md-surface" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
      {/* Sticky Floating Navigation Bar */}
        {!isBlogDetailPage && (
        <header style={{
          position: 'sticky',
          top: '1rem',
          zIndex: 1000,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          animation: 'floatAnimation 6s ease-in-out infinite'
        }}>
        <div style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(2, 6, 23, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isDarkMode 
            ? '1px solid rgba(139, 92, 246, 0.2)'
            : '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '50px',
          padding: '0.5rem 1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(2, 6, 23, 0.5), 0 4px 16px rgba(139, 92, 246, 0.2), 0 12px 48px rgba(139, 92, 246, 0.15)'
            : '0 8px 32px rgba(139, 92, 246, 0.2), 0 4px 16px rgba(6, 182, 212, 0.1), 0 12px 48px rgba(139, 92, 246, 0.15)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          width: 'auto',
          maxWidth: '1200px',
          animation: 'themeTransition 0.6s ease-out'
        }}>
          {/* Navigation */}
          <nav style={{ 
            display: 'flex', 
            gap: '1rem',
            alignItems: 'center'
          }}>
            <Link 
              href="/" 
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '25px',
                color: 'var(--md-sys-color-on-surface)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                background: pathname === '/' 
                  ? (isDarkMode 
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)')
                  : 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
              onMouseEnter={(e) => {
                const hoverBg = isDarkMode 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)'
                e.currentTarget.style.background = hoverBg
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 6px 20px rgba(139, 92, 246, 0.3)'
                  : '0 6px 20px rgba(139, 92, 246, 0.3)'
              }}
              onMouseLeave={(e) => {
                const activeBg = pathname === '/' 
                  ? (isDarkMode 
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)')
                  : 'transparent'
                e.currentTarget.style.background = activeBg
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </Link>
            <Link 
              href="/blogs" 
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '25px',
                color: 'var(--md-sys-color-on-surface)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                background: pathname.startsWith('/blogs') 
                  ? (isDarkMode 
                      ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(34, 211, 238, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)')
                  : 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
              onMouseEnter={(e) => {
                const hoverBg = isDarkMode 
                  ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.3) 0%, rgba(34, 211, 238, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)'
                e.currentTarget.style.background = hoverBg
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 6px 20px rgba(167, 139, 250, 0.3)'
                  : '0 6px 20px rgba(139, 92, 246, 0.3)'
              }}
              onMouseLeave={(e) => {
                const activeBg = pathname.startsWith('/blogs') 
                  ? (isDarkMode 
                      ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(34, 211, 238, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)')
                  : 'transparent'
                e.currentTarget.style.background = activeBg
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Blogs</span>
            </Link>
            <Link 
              href="/artworks" 
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '25px',
                color: 'var(--md-sys-color-on-surface)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                background: pathname.startsWith('/artworks') 
                  ? (isDarkMode 
                      ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(34, 211, 238, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)')
                  : 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
              onMouseEnter={(e) => {
                const hoverBg = isDarkMode 
                  ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.3) 0%, rgba(34, 211, 238, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)'
                e.currentTarget.style.background = hoverBg
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 6px 20px rgba(167, 139, 250, 0.3)'
                  : '0 6px 20px rgba(139, 92, 246, 0.3)'
              }}
              onMouseLeave={(e) => {
                const activeBg = pathname.startsWith('/artworks') 
                  ? (isDarkMode 
                      ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(34, 211, 238, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)')
                  : 'transparent'
                e.currentTarget.style.background = activeBg
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Artworks</span>
            </Link>

          </nav>
        </div>
      </header>
        )}

        {/* Separate Theme Toggle - Top Right */}
        {!isBlogDetailPage && (
          <div style={{
            position: 'sticky',
            top: '1rem',
            right: '1rem',
            zIndex: 1001,
            animation: 'floatAnimation 6s ease-in-out infinite 0.5s',
            marginLeft: 'auto',
            width: 'fit-content'
          }}>
            <button 
              onClick={toggleTheme}
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(2, 6, 23, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: isDarkMode 
                  ? '1px solid rgba(139, 92, 246, 0.2)'
                  : '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '50%',
                padding: '0.75rem',
                color: 'var(--md-sys-color-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3.5rem',
                height: '3.5rem',
                boxShadow: isDarkMode 
                  ? '0 8px 32px rgba(2, 6, 23, 0.5), 0 4px 16px rgba(139, 92, 246, 0.2), 0 12px 48px rgba(139, 92, 246, 0.15)'
                  : '0 8px 32px rgba(139, 92, 246, 0.3), 0 4px 16px rgba(6, 182, 212, 0.2), 0 12px 48px rgba(139, 92, 246, 0.15)',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isDarkMode ? 'rotate(180deg)' : 'rotate(0deg)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                const hoverBg = isDarkMode 
                  ? 'linear-gradient(135deg, rgba(2, 6, 23, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(6, 182, 212, 0.4) 100%)'
                e.currentTarget.style.background = hoverBg
                e.currentTarget.style.transform = `${isDarkMode ? 'rotate(180deg)' : 'rotate(0deg)'} translateY(-4px) scale(1.1)`
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 16px 48px rgba(139, 92, 246, 0.4), 0 8px 24px rgba(6, 182, 212, 0.2)'
                  : '0 16px 48px rgba(139, 92, 246, 0.3), 0 8px 24px rgba(6, 182, 212, 0.2)'
              }}
              onMouseLeave={(e) => {
                const normalBg = isDarkMode 
                  ? 'linear-gradient(135deg, rgba(2, 6, 23, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)'
                e.currentTarget.style.background = normalBg
                e.currentTarget.style.transform = `${isDarkMode ? 'rotate(180deg)' : 'rotate(0deg)'} translateY(0) scale(1)`
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 8px 32px rgba(2, 6, 23, 0.5), 0 4px 16px rgba(139, 92, 246, 0.1)'
                  : '0 8px 32px rgba(139, 92, 246, 0.2), 0 4px 16px rgba(6, 182, 212, 0.1)'
              }}
            >
              {/* Animated background glow */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '120%',
                height: '120%',
                background: isDarkMode 
                  ? 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'pulse 2s ease-in-out infinite',
                zIndex: -1
              }} />
              
              {isDarkMode ? (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                  filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))',
                  transition: 'all 0.3s ease'
                }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                  filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))',
                  transition: 'all 0.3s ease'
                }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        )}

      {/* Main Content */}
      <main style={{ 
        flex: 1,
        paddingTop: isBlogDetailPage ? '0' : '5rem' // Add top padding to account for fixed header
      }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(75, 0, 130, 0.1) 50%, rgba(25, 25, 112, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '3rem 0',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Floating orbs */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '60px',
          height: '60px',
          background: 'radial-gradient(circle, rgba(139, 69, 19, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
          filter: 'blur(1px)'
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '40px',
          height: '40px',
          background: 'radial-gradient(circle, rgba(75, 0, 130, 0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
          filter: 'blur(1px)'
        }} />
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          position: 'relative',
          zIndex: 1
        }}>
          <p style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '1.5rem',
            fontWeight: '500',
            background: 'linear-gradient(135deg, #8B4513 0%, #4B0082 50%, #191970 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            letterSpacing: '0.5px',
            lineHeight: '1.4'
          }}>
            &ldquo;What you seek is seeking you.&rdquo;
          </p>
          <div style={{
            marginTop: '1rem',
            fontSize: '0.875rem',
            color: 'rgba(139, 69, 19, 0.7)',
            fontFamily: 'var(--font-inter)',
            fontWeight: '400'
          }}>
            — Rumi
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}