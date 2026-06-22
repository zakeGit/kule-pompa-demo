import React from "react";

/* Vertical multistage centrifugal pump (Grundfos CR style)
   - Black motor block on top with terminal boxes
   - Conical adapter
   - Stainless steel multistage cylinder body
   - Black base with side flanges
   - Small green rotating impeller visible through inspection window
*/

export default function VerticalPump3D({ on, fault, color = "#cf2027", width = 150, height = 230 }) {
  const stateColor = fault ? "#ff3b4e" : on ? "#36ff7a" : "#5a6976";
  const accent = fault ? "#ff3b4e" : on ? "#36ff7a" : "#5a6976";

  return (
    <div style={{ width, height, position: "relative", pointerEvents: "none" }} className="select-none">
      <svg viewBox="0 0 150 230" width={width} height={height}>
        <defs>
          <linearGradient id={`vMotorGrad-${color.replace("#","")}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0a0a0a" />
            <stop offset="35%" stopColor="#3a3a3a" />
            <stop offset="65%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
          <linearGradient id="vSteelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5a6976" />
            <stop offset="25%" stopColor="#cdd3da" />
            <stop offset="50%" stopColor="#e8eef3" />
            <stop offset="75%" stopColor="#b0bcc9" />
            <stop offset="100%" stopColor="#5a6976" />
          </linearGradient>
          <linearGradient id="vSteelGradInner" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a5562" />
            <stop offset="40%" stopColor="#8794a3" />
            <stop offset="60%" stopColor="#6a7785" />
            <stop offset="100%" stopColor="#4a5562" />
          </linearGradient>
          <linearGradient id="vBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          <linearGradient id="vTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
          <radialGradient id="vAccentGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <filter id="vShadow" x="-20%" y="-10%" width="140%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="1" dy="3" />
            <feComponentTransfer><feFuncA type="linear" slope="0.4" /></feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#vShadow)" transform="translate(0,4)">
          {/* ====== Motor top cap (rounded rect) ====== */}
          <rect x="25" y="0" width="100" height="14" rx="3" fill="url(#vTopGrad)" />
          <rect x="35" y="2" width="80" height="3" fill="#2a2a2a" />

          {/* ====== Motor body (octagonal/rounded rectangle) ====== */}
          <rect x="22" y="12" width="106" height="36" fill={`url(#vMotorGrad-${color.replace("#","")})`} stroke="#000" strokeWidth="0.6" />
          {/* Top accent ring */}
          <rect x="22" y="12" width="106" height="3" fill="#fff" opacity="0.1" />
          <rect x="22" y="45" width="106" height="3" fill="#000" opacity="0.5" />

          {/* Terminal boxes on motor (3 boxes for CR look) */}
          <rect x="32" y="16" width="28" height="22" rx="2" fill="#0a0a0a" stroke="#000" strokeWidth="0.5" />
          <rect x="63" y="16" width="22" height="22" rx="2" fill="#0a0a0a" stroke="#000" strokeWidth="0.5" />
          <rect x="88" y="16" width="30" height="22" rx="2" fill="#0a0a0a" stroke="#000" strokeWidth="0.5" />
          {/* tiny labels on terminal boxes */}
          <rect x="36" y="20" width="20" height="2" fill="#2a2a2a" />
          <rect x="36" y="24" width="14" height="1.5" fill="#1a1a1a" />
          <rect x="67" y="20" width="14" height="2" fill="#2a2a2a" />
          <rect x="92" y="20" width="22" height="2" fill="#2a2a2a" />
          <rect x="92" y="24" width="16" height="1.5" fill="#1a1a1a" />

          {/* ====== Conical adapter (motor to pump body) ====== */}
          <path d="M 25 48 L 125 48 L 110 75 L 40 75 Z" fill="url(#vMotorGrad-cf2027)" stroke="#000" strokeWidth="0.5" />
          {/* highlight */}
          <path d="M 25 48 L 125 48 L 122 52 L 28 52 Z" fill="#fff" opacity="0.12" />

          {/* Adapter mounting flange */}
          <rect x="38" y="73" width="74" height="6" fill="#1a1a1a" stroke="#000" strokeWidth="0.4" />
          {/* bolt marks on flange */}
          {[42, 58, 74, 90, 106].map((x) => (
            <circle key={x} cx={x} cy={76} r="1" fill="#2a2a2a" />
          ))}

          {/* ====== Multistage stainless steel body - 3 vertical tubes ====== */}
          {/* Connecting plate top */}
          <rect x="38" y="78" width="74" height="5" fill="#1a1a1a" />

          {/* Three stacked steel cylinders side by side */}
          <rect x="40" y="83" width="22" height="95" fill="url(#vSteelGrad)" stroke="#3a3a3a" strokeWidth="0.4" />
          <rect x="64" y="83" width="22" height="95" fill="url(#vSteelGradInner)" stroke="#3a3a3a" strokeWidth="0.4" />
          <rect x="88" y="83" width="22" height="95" fill="url(#vSteelGrad)" stroke="#3a3a3a" strokeWidth="0.4" />

          {/* Subtle horizontal stage divisions */}
          {[100, 120, 140, 160].map((y) => (
            <g key={y}>
              <line x1="40" y1={y} x2="62" y2={y} stroke="#3a3a3a" strokeWidth="0.5" opacity="0.6" />
              <line x1="64" y1={y} x2="86" y2={y} stroke="#3a3a3a" strokeWidth="0.5" opacity="0.6" />
              <line x1="88" y1={y} x2="110" y2={y} stroke="#3a3a3a" strokeWidth="0.5" opacity="0.6" />
            </g>
          ))}

          {/* Connecting plate bottom */}
          <rect x="38" y="178" width="74" height="5" fill="#1a1a1a" />

          {/* ====== Inspection window with rotating green impeller (centered on body) ====== */}
          <circle cx="75" cy="130" r="14" fill="#06120c" stroke="#000" strokeWidth="1.5" />
          <circle cx="75" cy="130" r="12.5" fill="#0a1a14" />
          <g transform="translate(75 130)">
            <g className={on && !fault ? "small-fan-spin" : ""}>
              {[0, 72, 144, 216, 288].map((angle) => (
                <path
                  key={angle}
                  d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"
                  fill={on && !fault ? "#7dfba7" : "#5a8a6f"}
                  stroke={on && !fault ? "#1fd35e" : "#2a4a36"}
                  strokeWidth="0.5"
                  transform={`rotate(${angle})`}
                  opacity="0.95"
                />
              ))}
              <circle r="2.4" fill="#1a3a26" stroke="#000" strokeWidth="0.3" />
              <circle r="0.9" fill="#7dfba7" opacity={on && !fault ? 1 : 0.4} />
            </g>
          </g>
          {/* Glass highlight */}
          <ellipse cx="72" cy="125" rx="4" ry="3" fill="#fff" opacity="0.15" />

          {/* ====== Base block with side flanges ====== */}
          <rect x="22" y="183" width="106" height="32" fill="url(#vBaseGrad)" stroke="#000" strokeWidth="0.5" />
          {/* Base highlight */}
          <rect x="22" y="183" width="106" height="3" fill="#fff" opacity="0.08" />

          {/* Left flange (suction) - hexagonal shape protruding from base */}
          <polygon points="0,192 18,190 22,196 22,210 18,216 0,214" fill="#1a1a1a" stroke="#000" strokeWidth="0.4" />
          <circle cx="9" cy="203" r="3" fill="#000" />
          {/* Flange bolts */}
          {[[4,194],[4,212],[16,194],[16,212]].map(([x,y], i) => (
            <circle key={i} cx={x} cy={y} r="0.8" fill="#3a3a3a" />
          ))}

          {/* Right flange (discharge) */}
          <polygon points="150,192 132,190 128,196 128,210 132,216 150,214" fill="#1a1a1a" stroke="#000" strokeWidth="0.4" />
          <circle cx="141" cy="203" r="3" fill="#000" />
          {[[146,194],[146,212],[134,194],[134,212]].map(([x,y], i) => (
            <circle key={i} cx={x} cy={y} r="0.8" fill="#3a3a3a" />
          ))}

          {/* Base mounting feet */}
          <rect x="30" y="215" width="20" height="6" fill="#0a0a0a" />
          <rect x="100" y="215" width="20" height="6" fill="#0a0a0a" />

          {/* Grundfos branding on motor */}
          <text x="75" y="34" textAnchor="middle" fontSize="5" fill="#fff" opacity="0.45" fontFamily="Arial" fontWeight="bold" letterSpacing="1">GRUNDFOS</text>
        </g>

        {/* Status LED top-right */}
        <circle cx="138" cy="6" r="4.5" fill={stateColor} stroke="#1a1a1a" strokeWidth="0.6">
          {on && !fault && (
            <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
          )}
        </circle>
        {on && !fault && (
          <circle cx="138" cy="6" r="8" fill="#36ff7a" opacity="0.25">
            <animate attributeName="opacity" values="0.4;0.05;0.4" dur="1.2s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    </div>
  );
}
