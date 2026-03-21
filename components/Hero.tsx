'use client'

import Link from 'next/link'
import ThreeDBackground from './ThreeDBackground'

export default function Hero() {
  return (
    <section
      className="site-section landing-hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ThreeDBackground />

      <div className="site-container hero-grid landing-hero-grid" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-copy">
          <span className="eyebrow">Personal site and creative lab</span>

          <h1>
            Clean ideas,
            <br />
            thoughtful code,
            <br />
            visual curiosity.
          </h1>

          <p className="lede">
            WubbaLubbaDoubt is where writing, experiments, and digital artwork meet.
            The goal is simple: make every page feel calm, sharp, and memorable.
          </p>

          <div className="button-row">
            <Link href="/blogs" className="button-primary">
              Explore the writing
            </Link>
            <Link href="/artworks" className="button-secondary">
              View the gallery
            </Link>
          </div>

          <div className="stat-grid landing-stat-grid">
            <div className="soft-card stat-card">
              <strong>Essays</strong>
              <p>Long-form thinking on design, technology, and creative process.</p>
            </div>
            <div className="soft-card stat-card">
              <strong>Visuals</strong>
              <p>Artwork and image-making with a polished, gallery-first presentation.</p>
            </div>
            <div className="soft-card stat-card">
              <strong>Experiments</strong>
              <p>Interfaces, interactions, and small ideas refined until they feel right.</p>
            </div>
          </div>
        </div>

        <aside className="glass-panel hero-accent landing-hero-aside">
          <div className="hero-orb" />

          <div style={{ display: 'grid', gap: '0.85rem' }}>
            <span className="pill">Editorial clarity</span>
            <span className="pill">Warm, restrained color</span>
            <span className="pill">Fluid motion without noise</span>
          </div>
        </aside>
      </div>
    </section>
  )
}
