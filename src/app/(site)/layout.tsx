'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Hide navigation on blog detail pages
  const isBlogDetailPage = pathname?.startsWith('/blogs/') && pathname !== '/blogs'

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
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50px',
          padding: '0.5rem 1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          width: 'auto',
          maxWidth: '1200px'
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
                background: pathname === '/' ? 'rgba(147, 51, 234, 0.1)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = pathname === '/' ? 'rgba(147, 51, 234, 0.1)' : 'transparent'
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
                background: pathname.startsWith('/blogs') ? 'rgba(147, 51, 234, 0.1)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = pathname.startsWith('/blogs') ? 'rgba(147, 51, 234, 0.1)' : 'transparent'
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
                background: pathname.startsWith('/artworks') ? 'rgba(147, 51, 234, 0.1)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = pathname.startsWith('/artworks') ? 'rgba(147, 51, 234, 0.1)' : 'transparent'
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Artworks</span>
            </Link>
            <Link 
              href="/admin" 
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '25px',
                color: 'var(--md-sys-color-on-surface)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                background: pathname.startsWith('/admin') ? 'rgba(147, 51, 234, 0.1)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = pathname.startsWith('/admin') ? 'rgba(147, 51, 234, 0.1)' : 'transparent'
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Admin</span>
            </Link>
            <button 
              style={{
                padding: '0.375rem',
                borderRadius: '50%',
                color: 'var(--md-sys-color-on-surface)',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </nav>
        </div>
      </header>
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