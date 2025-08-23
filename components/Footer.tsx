'use client';

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      position: 'relative',
      background: 'var(--surface-container)',
      borderTop: '1px solid var(--outline-variant)',
      marginTop: '4rem',
      overflow: 'hidden'
    }}>
      {/* Subtle gradient background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.04) 0%, transparent 50%)
        `,
        animation: 'fluidFooterMove 30s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 2rem 2rem'
      }}>
        {/* Main footer content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* About section */}
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--on-surface)',
              marginBottom: '1rem',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Creative Developer
            </h3>
            <p style={{
              color: 'var(--on-surface-variant)',
              lineHeight: '1.6',
              fontSize: '0.95rem'
            }}>
              Crafting digital experiences with passion, creativity, and attention to detail. 
              Always exploring new technologies and design possibilities.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--on-surface)',
              marginBottom: '1rem'
            }}>
              Quick Links
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {[
                { name: 'Home', href: '/' },
                { name: 'Blog Posts', href: '/blogs' },
                { name: 'Artworks', href: '/artworks' },
                { name: 'Contact', href: '/contact' }
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  style={{
                    color: 'var(--on-surface-variant)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                    padding: '0.25rem 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--on-surface-variant)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          
          {/* Connect section */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--on-surface)',
              marginBottom: '1rem'
            }}>
              Let&apos;s Connect
            </h4>
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {[
                { name: 'GitHub', icon: '🔗' },
                { name: 'LinkedIn', icon: '💼' },
                { name: 'Twitter', icon: '🐦' },
                { name: 'Email', icon: '📧' }
              ].map((social) => (
                <button
                  key={social.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'var(--surface-container-high)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: '2rem',
                    color: 'var(--on-surface-variant)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary-container)';
                    e.currentTarget.style.color = 'var(--on-primary-container)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--surface-container-high)';
                    e.currentTarget.style.color = 'var(--on-surface-variant)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span>{social.icon}</span>
                  {social.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--outline-variant)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{
            color: 'var(--on-surface-variant)',
            fontSize: '0.9rem',
            margin: 0
          }}>
            © {new Date().getFullYear()} Creative Developer. Made with ❤️ and lots of ☕
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            fontSize: '0.9rem'
          }}>
            <span style={{
              color: 'var(--on-surface-variant)'
            }}>
              Built with Next.js & TypeScript
            </span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fluidFooterMove {
          0%, 100% {
            background-position: 0% 50%, 100% 50%;
          }
          50% {
            background-position: 100% 50%, 0% 50%;
          }
        }
        
        @media (max-width: 768px) {
          footer {
            margin-top: 2rem;
          }
          
          footer > div {
            padding: 2rem 1rem 1.5rem;
          }
          
          footer h3 {
            font-size: 1.1rem;
          }
          
          footer h4 {
            font-size: 1rem;
          }
          
          footer p, footer a {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;