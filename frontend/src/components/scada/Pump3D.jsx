import React from "react";

/* Detailed 3D-style pump (perspective look) with ONE small rotating fan element on the motor end. */

export default function Pump3D({ on, fault, color = "#cf2027", width = 220, height = 160 }) {
  const stateColor = fault ? "#ff3b4e" : on ? "#36ff7a" : "#5a6976";

  return (
    <div style={{ width, height, position: "relative", pointerEvents: "none" }} className="select-none">
      <svg viewBox="0 0 220 160" width={width} height={height}>
        <defs>
          {/* Motor body shading */}
          <linearGradient id="motorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="45%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>
          <radialGradient id={`voluteGrad-${color.replace("#", "")}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="35%" stopColor={color} />
            <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
          </radialGradient>
          <radialGradient id="fanHubGrad" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <linearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          <linearGradient id="flangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e8eef3" />
            <stop offset="50%" stopColor="#8794a3" />
            <stop offset="100%" stopColor="#3a3a3a" />
          </linearGradient>
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
            <feOffset dx="0" dy="3" result="offsetblur" />
            <feComponentTransfer><feFuncA type="linear" slope="0.4" /></feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#dropShadow)" transform="translate(0,5)">
          {/* ====== Mounting base with feet ====== */}
          <rect x="20" y="124" width="180" height="12" fill="url(#baseGrad)" rx="2" />
          <rect x="25" y="136" width="22" height="7" fill="#0a0a0a" />
          <rect x="173" y="136" width="22" height="7" fill="#0a0a0a" />

          {/* ====== Motor (left, horizontal cylinder in 3D oblique projection) ====== */}
          {/* Back face (visible due to perspective) */}
          <ellipse cx="48" cy="70" rx="14" ry="38" fill="#0a0a0a" />
          {/* Motor body */}
          <rect x="48" y="32" width="62" height="76" fill="url(#motorGrad)" />
          {/* Front face (where coupling exits) */}
          <ellipse cx="110" cy="70" rx="14" ry="38" fill="#1a1a1a" />
          {/* Cooling fins on motor body */}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1={52 + i * 4.2} y1="32" x2={52 + i * 4.2} y2="108" stroke="#000" strokeWidth="0.6" opacity="0.85" />
          ))}
          {/* Terminal box on top */}
          <rect x="64" y="16" width="32" height="18" rx="2" fill="#1a1a1a" stroke="#000" />
          <rect x="68" y="11" width="24" height="6" fill="#0a0a0a" />
          <rect x="72" y="22" width="4" height="4" fill="#2a2a2a" />
          <rect x="84" y="22" width="4" height="4" fill="#2a2a2a" />
          {/* Highlight on top of motor */}
          <rect x="50" y="34" width="58" height="6" fill="#fff" opacity="0.08" />

          {/* ====== Small rotating fan on the BACK (left) end of motor ====== */}
          {/* Fan housing recess */}
          <ellipse cx="42" cy="70" rx="11" ry="22" fill="#000" />
          <ellipse cx="44" cy="70" rx="9" ry="20" fill="url(#fanHubGrad)" />
          {/* Rotating fan blades - SMALL, on the motor back */}
          <g transform="translate(44 70)">
            <g className={on && !fault ? "small-fan-spin" : ""}>
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <ellipse
                  key={angle}
                  cx="0"
                  cy="-12"
                  rx="2.5"
                  ry="8"
                  fill="#3a3a3a"
                  stroke="#0a0a0a"
                  strokeWidth="0.4"
                  transform={`rotate(${angle})`}
                />
              ))}
              <circle r="4" fill="#1a1a1a" stroke="#000" strokeWidth="0.4" />
              <circle r="1.4" fill="#666" />
            </g>
          </g>
          {/* Fan grille (static thin lines on top) */}
          {[0, 45, 90, 135].map((angle) => (
            <line
              key={angle}
              x1={44 + 19 * Math.cos((angle * Math.PI) / 180)}
              y1={70 + 19 * Math.sin((angle * Math.PI) / 180)}
              x2={44 - 19 * Math.cos((angle * Math.PI) / 180)}
              y2={70 - 19 * Math.sin((angle * Math.PI) / 180)}
              stroke="#0a0a0a"
              strokeWidth="0.7"
              opacity="0.6"
            />
          ))}

          {/* ====== Coupling between motor and pump ====== */}
          <rect x="110" y="58" width="14" height="24" fill="#5a5a5a" stroke="#000" strokeWidth="0.4" />
          <rect x="110" y="60" width="14" height="2" fill="#1a1a1a" />
          <rect x="110" y="78" width="14" height="2" fill="#1a1a1a" />

          {/* ====== Pump volute (right, colored sphere) ====== */}
          <ellipse cx="160" cy="70" rx="34" ry="40" fill={`url(#voluteGrad-${color.replace("#", "")})`} stroke="#0a0a0a" strokeWidth="1" />
          {/* Volute mounting flange */}
          <rect x="124" y="46" width="14" height="48" fill="#1a1a1a" />
          {/* Highlight on volute */}
          <ellipse cx="148" cy="56" rx="12" ry="16" fill="#fff" opacity="0.22" />

          {/* Discharge outlet (top) */}
          <rect x="150" y="14" width="22" height="22" fill={color} stroke="#0a0a0a" strokeWidth="0.6" />
          <rect x="146" y="8" width="30" height="8" fill="url(#flangeGrad)" stroke="#000" strokeWidth="0.4" rx="1" />
          {/* Suction inlet (bottom) */}
          <rect x="150" y="104" width="22" height="22" fill={color} stroke="#0a0a0a" strokeWidth="0.6" />
          <rect x="146" y="124" width="30" height="8" fill="url(#flangeGrad)" stroke="#000" strokeWidth="0.4" rx="1" />

          {/* Grundfos branding on motor */}
          <text x="78" y="74" fontSize="6" fill="#fff" opacity="0.45" fontFamily="Arial" fontWeight="bold" letterSpacing="0.5">GRUNDFOS</text>
        </g>

        {/* Status LED top-right */}
        <circle cx="200" cy="22" r="5" fill={stateColor} stroke="#1a1a1a" strokeWidth="0.8">
          {on && !fault && (
            <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
          )}
        </circle>
        {on && !fault && (
          <circle cx="200" cy="22" r="9" fill="#36ff7a" opacity="0.25">
            <animate attributeName="opacity" values="0.4;0.05;0.4" dur="1.2s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    </div>
  );
}
