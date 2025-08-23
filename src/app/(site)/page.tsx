'use client'
import Hero from '../../../components/Hero'
import { ExperimentIcon, PurposeIcon, FlowIcon, BookIcon, ArtIcon } from '../../../components/AnimatedIcons'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    setIsVisible(true)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {/* Hero Section */}
      <Hero />
      
      {/* Philosophy Section */}
      <section className="section-padding" style={{
        position: 'relative',
        padding: '8rem 2rem',
        background: 'var(--gradient-background)',
        overflow: 'hidden',
        perspective: '1000px'
      }}>
        {/* 3D Floating Elements */}
          <div className="floating-element" style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))',
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: 'morphShape 12s ease-in-out infinite, glowPulse 4s ease-in-out infinite',
            transform: 'translateZ(50px)'
          }} />
        <div className="floating-element" style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.1), rgba(139, 92, 246, 0.1))',
            borderRadius: '50%',
            filter: 'blur(30px)',
            animation: 'breathe 8s ease-in-out infinite reverse',
            transform: 'translateZ(30px)'
          }} />
        {/* Fluid Gradient Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at ${20 + scrollY * 0.01}% ${30 + scrollY * 0.005}%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at ${80 - scrollY * 0.008}% ${70 - scrollY * 0.003}%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
            radial-gradient(circle at ${50 + scrollY * 0.006}% ${20 + scrollY * 0.004}%, rgba(244, 114, 182, 0.06) 0%, transparent 50%)
          `,
          animation: 'fluidMove 20s ease-in-out infinite',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 1s ease-out 0.3s'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '400',
            marginBottom: '2rem',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Philosophy</h2>
          
          <p style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
            lineHeight: '1.8',
            color: 'var(--md-sys-color-on-surface-variant)',
            marginBottom: '3rem',
            fontWeight: '300'
          }}>
            I believe in the power of{' '}
            <span style={{
              background: 'var(--gradient-secondary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '500'
            }}>curiosity-driven exploration</span>{' '}
            and the beauty that emerges when technology meets creativity. Every project is an opportunity to push boundaries, 
            question assumptions, and create something meaningful that resonates with both logic and emotion.
          </p>
          
          <div className="philosophy-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            marginTop: '5rem'
          }}>
            {[
              { 
                icon: <ExperimentIcon size={48} />, 
                title: 'Experimentation', 
                desc: 'Pushing the boundaries of what\'s possible through continuous learning and iteration, embracing failure as a stepping stone to innovation.' 
              },
              { 
                icon: <PurposeIcon size={48} />, 
                title: 'Purpose', 
                desc: 'Every line of code and creative decision serves a meaningful purpose in the larger vision, creating value that resonates with users.' 
              },
              { 
                icon: <FlowIcon size={48} />, 
                title: 'Flow', 
                desc: 'Creating experiences that feel natural, intuitive, and effortlessly engaging, where technology becomes invisible and joy emerges.' 
              }
            ].map((item, index) => (
              <div 
                key={index} 
                style={{
                  padding: '2.5rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isVisible ? 'translateY(0) translateZ(0px) rotateX(1deg)' : 'translateY(40px) translateZ(0px) rotateX(1deg)',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${0.6 + index * 0.15}s`,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transformStyle: 'preserve-3d'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02) translateZ(15px) rotateX(-3deg)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1) translateZ(0px) rotateX(1deg)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                {/* Subtle gradient overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(6, 182, 212, 0.03) 100%)`,
                  pointerEvents: 'none'
                }} />
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginBottom: '1.5rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {item.icon}
                </div>
                
                <h3 style={{
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: '1.375rem',
                  fontWeight: '500',
                  marginBottom: '1rem',
                  color: 'var(--md-sys-color-primary)',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>{item.title}</h3>
                
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.7',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  opacity: 0.9,
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Work Section */}
      <section className="section-padding" style={{
        position: 'relative',
        padding: '8rem 2rem',
        background: 'var(--gradient-surface)',
        overflow: 'hidden',
        perspective: '1200px'
      }}>
        {/* 3D Geometric Elements */}
         <div className="floating-element" style={{
           position: 'absolute',
           top: '20%',
           right: '10%',
           width: '120px',
           height: '120px',
           background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.08))',
           transform: 'rotateX(45deg) rotateY(45deg) translateZ(100px)',
           borderRadius: '20px',
           filter: 'blur(20px)',
           animation: 'rotate3D 20s linear infinite, glowPulse 6s ease-in-out infinite'
         }} />
         <div className="floating-element" style={{
           position: 'absolute',
           bottom: '15%',
           left: '8%',
           width: '90px',
           height: '90px',
           background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(139, 92, 246, 0.08))',
           transform: 'rotateX(-30deg) rotateY(60deg) translateZ(80px)',
           borderRadius: '50%',
           filter: 'blur(25px)',
           animation: 'breathe 7s ease-in-out infinite'
         }} />
        {/* Fluid Gradient Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at ${70 - scrollY * 0.01}% ${40 + scrollY * 0.008}%, rgba(6, 182, 212, 0.12) 0%, transparent 60%),
            radial-gradient(circle at ${30 + scrollY * 0.007}% ${80 - scrollY * 0.005}%, rgba(244, 114, 182, 0.08) 0%, transparent 50%)
          `,
          animation: 'fluidMove 25s ease-in-out infinite reverse',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: '400',
              marginBottom: '1rem',
              background: 'var(--gradient-secondary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Recent Work</h2>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--md-sys-color-on-surface-variant)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>A showcase of my latest projects, experiments, and creative explorations</p>
          </div>
          
          <div className="work-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                title: 'Blog Platform',
                desc: 'A modern, responsive blogging platform with rich text editing, seamless user experience, and advanced content management capabilities.',
                tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX'],
                icon: <BookIcon size={52} />,
                gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)'
              },
              {
                title: 'Digital Art Gallery',
                desc: 'An immersive gallery showcasing digital artworks with interactive 3D elements, smooth animations, and curated collections.',
                tech: ['React', 'Three.js', 'GSAP', 'WebGL'],
                icon: <ArtIcon size={52} />,
                gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
              }
            ].map((work, index) => (
              <div 
                key={index}
                style={{
                  padding: '3rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  transform: scrollY > 800 ? 'translateY(0) translateZ(0px) rotateX(2deg)' : 'translateY(50px) translateZ(0px) rotateX(2deg)',
                  opacity: scrollY > 800 ? 1 : 0,
                  transitionDelay: `${0.3 + index * 0.2}s`,
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  transformStyle: 'preserve-3d'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02) translateZ(20px) rotateX(-2deg)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(139, 92, 246, 0.2)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1) translateZ(0px) rotateX(2deg)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                {/* Dynamic gradient overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: work.gradient,
                  pointerEvents: 'none'
                }} />
                
                {/* Animated background pattern */}
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200%',
                  height: '200%',
                  background: `radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)`,
                  animation: 'workItemFloat 8s ease-in-out infinite',
                  pointerEvents: 'none'
                }} />
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginBottom: '2rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {work.icon}
                </div>
                
                <h3 style={{
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '1.25rem',
                  color: 'var(--md-sys-color-primary)',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>{work.title}</h3>
                
                <p style={{
                  fontSize: '1.05rem',
                  lineHeight: '1.7',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  opacity: 0.9,
                  marginBottom: '2rem',
                  textAlign: 'center',
                  flex: 1,
                  position: 'relative',
                  zIndex: 1
                }}>{work.desc}</p>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {work.tech.map((tech, techIndex) => (
                    <span key={techIndex} style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(139, 92, 246, 0.15)',
                      borderRadius: '16px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      color: 'var(--md-sys-color-primary)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}>{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotes Section */}
       <section className="section-padding" style={{
         position: 'relative',
         padding: '10rem 2rem',
         background: 'var(--gradient-background)',
         overflow: 'hidden',
         minHeight: '100vh',
         display: 'flex',
         alignItems: 'center',
         perspective: '1000px'
       }}>
         {/* 3D Abstract Elements */}
          <div className="floating-element" style={{
            position: 'absolute',
            top: '25%',
            left: '5%',
            width: '150px',
            height: '150px',
            background: 'conic-gradient(from 0deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1), rgba(244, 114, 182, 0.1))',
            borderRadius: '50%',
            filter: 'blur(50px)',
            animation: 'gradientShift 15s linear infinite',
            transform: 'translateZ(60px)'
          }} />
          <div className="floating-element" style={{
            position: 'absolute',
            bottom: '20%',
            right: '8%',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
            borderRadius: '30%',
            filter: 'blur(35px)',
            animation: 'pulse 4s ease-in-out infinite',
            transform: 'rotateX(30deg) translateZ(40px)'
          }} />
        {/* Fluid Gradient Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at ${40 + scrollY * 0.005}% ${60 - scrollY * 0.007}%, rgba(244, 114, 182, 0.1) 0%, transparent 50%),
            radial-gradient(circle at ${90 - scrollY * 0.009}% ${20 + scrollY * 0.006}%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)
          `,
          animation: 'fluidMove 30s ease-in-out infinite',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '400',
            marginBottom: '4rem',
            background: 'var(--gradient-tertiary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Words That Inspire</h2>
          
          <div className="quotes-grid" style={{
            display: 'grid',
            gap: '4rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {[
              {
                quote: "The best way to predict the future is to create it.",
                author: "Peter Drucker",
                context: "On innovation and forward-thinking"
              },
              {
                quote: "Simplicity is the ultimate sophistication.",
                author: "Leonardo da Vinci",
                context: "On design and elegance"
              },
              {
                quote: "Code is poetry written for machines to understand and humans to admire.",
                author: "Anonymous",
                context: "On the art of programming"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="card-padding"
                style={{
                  padding: '4rem 3rem',
                  background: `
                    linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%),
                    radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
                  `,
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(25px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  transform: scrollY > 1200 ? 'translateY(0) translateZ(0px)' : 'translateY(40px) translateZ(0px)',
                  opacity: scrollY > 1200 ? 1 : 0,
                  transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: `${0.2 + index * 0.15}s`,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transformStyle: 'preserve-3d'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02) translateZ(10px)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.background = `
                    linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%),
                    radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)
                  `;
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1) translateZ(0px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = `
                    linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%),
                    radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
                  `;
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                {/* Enhanced gradient overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(6, 182, 212, 0.03) 50%, rgba(244, 114, 182, 0.02) 100%),
                    radial-gradient(circle at 70% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 40%)
                  `,
                  pointerEvents: 'none'
                }} />
                <blockquote style={{
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: 'clamp(1.375rem, 3.5vw, 2rem)',
                  fontStyle: 'italic',
                  lineHeight: '1.7',
                  color: 'var(--md-sys-color-on-surface)',
                  marginBottom: '2rem',
                  fontWeight: '300',
                  position: 'relative',
                  zIndex: 1,
                  textAlign: 'center'
                }}>
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <cite style={{
                  display: 'block',
                  fontSize: '1.125rem',
                  color: 'var(--md-sys-color-primary)',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  position: 'relative',
                  zIndex: 1,
                  textAlign: 'center'
                }}>— {item.author}</cite>
                <p style={{
                  fontSize: '1rem',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  opacity: 0.8,
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 1,
                  textAlign: 'center'
                }}>{item.context}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        padding: '4rem 2rem 2rem',
        background: 'var(--gradient-surface)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Subtle Gradient Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: '1.5rem',
              marginBottom: '1rem',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>WubbaLubbaDoubt</h3>
            <p style={{
              color: 'var(--md-sys-color-on-surface-variant)',
              fontSize: '1rem',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Exploring the intersection of technology, creativity, and curiosity.
            </p>
          </div>
          
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '2rem',
            fontSize: '0.875rem',
            color: 'var(--md-sys-color-on-surface-variant)',
            opacity: 0.7
          }}>
            <p>© 2024 WubbaLubbaDoubt. Crafted with curiosity and code.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fluidMove {
          0%, 100% { 
            transform: translateX(0) translateY(0) scale(1);
          }
          25% { 
            transform: translateX(10px) translateY(-15px) scale(1.05);
          }
          50% { 
            transform: translateX(-5px) translateY(-10px) scale(0.95);
          }
          75% { 
            transform: translateX(-10px) translateY(5px) scale(1.02);
          }
        }
        
        @keyframes workItemFloat {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -10px) rotate(1deg);
          }
          50% {
            transform: translate(-5px, -15px) rotate(-1deg);
          }
          75% {
            transform: translate(-10px, 5px) rotate(0.5deg);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes rotate3D {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          33% { transform: rotateX(15deg) rotateY(15deg) rotateZ(5deg); }
          66% { transform: rotateX(-10deg) rotateY(-10deg) rotateZ(-3deg); }
          100% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
        }
        
        @keyframes morphShape {
          0%, 100% { border-radius: 50%; transform: scale(1); }
          25% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: scale(1.1); }
          50% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; transform: scale(0.9); }
          75% { border-radius: 40% 60% 60% 40% / 60% 40% 40% 60%; transform: scale(1.05); }
        }
        
        @keyframes glowPulse {
           0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
           50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6), 0 0 60px rgba(6, 182, 212, 0.3); }
         }
         
         /* Mobile Optimizations */
         @media (max-width: 768px) {
           .philosophy-grid {
             grid-template-columns: 1fr !important;
             gap: 1.5rem !important;
           }
           
           .work-grid {
             grid-template-columns: 1fr !important;
             gap: 2rem !important;
           }
           
           .quotes-grid {
             grid-template-columns: 1fr !important;
             gap: 1.5rem !important;
           }
           
           .floating-element {
             display: none !important;
           }
           
           .section-padding {
             padding: 4rem 1rem !important;
           }
           
           .hero-content {
             padding: 2rem 1rem !important;
           }
         }
         
         @media (max-width: 480px) {
           .section-padding {
             padding: 3rem 1rem !important;
           }
           
           .card-padding {
             padding: 2rem 1.5rem !important;
           }
         }
      `}</style>
    </div>
  )
}