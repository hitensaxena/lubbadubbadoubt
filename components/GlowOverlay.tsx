'use client'

export default function GlowOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-12%',
          left: '-8%',
          width: '40vw',
          height: '40vw',
          borderRadius: '999px',
          background: 'color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent)',
          filter: 'blur(120px)',
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '24%',
          right: '-10%',
          width: '32vw',
          height: '32vw',
          borderRadius: '999px',
          background: 'color-mix(in srgb, var(--md-sys-color-secondary) 18%, transparent)',
          filter: 'blur(120px)',
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-8%',
          left: '30%',
          width: '28vw',
          height: '28vw',
          borderRadius: '999px',
          background: 'color-mix(in srgb, var(--md-sys-color-tertiary) 16%, transparent)',
          filter: 'blur(140px)',
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />
    </div>
  )
}
