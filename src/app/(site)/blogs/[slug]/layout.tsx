'use client'
import Link from 'next/link'

export default function BlogDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        html, body {
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
      <div className="md-surface" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>


        {/* Back Button - Positioned as overlay */}
        <Link
          href="/blogs"
          style={{
            position: 'fixed',
            top: '2rem',
            left: '2rem',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50px',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '500',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Blogs</span>
        </Link>

        {/* Main Content */}
        <main style={{
          flex: 1
        }}>
          {children}
        </main>
      </div>
    </>
  )
}