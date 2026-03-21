'use client'

import Link from 'next/link'
import Hero from '../../../components/Hero'
import {
  BookIcon,
  ExperimentIcon,
  FlowIcon,
  PurposeIcon,
} from '../../../components/AnimatedIcons'

const principles = [
  {
    icon: <ExperimentIcon size={32} />,
    title: 'Curiosity over noise',
    description:
      'Every project starts with a clear question, then gets reduced until the core idea feels effortless.',
  },
  {
    icon: <PurposeIcon size={32} />,
    title: 'Design with purpose',
    description:
      'Typography, spacing, and color should quietly support the story instead of competing with it.',
  },
  {
    icon: <FlowIcon size={32} />,
    title: 'Movement with restraint',
    description:
      'Interaction should add rhythm and confidence, never distraction or visual clutter.',
  },
]

const highlights = [
  {
    title: 'Writing and ideas',
    body:
      'Thoughtful articles, reflections, and documentation shaped with an editorial reading experience in mind.',
    tags: ['Essays', 'Notes', 'Process'],
  },
  {
    title: 'Artwork and image worlds',
    body:
      'A gallery presentation for visual work that stays immersive while keeping the interface quiet and refined.',
    tags: ['Gallery', 'Collections', 'Visual identity'],
  },
]

const quotes = [
  {
    quote: 'Simplicity is the ultimate sophistication.',
    author: 'Leonardo da Vinci',
  },
  {
    quote: 'The best way to predict the future is to create it.',
    author: 'Peter Drucker',
  },
  {
    quote: 'Good work feels inevitable once it is finally clear.',
    author: 'Studio principle',
  },
]

export default function HomePage() {
  return (
    <div className="landing-page">
      <Hero />

      <section className="site-section landing-section">
        <div className="site-container">
          <div className="section-heading landing-heading">
            <span className="eyebrow">Approach</span>
            <h2>A calmer, more deliberate digital presence.</h2>
            <p>
              The site is built around clarity: strong hierarchy, restrained motion,
              warmer colors, and interfaces that feel resolved instead of over-styled.
            </p>
          </div>

          <div className="feature-grid landing-feature-grid">
            {principles.map((item) => (
              <article key={item.title} className="soft-card feature-card">
                <div className="feature-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section landing-section">
        <div className="site-container">
          <div className="soft-card spotlight-panel landing-spotlight">
            <div className="spotlight-copy">
              <span className="eyebrow">Selected work</span>
              <h3>Writing, visuals, and experiments presented with more polish.</h3>
              <p>
                The visual system now leans on deep slate, warm sand, muted teal, and
                copper accents so each section feels premium without relying on loud neon.
              </p>
              <div className="button-row">
                <Link href="/blogs" className="button-primary">
                  Browse blog posts
                </Link>
                <Link href="/artworks" className="button-secondary">
                  Browse artworks
                </Link>
              </div>
            </div>

            <div className="card-grid landing-card-stack" style={{ gridTemplateColumns: '1fr', alignContent: 'start' }}>
              {highlights.map((item) => (
                <article key={item.title} className="soft-card feature-card">
                  <div className="feature-icon">
                    <BookIcon size={28} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <div className="tag-row">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-section landing-section">
        <div className="site-container">
          <div className="section-heading landing-heading">
            <span className="eyebrow">Perspective</span>
            <h2>Words that keep the work honest.</h2>
            <p>
              A small set of ideas that influence how the site is written, designed,
              and refined over time.
            </p>
          </div>

          <div className="quote-stack landing-quote-stack">
            {quotes.map((item) => (
              <article key={item.quote} className="soft-card quote-card">
                <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
                <cite>{item.author}</cite>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-section landing-footer" style={{ paddingTop: 0 }}>
        <div className="site-container">
          <div className="glass-panel footer-panel">
            <h3 style={{ fontSize: '2rem', color: 'var(--md-sys-color-on-surface)' }}>
              WubbaLubbaDoubt
            </h3>
            <p>
              A personal space for ideas, artwork, and digital craft shaped with more
              confidence, balance, and care.
            </p>
            <p style={{ fontSize: '0.92rem' }}>© 2026 WubbaLubbaDoubt</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
