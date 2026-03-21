'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import GlowOverlay from '../../../components/GlowOverlay'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/artworks', label: 'Artworks' },
]

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  const isBlogDetailPage = pathname?.startsWith('/blogs/') && pathname !== '/blogs'

  useEffect(() => {
    const root = document.documentElement
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const useDarkTheme = savedTheme ? savedTheme === 'dark' : prefersDark

    root.dataset.theme = useDarkTheme ? 'dark' : 'light'
    setIsDarkMode(useDarkTheme)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme = !isDarkMode
    document.documentElement.dataset.theme = nextTheme ? 'dark' : 'light'
    localStorage.setItem('theme', nextTheme ? 'dark' : 'light')
    setIsDarkMode(nextTheme)
  }

  const headerPadding = useMemo(() => {
    if (isBlogDetailPage || pathname === '/') {
      return 0
    }

    return 88
  }, [isBlogDetailPage, pathname])

  return (
    <div className="site-shell">
      <GlowOverlay />

      {!isBlogDetailPage && (
        <header
          style={{
            position: 'sticky',
            top: '1rem',
            zIndex: 50,
            padding: '1rem 0 0',
          }}
        >
          <div className="site-container">
            <div
              className="glass-panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '0.75rem',
              }}
            >
              <Link
                href="/"
                style={{
                  padding: '0.7rem 1rem',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  color: 'var(--md-sys-color-on-surface)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                WubbaLubbaDoubt
              </Link>

              <nav
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                {navItems.map((item) => {
                  const isActive =
                    item.href === '/'
                      ? pathname === item.href
                      : pathname?.startsWith(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        padding: '0.72rem 1rem',
                        borderRadius: '999px',
                        textDecoration: 'none',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        color: isActive
                          ? 'var(--md-sys-color-on-primary)'
                          : 'var(--md-sys-color-on-surface)',
                        background: isActive
                          ? 'var(--gradient-primary)'
                          : 'transparent',
                        boxShadow: isActive
                          ? '0 14px 28px color-mix(in srgb, var(--md-sys-color-primary) 22%, transparent)'
                          : 'none',
                      }}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              <button
                type="button"
                aria-label="Toggle theme"
                onClick={toggleTheme}
                style={{
                  border: '1px solid var(--md-sys-color-outline)',
                  background: 'color-mix(in srgb, var(--md-sys-color-surface) 92%, white)',
                  color: 'var(--md-sys-color-on-surface)',
                  borderRadius: '999px',
                  minWidth: '2.9rem',
                  minHeight: '2.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {mounted && isDarkMode ? '◐' : '◑'}
              </button>
            </div>
          </div>
        </header>
      )}

      <main
        style={{
          flex: 1,
          paddingTop: headerPadding,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
