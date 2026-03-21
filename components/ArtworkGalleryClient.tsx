'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import ArtworkCard from './ArtworkCard'
import type { ArtworkWithImages } from '../lib/artworks'

interface ArtworkGalleryClientProps {
  artworks: ArtworkWithImages[]
}

type ViewMode = 'grid' | 'gallery3d'

const ARTWORK_VIEW_MODE_KEY = 'artwork-gallery-view-mode'

export default function ArtworkGalleryClient({ artworks }: ArtworkGalleryClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)')
    const sync = () => {
      setIsMobile(media.matches)
      if (media.matches) {
        setViewMode('grid')
        window.localStorage.setItem(ARTWORK_VIEW_MODE_KEY, 'grid')
      }
    }

    const savedMode = window.localStorage.getItem(ARTWORK_VIEW_MODE_KEY)
    if (!media.matches && savedMode === 'gallery3d') {
      setViewMode('gallery3d')
    }

    sync()
    media.addEventListener('change', sync)

    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      window.localStorage.setItem(ARTWORK_VIEW_MODE_KEY, viewMode)
    }
  }, [isMobile, viewMode])

  useEffect(() => {
    if (viewMode !== 'gallery3d' || artworks.length <= 1) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => (current + 1) % artworks.length)
      }

      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => (current - 1 + artworks.length) % artworks.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [artworks.length, viewMode])

  const safeIndex = useMemo(() => {
    if (artworks.length === 0) {
      return 0
    }

    return Math.min(activeIndex, artworks.length - 1)
  }, [activeIndex, artworks.length])

  const activeArtwork = artworks[safeIndex]

  if (artworks.length === 0) {
    return null
  }

  const activateView = (nextMode: ViewMode) => {
    if (nextMode === 'gallery3d' && isMobile) {
      return
    }

    setViewMode(nextMode)
  }

  return (
    <div className="artwork-showcase">
      <div className="artwork-showcase-toolbar">
        <div>
          <p className="artwork-showcase-kicker">Explore</p>
          <h2>Browse the collection your way.</h2>
        </div>

        <div className="artwork-view-toggle" aria-label="Artwork view mode">
          <button
            type="button"
            className={viewMode === 'grid' ? 'is-active' : ''}
            aria-pressed={viewMode === 'grid'}
            onClick={() => activateView('grid')}
          >
            Grid
          </button>
          <button
            type="button"
            className={viewMode === 'gallery3d' ? 'is-active' : ''}
            aria-pressed={viewMode === 'gallery3d'}
            onClick={() => activateView('gallery3d')}
            disabled={isMobile}
            title={isMobile ? '3D gallery is available on larger screens' : undefined}
          >
            3D Gallery
          </button>
        </div>
      </div>

      {viewMode === 'gallery3d' && !isMobile ? (
        <div className="artwork-carousel-shell">
          <div className="artwork-carousel-stage">
            {artworks.map((artwork, index) => {
              const offset = index - safeIndex
              const absOffset = Math.abs(offset)
              const isVisible = absOffset <= 3

              if (!isVisible) {
                return null
              }

              return (
                <button
                  key={artwork.id}
                  type="button"
                  className={`artwork-carousel-card${offset === 0 ? ' is-active' : ''}`}
                  style={{
                    transform: `translateX(${offset * 42}%) scale(${1 - absOffset * 0.14}) rotateY(${offset * -18}deg)`,
                    opacity: 1 - absOffset * 0.22,
                    zIndex: 20 - absOffset,
                    backgroundImage: artwork.cover_image_url
                      ? `linear-gradient(180deg, rgba(12, 16, 19, 0.08), rgba(12, 16, 19, 0.58)), url(${artwork.cover_image_url})`
                      : undefined,
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="artwork-carousel-card-label">
                    {artwork.title}
                  </span>
                  {(artwork.image_count ?? 0) > 1 ? (
                    <span className="artwork-carousel-card-count">{artwork.image_count} images</span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="artwork-carousel-controls">
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current - 1 + artworks.length) % artworks.length)}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current + 1) % artworks.length)}
            >
              Next
            </button>
          </div>

          {activeArtwork ? (
            <div className="glass-panel artwork-carousel-detail">
              <div className="artwork-carousel-detail-copy">
                <p className="artwork-showcase-kicker">Selected artwork</p>
                <h3>{activeArtwork.title}</h3>
                {activeArtwork.medium ? <p>{activeArtwork.medium}</p> : null}
                {activeArtwork.description ? <p>{activeArtwork.description}</p> : null}
                <div className="tag-row">
                  {activeArtwork.year ? <span className="tag">{activeArtwork.year}</span> : null}
                  <span className="tag">{activeArtwork.image_count} image{activeArtwork.image_count === 1 ? '' : 's'}</span>
                  {activeArtwork.is_featured ? <span className="tag">Featured</span> : null}
                </div>
              </div>

              <div className="artwork-carousel-detail-actions">
                <Link href={`/artworks/${activeArtwork.id}`} className="button-primary">
                  Open artwork
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="list-grid artwork-grid-list">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  )
}
