import React from "react";

/* ---- Pump using static pump photo + animated SVG fan overlay ----
   No WebGL, scales infinitely, always works. */

export default function Pump3D({ on, fault, color, width = 200, height = 160 }) {
  return (
    <div
      style={{ width, height, position: "relative", pointerEvents: "none" }}
      className="select-none"
    >
      {/* Pump body using SVG so we can color the volute by group */}
      <svg viewBox="0 0 200 160" width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id={`vol-${color.replace("#","")}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="30%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.8" />
          </radialGradient>
          <radialGradient id="motorGrad" cx="30%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="40%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <radialGradient id="fanShadow" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <linearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          <filter id="pumpShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="3" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.35" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#pumpShadow)" transform="translate(0,5)">
          {/* Mounting base */}
          <rect x="15" y="118" width="170" height="14" fill="url(#baseGrad)" rx="2" />
          <rect x="20" y="132" width="20" height="8" fill="#0a0a0a" />
          <rect x="160" y="132" width="20" height="8" fill="#0a0a0a" />

          {/* Motor side ellipse (back-left) - the fan housing */}
          <ellipse cx="40" cy="70" rx="34" ry="40" fill="#0a0a0a" />
          <ellipse cx="42" cy="70" rx="32" ry="38" fill="url(#fanShadow)" />

          {/* Fan blades - rotating */}
          <g
            className={on && !fault ? "fan-spin" : ""}
            style={{ transformOrigin: "42px 70px", transformBox: "fill-box" }}
          >
            {Array.from({ length: 9 }).map((_, i) => {
              const angle = (i * 360) / 9;
              return (
                <path
                  key={i}
                  d="M 42 70 Q 50 50 42 32 Q 34 50 42 70 Z"
                  fill="#1a1a1a"
                  stroke="#0a0a0a"
                  strokeWidth="0.5"
                  transform={`rotate(${angle} 42 70)`}
                />
              );
            })}
            <circle cx="42" cy="70" r="6" fill="#2a2a2a" stroke="#000" />
            <circle cx="42" cy="70" r="2" fill="#555" />
          </g>

          {/* Fan grille bars (static, on top of blades) */}
          {Array.from({ length: 5 }).map((_, i) => {
            const angle = (i * 180) / 5;
            return (
              <line
                key={i}
                x1={42 + 30 * Math.cos((angle * Math.PI) / 180)}
                y1={70 + 30 * Math.sin((angle * Math.PI) / 180)}
                x2={42 - 30 * Math.cos((angle * Math.PI) / 180)}
                y2={70 - 30 * Math.sin((angle * Math.PI) / 180)}
                stroke="#0f0f0f"
                strokeWidth="2"
                opacity="0.7"
              />
            );
          })}

          {/* Motor body (cylinder) - extends right */}
          <rect x="42" y="38" width="60" height="64" fill="url(#motorGrad)" />
          <ellipse cx="102" cy="70" rx="14" ry="32" fill="#1a1a1a" />
          {/* cooling fins */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1={48 + i * 4.5}
              y1="38"
              x2={48 + i * 4.5}
              y2="102"
              stroke="#000"
              strokeWidth="0.5"
              opacity="0.8"
            />
          ))}
          {/* Terminal box on top */}
          <rect x="55" y="22" width="30" height="20" rx="2" fill="#1a1a1a" stroke="#000" />
          <rect x="60" y="18" width="20" height="6" fill="#0a0a0a" />

          {/* Coupling */}
          <rect x="100" y="58" width="14" height="24" fill="#4a4a4a" />
          <rect x="100" y="60" width="14" height="3" fill="#1a1a1a" />
          <rect x="100" y="77" width="14" height="3" fill="#1a1a1a" />

          {/* Pump volute (front, colored sphere) */}
          <ellipse cx="148" cy="70" rx="30" ry="36" fill={`url(#vol-${color.replace("#","")})`} stroke="#0a0a0a" strokeWidth="1" />
          {/* Volute mounting */}
          <rect x="112" y="48" width="12" height="44" fill="#1a1a1a" />

          {/* Discharge outlet (top) */}
          <rect x="138" y="20" width="20" height="20" fill={color} stroke="#0a0a0a" strokeWidth="0.5" />
          <rect x="135" y="16" width="26" height="6" fill="#1a1a1a" stroke="#000" strokeWidth="0.5" />
          {/* Suction inlet (bottom) */}
          <rect x="138" y="98" width="20" height="22" fill={color} stroke="#0a0a0a" strokeWidth="0.5" />
          <rect x="135" y="118" width="26" height="6" fill="#1a1a1a" stroke="#000" strokeWidth="0.5" />

          {/* Highlight on volute (gives 3D look) */}
          <ellipse cx="138" cy="60" rx="10" ry="14" fill="#fff" opacity="0.18" />

          {/* Grundfos logo on motor */}
          <text x="72" y="73" fontSize="6" fill="#fff" opacity="0.4" fontFamily="Arial" fontWeight="bold">GRUNDFOS</text>
        </g>

        {/* Status LED */}
        <circle
          cx="170"
          cy="35"
          r="4"
          fill={fault ? "#ff3b4e" : on ? "#36ff7a" : "#444"}
          stroke="#000"
        >
          {on && !fault && (
            <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
          )}
        </circle>
        {/* LED glow */}
        {on && !fault && (
          <circle cx="170" cy="35" r="7" fill="#36ff7a" opacity="0.3">
            <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.2s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    </div>
  );
}
