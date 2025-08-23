'use client'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="md-surface" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header className="md-surface-container" style={{
        borderBottom: '1px solid var(--md-sys-color-outline-variant)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Brand */}
          <Link 
            href="/" 
            className="md-title-large"
            style={{
              fontWeight: 'bold',
              color: 'var(--md-sys-color-primary)',
              textDecoration: 'none'
            }}
          >
            WubbaLubbaDoubt
          </Link>

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href="/blogs" className="md-text-button">
              Blogs
            </Link>
            <Link href="/artworks" className="md-text-button">
              Artworks
            </Link>
            <Link href="/admin" className="md-text-button">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
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
            "What you seek is seeking you."
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
        
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}</style>
      </footer>
    </div>
  )
}