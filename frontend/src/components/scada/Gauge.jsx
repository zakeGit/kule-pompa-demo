import React from "react";

// Analog dial gauge (SVG) - classic SCADA look
export const Dial = ({ value, max, min = 0, unit, label, color = "#36ff7a", size = 130, danger = false }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 12;
  const startAngle = -210;
  const endAngle = 30;
  const range = endAngle - startAngle;
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const angle = startAngle + pct * range;
  const rad = (angle * Math.PI) / 180;
  const nx = cx + r * Math.cos(rad);
  const ny = cy + r * Math.sin(rad);

  // tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const a = startAngle + (i / 10) * range;
    const ar = (a * Math.PI) / 180;
    const r1 = r;
    const r2 = r - (i % 5 === 0 ? 10 : 6);
    return {
      x1: cx + r1 * Math.cos(ar),
      y1: cy + r1 * Math.sin(ar),
      x2: cx + r2 * Math.cos(ar),
      y2: cy + r2 * Math.sin(ar),
      major: i % 5 === 0,
      label: i % 5 === 0 ? Math.round(min + (i / 10) * (max - min)) : null,
      labelX: cx + (r - 20) * Math.cos(ar),
      labelY: cy + (r - 20) * Math.sin(ar),
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* outer bezel */}
        <circle cx={cx} cy={cy} r={r + 8} fill="#020608" stroke="#1f3a52" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#0a1118" strokeWidth="1" />
        {/* arc background */}
        <path
          d={describeArc(cx, cy, r - 2, startAngle, endAngle)}
          fill="none"
          stroke="#102030"
          strokeWidth="3"
        />
        {/* arc value */}
        <path
          d={describeArc(cx, cy, r - 2, startAngle, angle)}
          fill="none"
          stroke={danger ? "#ff3b4e" : color}
          strokeWidth="3"
          style={{ filter: `drop-shadow(0 0 4px ${danger ? "#ff3b4e" : color})` }}
        />
        {/* ticks */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? "#8fd0ff" : "#2a5577"} strokeWidth={t.major ? 1.5 : 1} />
            {t.label != null && (
              <text x={t.labelX} y={t.labelY + 3} textAnchor="middle" fontSize="8" fill="#8fd0ff" fontFamily="monospace">{t.label}</text>
            )}
          </g>
        ))}
        {/* needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={danger ? "#ff3b4e" : color} strokeWidth="2.5" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 3px ${danger ? "#ff3b4e" : color})` }} />
        <circle cx={cx} cy={cy} r="5" fill="#0a1118" stroke="#8fd0ff" strokeWidth="1.2" />
        <circle cx={cx} cy={cy} r="2" fill={danger ? "#ff3b4e" : color} />
        {/* digital readout */}
        <rect x={cx - 30} y={cy + 18} width="60" height="20" fill="#020608" stroke="#1f3a52" />
        <text x={cx} y={cy + 32} textAnchor="middle" fontSize="13" className="led-digit" fill={danger ? "#ff3b4e" : color} fontFamily="monospace" style={{ filter: `drop-shadow(0 0 3px ${danger ? "#ff3b4e" : color})` }}>
          {value.toFixed(value < 10 ? 2 : 1)}
        </text>
        <text x={cx} y={cy + 50} textAnchor="middle" fontSize="9" fill="#5fb3c9" fontFamily="monospace">{unit}</text>
      </svg>
      <div className="text-[10px] uppercase tracking-widest text-cyan-300 mt-1">{label}</div>
    </div>
  );
};

function polarToCartesian(cx, cy, r, angle) {
  const a = (angle * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

// LED 7-seg style digital readout
export const DigitalReadout = ({ value, unit, label, color = "led-green", width = "w-full" }) => (
  <div className={`bezel ${width}`}>
    <div className="flex items-baseline justify-between">
      <span className="text-[9px] uppercase tracking-widest text-cyan-400">{label}</span>
      <span className="text-[9px] text-cyan-600">{unit}</span>
    </div>
    <div className={`led-digit ${color} text-2xl text-right`}>
      {typeof value === "number" ? value.toFixed(value < 10 ? 2 : 1) : value}
    </div>
  </div>
);
