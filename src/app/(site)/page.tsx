import Hero from '../../../components/Hero'

export default function HomePage() {
  return (
    <div>
      <Hero />
      


      <section className="md-surface-container-low" style={{
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div className="md-card" style={{
            padding: '2rem'
          }}>
            <h3 className="md-title-large" style={{ marginBottom: '1rem', color: 'var(--md-sys-color-on-surface)' }}>Latest Blog Posts</h3>
            <p className="md-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Read my thoughts on technology, design, and life. Stay updated with the latest insights and tutorials.
            </p>
          </div>
          
          <div className="md-card" style={{
            padding: '2rem'
          }}>
            <h3 className="md-title-large" style={{ marginBottom: '1rem', color: 'var(--md-sys-color-on-surface)' }}>Artwork Gallery</h3>
            <p className="md-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Explore my creative works and visual projects. Each piece tells a story and represents a moment in time.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}