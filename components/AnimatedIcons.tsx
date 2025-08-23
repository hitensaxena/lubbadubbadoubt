'use client';

import React from 'react';

// Animated Experiment Icon (replacing 🔬)
export const ExperimentIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    style={{
      filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))'
    }}
  >
    {/* Flask body */}
    <path
      d="M35 25 L35 45 L20 75 Q18 78 20 80 L80 80 Q82 78 80 75 L65 45 L65 25"
      fill="url(#flaskGradient)"
      stroke="rgba(139, 92, 246, 0.8)"
      strokeWidth="2"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 50 50;2 50 50;-2 50 50;0 50 50"
        dur="3s"
        repeatCount="indefinite"
      />
    </path>
    
    {/* Flask neck */}
    <rect
      x="42"
      y="15"
      width="16"
      height="15"
      fill="url(#flaskGradient)"
      stroke="rgba(139, 92, 246, 0.8)"
      strokeWidth="2"
      rx="2"
    />
    
    {/* Bubbles */}
    <circle cx="45" cy="60" r="3" fill="rgba(6, 182, 212, 0.8)">
      <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="55" cy="65" r="2" fill="rgba(244, 114, 182, 0.8)">
      <animate attributeName="r" values="1;3;1" dur="2.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="40" cy="70" r="2.5" fill="rgba(139, 92, 246, 0.6)">
      <animate attributeName="r" values="1.5;3.5;1.5" dur="1.8s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.8s" repeatCount="indefinite" />
    </circle>
    
    <defs>
      <linearGradient id="flaskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.2)" />
        <stop offset="100%" stopColor="rgba(6, 182, 212, 0.2)" />
      </linearGradient>
    </defs>
  </svg>
);

// Animated Target Icon (replacing 🎯)
export const PurposeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    style={{
      filter: 'drop-shadow(0 4px 8px rgba(244, 114, 182, 0.3))'
    }}
  >
    {/* Outer rings */}
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="none"
      stroke="rgba(244, 114, 182, 0.3)"
      strokeWidth="2"
    >
      <animate attributeName="r" values="45;47;45" dur="3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
    </circle>
    
    <circle
      cx="50"
      cy="50"
      r="35"
      fill="none"
      stroke="rgba(6, 182, 212, 0.4)"
      strokeWidth="3"
    >
      <animate attributeName="r" values="35;37;35" dur="2.5s" repeatCount="indefinite" />
    </circle>
    
    <circle
      cx="50"
      cy="50"
      r="25"
      fill="none"
      stroke="rgba(139, 92, 246, 0.5)"
      strokeWidth="3"
    >
      <animate attributeName="r" values="25;27;25" dur="2s" repeatCount="indefinite" />
    </circle>
    
    {/* Center target */}
    <circle
      cx="50"
      cy="50"
      r="12"
      fill="url(#targetGradient)"
    >
      <animate attributeName="r" values="12;14;12" dur="1.5s" repeatCount="indefinite" />
    </circle>
    
    {/* Arrow */}
    <path
      d="M30 30 L50 50 M45 45 L50 50 L45 55 M45 45 L50 50 L55 45"
      stroke="rgba(255, 255, 255, 0.9)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 50 50;360 50 50"
        dur="8s"
        repeatCount="indefinite"
      />
    </path>
    
    <defs>
      <radialGradient id="targetGradient">
        <stop offset="0%" stopColor="rgba(244, 114, 182, 0.8)" />
        <stop offset="100%" stopColor="rgba(139, 92, 246, 0.8)" />
      </radialGradient>
    </defs>
  </svg>
);

// Animated Flow Icon (replacing 🌊)
export const FlowIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    style={{
      filter: 'drop-shadow(0 4px 8px rgba(6, 182, 212, 0.3))'
    }}
  >
    {/* Wave paths */}
    <path
      d="M10 40 Q25 30 40 40 T70 40 T100 40"
      fill="none"
      stroke="url(#waveGradient1)"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <animate
        attributeName="d"
        values="M10 40 Q25 30 40 40 T70 40 T100 40;M10 40 Q25 50 40 40 T70 40 T100 40;M10 40 Q25 30 40 40 T70 40 T100 40"
        dur="3s"
        repeatCount="indefinite"
      />
    </path>
    
    <path
      d="M10 50 Q25 40 40 50 T70 50 T100 50"
      fill="none"
      stroke="url(#waveGradient2)"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.8"
    >
      <animate
        attributeName="d"
        values="M10 50 Q25 40 40 50 T70 50 T100 50;M10 50 Q25 60 40 50 T70 50 T100 50;M10 50 Q25 40 40 50 T70 50 T100 50"
        dur="2.5s"
        repeatCount="indefinite"
      />
    </path>
    
    <path
      d="M10 60 Q25 50 40 60 T70 60 T100 60"
      fill="none"
      stroke="url(#waveGradient3)"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.6"
    >
      <animate
        attributeName="d"
        values="M10 60 Q25 50 40 60 T70 60 T100 60;M10 60 Q25 70 40 60 T70 60 T100 60;M10 60 Q25 50 40 60 T70 60 T100 60"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>
    
    {/* Floating particles */}
    <circle cx="20" cy="35" r="1.5" fill="rgba(6, 182, 212, 0.8)">
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0 0;80 0;0 0"
        dur="4s"
        repeatCount="indefinite"
      />
      <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" />
    </circle>
    
    <circle cx="30" cy="55" r="1" fill="rgba(244, 114, 182, 0.6)">
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0 0;70 0;0 0"
        dur="3.5s"
        repeatCount="indefinite"
      />
      <animate attributeName="opacity" values="0;0.8;0" dur="3.5s" repeatCount="indefinite" />
    </circle>
    
    <defs>
      <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(6, 182, 212, 0.8)" />
        <stop offset="50%" stopColor="rgba(139, 92, 246, 0.8)" />
        <stop offset="100%" stopColor="rgba(244, 114, 182, 0.8)" />
      </linearGradient>
      <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.6)" />
        <stop offset="100%" stopColor="rgba(6, 182, 212, 0.6)" />
      </linearGradient>
      <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(244, 114, 182, 0.4)" />
        <stop offset="100%" stopColor="rgba(139, 92, 246, 0.4)" />
      </linearGradient>
    </defs>
  </svg>
);

// Animated Book Icon (replacing 📚)
export const BookIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    style={{
      filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))'
    }}
  >
    {/* Book cover */}
    <rect
      x="20"
      y="20"
      width="50"
      height="60"
      fill="url(#bookGradient)"
      stroke="rgba(139, 92, 246, 0.8)"
      strokeWidth="2"
      rx="3"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 45 50;2 45 50;-1 45 50;0 45 50"
        dur="4s"
        repeatCount="indefinite"
      />
    </rect>
    
    {/* Book spine */}
    <rect
      x="15"
      y="20"
      width="8"
      height="60"
      fill="rgba(139, 92, 246, 0.6)"
      rx="2"
    />
    
    {/* Pages */}
    <rect x="25" y="30" width="35" height="2" fill="rgba(255, 255, 255, 0.3)" rx="1" />
    <rect x="25" y="35" width="30" height="2" fill="rgba(255, 255, 255, 0.3)" rx="1" />
    <rect x="25" y="40" width="35" height="2" fill="rgba(255, 255, 255, 0.3)" rx="1" />
    <rect x="25" y="45" width="25" height="2" fill="rgba(255, 255, 255, 0.3)" rx="1" />
    
    {/* Floating sparkles */}
    <circle cx="75" cy="25" r="2" fill="rgba(244, 114, 182, 0.8)">
      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
      <animateTransform
        attributeName="transform"
        type="scale"
        values="0;1;0"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
    
    <circle cx="80" cy="35" r="1.5" fill="rgba(6, 182, 212, 0.8)">
      <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
      <animateTransform
        attributeName="transform"
        type="scale"
        values="0;1;0"
        dur="2.5s"
        repeatCount="indefinite"
        begin="0.5s"
      />
    </circle>
    
    <defs>
      <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
        <stop offset="100%" stopColor="rgba(6, 182, 212, 0.3)" />
      </linearGradient>
    </defs>
  </svg>
);

// Animated Palette Icon (replacing 🎨)
export const ArtIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    style={{
      filter: 'drop-shadow(0 4px 8px rgba(244, 114, 182, 0.3))'
    }}
  >
    {/* Palette shape */}
    <path
      d="M20 50 Q20 25 45 25 Q70 25 80 40 Q85 50 80 60 Q75 70 65 75 Q50 80 35 75 Q25 65 20 50 Z"
      fill="url(#paletteGradient)"
      stroke="rgba(244, 114, 182, 0.8)"
      strokeWidth="2"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 50 50;5 50 50;-5 50 50;0 50 50"
        dur="6s"
        repeatCount="indefinite"
      />
    </path>
    
    {/* Paint colors */}
    <circle cx="35" cy="40" r="4" fill="rgba(139, 92, 246, 0.8)">
      <animate attributeName="r" values="4;5;4" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="50" cy="35" r="3.5" fill="rgba(6, 182, 212, 0.8)">
      <animate attributeName="r" values="3.5;4.5;3.5" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="65" cy="45" r="4" fill="rgba(244, 114, 182, 0.8)">
      <animate attributeName="r" values="4;5;4" dur="2.8s" repeatCount="indefinite" />
    </circle>
    <circle cx="45" cy="55" r="3" fill="rgba(34, 197, 94, 0.8)">
      <animate attributeName="r" values="3;4;3" dur="3.2s" repeatCount="indefinite" />
    </circle>
    
    {/* Brush */}
    <line
      x1="70"
      y1="30"
      x2="85"
      y2="15"
      stroke="rgba(139, 92, 246, 0.8)"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 77.5 22.5;10 77.5 22.5;-10 77.5 22.5;0 77.5 22.5"
        dur="4s"
        repeatCount="indefinite"
      />
    </line>
    
    {/* Brush tip */}
    <circle cx="85" cy="15" r="2" fill="rgba(244, 114, 182, 0.8)">
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 77.5 22.5;10 77.5 22.5;-10 77.5 22.5;0 77.5 22.5"
        dur="4s"
        repeatCount="indefinite"
      />
    </circle>
    
    <defs>
      <radialGradient id="paletteGradient">
        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
        <stop offset="100%" stopColor="rgba(244, 114, 182, 0.1)" />
      </radialGradient>
    </defs>
  </svg>
);