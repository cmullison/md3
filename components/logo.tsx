import React from "react";

const EnhancedSVGLogo = () => (
  <div className="relative w-[360px] h-[360px]">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-indigo-900 to-purple-900 blur-3xl opacity-70 animate-pulse"></div>
    <svg
      width="360"
      height="360"
      viewBox="0 0 360 360"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-10"
    >
      <defs>
        {/* Enhanced Gradients */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700">
            <animate
              attributeName="stop-color"
              values="#FFD700; #FFA500; #FF8C00; #FFD700"
              dur="10s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor="#FFA500">
            <animate
              attributeName="stop-color"
              values="#FFA500; #FF8C00; #FFD700; #FFA500"
              dur="10s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#FF8C00">
            <animate
              attributeName="stop-color"
              values="#FF8C00; #FFD700; #FFA500; #FF8C00"
              dur="10s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
        <linearGradient
          id="emeraldGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#50C878">
            <animate
              attributeName="stop-color"
              values="#50C878; #00A86B; #008080; #50C878"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor="#00A86B">
            <animate
              attributeName="stop-color"
              values="#00A86B; #008080; #50C878; #00A86B"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#008080">
            <animate
              attributeName="stop-color"
              values="#008080; #50C878; #00A86B; #008080"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
        <radialGradient
          id="centerGlow"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)">
            <animate
              attributeName="stop-color"
              values="rgba(255,255,255,0.8); rgba(255,255,255,0.2); rgba(255,255,255,0.8)"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="70%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* Filters */}
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.7)">
        <animate
          attributeName="fill"
          values="rgba(0,0,0,0.7); rgba(20,20,40,0.7); rgba(0,0,0,0.7)"
          dur="10s"
          repeatCount="indefinite"
        />
      </rect>

      {/* Center glow */}
      <circle cx="180" cy="180" r="120" fill="url(#centerGlow)" opacity="0.5">
        <animate
          attributeName="r"
          values="120; 140; 120"
          dur="4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5; 0.7; 0.5"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Complex M shape */}
      <path
        d="M30 300 Q60 200 90 250 T150 200 T210 250 T270 200 T330 300"
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#neonGlow)"
      >
        <animate
          attributeName="d"
          values="
            M30 300 Q60 200 90 250 T150 200 T210 250 T270 200 T330 300;
            M30 280 Q60 220 90 270 T150 220 T210 270 T270 220 T330 280;
            M30 300 Q60 200 90 250 T150 200 T210 250 T270 200 T330 300"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>

      {/* Curved V shape (like U) underneath */}
      <path
        d="M60 320 Q120 380 180 340 Q240 380 300 320"
        fill="none"
        stroke="url(#emeraldGradient)"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#neonGlow)"
      >
        <animate
          attributeName="d"
          values="
            M60 320 Q120 380 180 340 Q240 380 300 320;
            M60 300 Q120 360 180 320 Q240 360 300 300;
            M60 320 Q120 380 180 340 Q240 380 300 320"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>

      {/* Celtic knot decorations */}
      <g transform="translate(60, 60) scale(0.7)">
        <path
          d="M0 0 Q20 -20 40 0 T80 0 M0 0 Q20 20 40 0 T80 0"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="10"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 40 0"
            to="360 40 0"
            dur="10s"
            repeatCount="indefinite"
          />
        </path>
      </g>
      <g transform="translate(260, 60) scale(0.7) rotate(180)">
        <path
          d="M0 0 Q20 -20 40 0 T80 0 M0 0 Q20 20 40 0 T80 0"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="10"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="180 40 0"
            to="-180 40 0"
            dur="10s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Decorative circles */}
      <circle cx="180" cy="60" r="20" fill="url(#emeraldGradient)">
        <animate
          attributeName="r"
          values="20; 25; 20"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="60" cy="180" r="15" fill="url(#goldGradient)">
        <animate
          attributeName="r"
          values="15; 20; 15"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="300" cy="180" r="15" fill="url(#goldGradient)">
        <animate
          attributeName="r"
          values="15; 20; 15"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Ornamental lines */}
      <path
        d="M30 30 L330 30 M30 330 L330 330"
        stroke="url(#emeraldGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="10 5"
      >
        <animate
          attributeName="stroke-dasharray"
          values="10 5; 5 10; 10 5"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M30 30 L30 330 M330 30 L330 330"
        stroke="url(#goldGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="10 5"
      >
        <animate
          attributeName="stroke-dasharray"
          values="10 5; 5 10; 10 5"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>

      {/* Central diamond */}
      <path
        d="M180 120 L220 180 L180 240 L140 180 Z"
        fill="none"
        stroke="url(#emeraldGradient)"
        strokeWidth="10"
        filter="url(#neonGlow)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 180 180"
          to="360 180 180"
          dur="20s"
          repeatCount="indefinite"
        />
      </path>

      {/* Pulsating animation */}
      <circle cx="180" cy="180" r="5" fill="white">
        <animate
          attributeName="r"
          values="5;20;5"
          dur="4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0;1"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

export default EnhancedSVGLogo;
