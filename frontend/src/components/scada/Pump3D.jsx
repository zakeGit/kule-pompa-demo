import React from "react";

/* Simple SCADA-style pump: round casing with 5-blade impeller.
   - Green casing when ON, gray when OFF, red when FAULT
   - Impeller spins via CSS rotation
   - Side flanges for suction/discharge pipe connection */

export default function Pump3D({ on, fault, color, width = 200, height = 160 }) {
  const casing = fault ? "#cf2027" : on ? "#1faf45" : "#9aa9b7";
  const casingDark = fault ? "#7a0f15" : on ? "#0d6b2a" : "#5a6976";
  const casingLight = fault ? "#ff5a6b" : on ? "#5ed97a" : "#cdd3da";

  return (
    <div style={{ width, height, position: "relative", pointerEvents: "none" }} className="select-none">
      <svg viewBox="0 0 200 160" width={width} height={height}>
        <defs>
          <radialGradient id={`pumpBody-${casing.replace("#", "")}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={casingLight} />
            <stop offset="55%" stopColor={casing} />
            <stop offset="100%" stopColor={casingDark} />
          </radialGradient>
          <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e8eef3" />
            <stop offset="40%" stopColor="#b0bcc9" />
            <stop offset="60%" stopColor="#8794a3" />
            <stop offset="100%" stopColor="#5a6976" />
          </linearGradient>
          <linearGradient id="flangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e8eef3" />
            <stop offset="50%" stopColor="#9aa9b7" />
            <stop offset="100%" stopColor="#5a6976" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
            <feOffset dx="0" dy="3" />
            <feComponentTransfer><feFuncA type="linear" slope="0.4" /></feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#softShadow)" transform="translate(0,5)">
          {/* Left pipe (suction) */}
          <rect x="0" y="68" width="46" height="22" fill="url(#pipeGrad)" stroke="#5a6976" strokeWidth="0.6" />
          <rect x="40" y="64" width="10" height="30" fill="url(#flangeGrad)" stroke="#5a6976" strokeWidth="0.6" rx="1" />

          {/* Right pipe (discharge) */}
          <rect x="154" y="68" width="46" height="22" fill="url(#pipeGrad)" stroke="#5a6976" strokeWidth="0.6" />
          <rect x="150" y="64" width="10" height="30" fill="url(#flangeGrad)" stroke="#5a6976" strokeWidth="0.6" rx="1" />

          {/* Pump casing - circular */}
          <circle cx="100" cy="79" r="55" fill={`url(#pumpBody-${casing.replace("#", "")})`} stroke={casingDark} strokeWidth="2" />
          {/* Inner ring */}
          <circle cx="100" cy="79" r="48" fill="none" stroke={casingDark} strokeWidth="1" opacity="0.5" />
          {/* highlight on casing */}
          <ellipse cx="80" cy="60" rx="20" ry="10" fill="#fff" opacity="0.18" />

          {/* Impeller (white 5-blade) - rotates around center.
              Outer <g transform="translate"> positions impeller; inner <g> handles CSS rotation around 0,0. */}
          <g transform="translate(100 79)">
            <g
              className={on && !fault ? "impeller-spin" : ""}
            >
              {/* 5 curved blades centered at 0,0 */}
              {[0, 72, 144, 216, 288].map((angle) => (
                <path
                  key={angle}
                  d="M 0 0 Q 9 -25 0 -45 Q -9 -25 0 0 Z"
                  fill="#f4f6f8"
                  stroke={casingDark}
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                  transform={`rotate(${angle})`}
                  opacity="0.95"
                />
              ))}
              {/* Center hub */}
              <circle r="9" fill={casingDark} />
              <circle r="3" fill="#2a2a2a" />
            </g>
          </g>

          {/* Mounting bolt marks on casing */}
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const a = (angle * Math.PI) / 180;
            return (
              <circle
                key={angle}
                cx={100 + Math.cos(a) * 50}
                cy={79 + Math.sin(a) * 50}
                r="1.5"
                fill={casingDark}
              />
            );
          })}
        </g>

        {/* Status LED */}
        <circle cx="180" cy="22" r="5" fill={fault ? "#ff3b4e" : on ? "#36ff7a" : "#5a6976"} stroke="#1a1a1a" strokeWidth="0.8">
          {on && !fault && (
            <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
          )}
        </circle>
      </svg>
    </div>
  );
}
