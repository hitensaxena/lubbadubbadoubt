'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem 1rem',
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
        {/* Floating Orbs */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '120px',
          height: '120px',
          background: 'var(--gradient-primary)',
          borderRadius: '50%',
          opacity: 0.1,
          animation: 'float 6s ease-in-out infinite',
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }} />
        
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'var(--gradient-secondary)',
          borderRadius: '50%',
          opacity: 0.15,
          animation: 'float 8s ease-in-out infinite reverse',
          transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`
        }} />
        
        <div style={{
          position: 'absolute',
          top: '30%',
          right: '25%',
          width: '60px',
          height: '60px',
          background: 'var(--gradient-tertiary)',
          borderRadius: '50%',
          opacity: 0.12,
          animation: 'float 7s ease-in-out infinite',
          transform: `translate(${mousePosition.x * 0.025}px, ${mousePosition.y * 0.025}px)`
        }} />
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '800px',
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 1s ease-out'
      }}>
        {/* Greeting */}
        <div style={{
          marginBottom: '1rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s ease-out 0.2s'
        }}>
          <span style={{
            fontSize: '1.125rem',
            fontWeight: '500',
            color: 'var(--md-sys-color-primary)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            Hello, I&apos;m
          </span>
        </div>

        {/* Main Title */}
        <h1 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          fontWeight: '400',
          lineHeight: '1.1',
          marginBottom: '1.5rem',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s ease-out 0.4s'
        }}>
          WubbaLubbaDoubt
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
          fontWeight: '300',
          lineHeight: '1.6',
          color: 'var(--md-sys-color-on-surface-variant)',
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s ease-out 0.6s'
        }}>
          Exploring the intersection of{' '}
          <span style={{
            background: 'var(--gradient-secondary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '500'
          }}>
            technology
          </span>
          ,{' '}
          <span style={{
            background: 'var(--gradient-tertiary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '500'
          }}>
            creativity
          </span>
          , and{' '}
          <span style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '500'
          }}>
            curiosity
          </span>
        </p>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s ease-out 0.8s'
        }}>
          <Link 
            href="/blogs" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: 'var(--gradient-primary)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
          >
            <span>📚</span>
            Read My Thoughts
          </Link>
          
          <Link 
            href="/artworks" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: 'transparent',
              color: 'var(--md-sys-color-primary)',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              border: '2px solid var(--md-sys-color-primary)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--md-sys-color-primary)'
              e.currentTarget.style.color = 'white'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--md-sys-color-primary)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span>🎨</span>
            View My Art
          </Link>
        </div>
      </div>



      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        

      `}</style>
    </section>
  )
}