import Link from 'next/link'

export default function SiteLayout({
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
            My Site
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
      <footer className="md-surface-container" style={{
        borderTop: '1px solid var(--md-sys-color-outline-variant)',
        padding: '2rem 0',
        textAlign: 'center'
      }}>
        <div className="md-body-medium" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          color: 'var(--md-sys-color-on-surface-variant)'
        }}>
          © {currentYear} My Site. All rights reserved.
        </div>
      </footer>
    </div>
  )
}