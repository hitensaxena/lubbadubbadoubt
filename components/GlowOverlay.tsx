'use client'

import React from 'react'

export default function GlowOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Dynamic ambient soft glows leveraging modern css blend modes and massive blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-30 mix-blend-screen animate-pulse" 
           style={{ background: 'var(--md-sys-color-primary)', filter: 'blur(120px)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-30 mix-blend-screen" 
           style={{ background: 'var(--md-sys-color-secondary)', filter: 'blur(120px)', animation: 'pulse 8s infinite alternate' }} />
      <div className="absolute top-[40%] left-[50%] w-[40vw] h-[40vw] rounded-full opacity-20 mix-blend-screen" 
           style={{ background: 'var(--md-sys-color-tertiary)', filter: 'blur(100px)', animation: 'pulse 6s infinite alternate-reverse', transform: 'translateX(-50%)' }} />
           
      {/* Noise texture overlay for a premium film-grain look */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             backgroundRepeat: 'repeat',
             backgroundSize: '150px'
           }} />
    </div>
  )
}
