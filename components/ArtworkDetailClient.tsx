'use client'

import { useEffect, useState } from 'react'
import type { ArtworkWithImages } from '../lib/artworks'

interface ArtworkDetailClientProps {
  artwork: ArtworkWithImages
}

export default function ArtworkDetailClient({ artwork }: ArtworkDetailClientProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const images = artwork.artwork_images
  const activeImage = images[activeIndex]

  useEffect(() => {
    if (!isFullscreen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false)
      }

      if (event.key === 'ArrowRight' && images.length > 1) {
        setActiveIndex((current) => (current + 1) % images.length)
      }

      if (event.key === 'ArrowLeft' && images.length > 1) {
        setActiveIndex((current) => (current - 1 + images.length) % images.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [images.length, isFullscreen])

  const goPrevious = () => setActiveIndex((current) => (current - 1 + images.length) % images.length)
  const goNext = () => setActiveIndex((current) => (current + 1) % images.length)

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.touches[0]?.clientX ?? null)
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX === null || images.length <= 1) {
      setTouchStartX(null)
      return
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX
    const distance = touchEndX - touchStartX

    if (Math.abs(distance) > 40) {
      if (distance < 0) {
        goNext()
      } else {
        goPrevious()
      }
    }

    setTouchStartX(null)
  }

  return (
    <>
      <section className="artwork-detail-layout">
        <div className="artwork-detail-stage">
          {activeImage ? (
            <button
              type="button"
              className="artwork-detail-main"
              onClick={() => setIsFullscreen(true)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img src={activeImage.image_url} alt={artwork.title} />
              <span className="artwork-detail-fullscreen">Fullscreen</span>
            </button>
          ) : null}

          {images.length > 1 ? (
            <>
              <button type="button" className="artwork-detail-nav is-left" onClick={goPrevious}>
                ‹
              </button>
              <button type="button" className="artwork-detail-nav is-right" onClick={goNext}>
                ›
              </button>
            </>
          ) : null}
        </div>

        {images.length > 1 ? (
          <div className="artwork-detail-thumbs">
            {images.map((image, index) => (
              <button
                key={image.id ?? `${image.image_url}-${index}`}
                type="button"
                className={`artwork-detail-thumb${index === activeIndex ? ' is-active' : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                <img src={image.image_url} alt={`${artwork.title} ${index + 1}`} />
              </button>
            ))}
          </div>
        ) : null}

        <div className="artwork-detail-copy">
          <div className="artwork-detail-copy-block">
            <p className="artwork-showcase-kicker">Artwork notes</p>
            <h2>About this artwork</h2>
            {artwork.description ? <p>{artwork.description}</p> : <p>This artwork does not have a description yet.</p>}
          </div>

          <div className="artwork-detail-meta-grid">
            {artwork.medium ? (
              <div>
                <span>Medium</span>
                <strong>{artwork.medium}</strong>
              </div>
            ) : null}
            {artwork.dimensions ? (
              <div>
                <span>Dimensions</span>
                <strong>{artwork.dimensions}</strong>
              </div>
            ) : null}
            {artwork.year ? (
              <div>
                <span>Year</span>
                <strong>{artwork.year}</strong>
              </div>
            ) : null}
            <div>
              <span>Gallery</span>
              <strong>{artwork.image_count} image{artwork.image_count === 1 ? '' : 's'}</strong>
            </div>
          </div>
        </div>
      </section>

      {isFullscreen && activeImage ? (
        <div className="artwork-lightbox" role="dialog" aria-modal="true">
          <button
            type="button"
            className="artwork-lightbox-close"
            onClick={() => setIsFullscreen(false)}
          >
            Close
          </button>

          {images.length > 1 ? (
            <>
              <button type="button" className="artwork-lightbox-nav is-left" onClick={goPrevious}>
                ‹
              </button>
              <button type="button" className="artwork-lightbox-nav is-right" onClick={goNext}>
                ›
              </button>
            </>
          ) : null}

          <div className="artwork-lightbox-image">
            <img
              src={activeImage.image_url}
              alt={artwork.title}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
