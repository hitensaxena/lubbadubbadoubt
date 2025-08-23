'use client'
import Hero from '../../../components/Hero'

export default function HomePage() {
  return (
    <div>
      <Hero />
      


      <section style={{
        position: 'relative',
        padding: '4rem 2rem',
        background: 'var(--gradient-surface)',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '20%',
            width: '100px',
            height: '100px',
            background: 'var(--gradient-secondary)',
            borderRadius: '50%',
            opacity: 0.08,
            animation: 'float 8s ease-in-out infinite'
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '15%',
            width: '60px',
            height: '60px',
            background: 'var(--gradient-tertiary)',
            borderRadius: '50%',
            opacity: 0.1,
            animation: 'float 6s ease-in-out infinite reverse'
          }} />
        </div>

        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          <div className="glass-effect" style={{
            padding: '2.5rem',
            background: 'var(--gradient-surface)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)'
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '1rem'
            }}>📚</div>
            <h3 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: '1.75rem',
              fontWeight: '400',
              marginBottom: '1rem',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Latest Blog Posts</h3>
            <p style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '1rem',
              lineHeight: '1.6',
              color: 'var(--md-sys-color-on-surface-variant)',
              opacity: 0.9
            }}>
              Read my thoughts on{' '}
              <span style={{
                background: 'var(--gradient-secondary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '500'
              }}>technology</span>,{' '}
              <span style={{
                background: 'var(--gradient-tertiary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '500'
              }}>design</span>, and life. Stay updated with the latest insights and tutorials.
            </p>
          </div>
          
          <div className="glass-effect" style={{
            padding: '2.5rem',
            background: 'var(--gradient-surface)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)'
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '1rem'
            }}>🎨</div>
            <h3 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: '1.75rem',
              fontWeight: '400',
              marginBottom: '1rem',
              background: 'var(--gradient-secondary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Artwork Gallery</h3>
            <p style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '1rem',
              lineHeight: '1.6',
              color: 'var(--md-sys-color-on-surface-variant)',
              opacity: 0.9
            }}>
              Explore my{' '}
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '500'
              }}>creative works</span>{' '}
              and visual projects. Each piece tells a story and represents a moment in time.
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(180deg); }
          }
        `}</style>
      </section>
    </div>
  )
}