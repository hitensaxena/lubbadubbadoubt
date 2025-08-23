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
      padding: '0 1rem 2rem 1rem',
      margin: '0',
      background: 'var(--gradient-surface)',
      overflow: 'hidden'
    }}>
      {/* Fluid Gradient Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at ${30 + mousePosition.x * 0.02}% ${40 + mousePosition.y * 0.015}%, rgba(139, 92, 246, 0.15) 0%, transparent 60%),
          radial-gradient(circle at ${70 - mousePosition.x * 0.01}% ${60 - mousePosition.y * 0.01}%, rgba(6, 182, 212, 0.12) 0%, transparent 50%),
          radial-gradient(circle at ${50 + mousePosition.x * 0.008}% ${20 + mousePosition.y * 0.012}%, rgba(244, 114, 182, 0.1) 0%, transparent 55%),
          radial-gradient(circle at ${20 - mousePosition.x * 0.005}% ${80 + mousePosition.y * 0.008}%, rgba(139, 92, 246, 0.08) 0%, transparent 45%)
        `,
        animation: 'fluidHeroMove 25s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '800px',
        margin: '0 auto',
        transform: isVisible ? 'translateY(0) translateZ(0px)' : 'translateY(30px) translateZ(0px)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
        transformStyle: 'preserve-3d',
        filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1))'
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
              e.currentTarget.style.transform = 'translateY(-4px) translateZ(10px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 92, 246, 0.3), 0 4px 20px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(59, 130, 246, 1) 100%)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) translateZ(0px) scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.background = 'var(--gradient-primary)'
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
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)'
              e.currentTarget.style.color = 'var(--md-sys-color-primary)'
              e.currentTarget.style.transform = 'translateY(-4px) translateZ(8px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(139, 92, 246, 0.2)'
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.8)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--md-sys-color-primary)'
              e.currentTarget.style.transform = 'translateY(0) translateZ(0px) scale(1)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = 'var(--md-sys-color-primary)'
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
        
        @keyframes fluidHeroMove {
          0%, 100% {
            background-position: 0% 50%, 100% 50%, 50% 0%, 0% 100%;
          }
          25% {
            background-position: 25% 25%, 75% 75%, 75% 25%, 25% 75%;
          }
          50% {
            background-position: 50% 0%, 50% 100%, 100% 50%, 0% 50%;
          }
          75% {
            background-position: 75% 75%, 25% 25%, 25% 75%, 75% 25%;
          }
        }
        

      `}</style>
    </section>
  )
}