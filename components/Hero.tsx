import Link from 'next/link'

export default function Hero() {
  return (
    <section className="md-surface" style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem 1rem'
    }}>
      {/* Main Title */}
      <h1 className="md-display-large" style={{
        fontWeight: 'bold',
        color: 'var(--md-sys-color-on-surface)',
        marginBottom: '1rem'
      }}>
        Welcome to My Site
      </h1>

      {/* Subtitle */}
      <p className="md-title-large" style={{
        color: 'var(--md-sys-color-on-surface-variant)',
        marginBottom: '3rem',
        maxWidth: '600px'
      }}>
        Discover my latest thoughts and creative works through blogs and artworks
      </p>

      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link href="/blogs" className="md-filled-button">
          Read Blogs
        </Link>
        
        <Link href="/artworks" className="md-outlined-button">
          View Artworks
        </Link>
      </div>
    </section>
  )
}