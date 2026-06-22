import React from "react";

/* Single pump with rotating fan, value boxes around it - exactly matching reference */
const Pump = ({ id, idx, pump, onClick, fbsTop, fbsBot, vsTop, vsBot, egKw }) => {
  const status = pump.fault ? "fault" : pump.on ? "on" : "off";
  const accent = pump.fault ? "#ff3b4e" : pump.on ? "#36ff7a" : "#9aa9b7";

  return (
    <g transform={`translate(${idx * 220}, 0)`} style={{ cursor: "pointer" }} onClick={onClick} data-testid={`pump-${id}`}>
      {/* ------ FBS top values ------ */}
      <g transform="translate(0, 0)">
        <ValueBox x={0} y={0} label="FBS" value={`${fbsTop[0].toFixed(2)} Bar`} />
        <ValueBox x={100} y={0} label="FBS" value={`${fbsTop[1].toFixed(2)} Bar`} />
        <ValueBox x={0} y={32} label="FBS" value={`${fbsBot[0].toFixed(2)} Bar`} />
        <ValueBox x={100} y={32} label="FBS" value={`${fbsBot[1].toFixed(2)} Bar`} />
      </g>

      {/* EG kW box */}
      <ValueBox x={0} y={86} label="EG" value={`${egKw.toFixed(2)} kW`} />

      {/* Horizontal feed pipe */}
      <rect x={0} y={70} width={200} height={6} fill="#2563a0" />
      {/* Vertical connector to pump top */}
      <rect x={90} y={76} width={6} height={60} fill="#2563a0" />

      {/* ------ PUMP graphic (motor + body + animated fan) ------ */}
      <g transform="translate(20, 130)">
        {/* Motor housing (cylinder body) */}
        <ellipse cx={95} cy={50} rx={48} ry={50} fill="#1a1a1a" stroke="#000" />
        <ellipse cx={95} cy={50} rx={48} ry={50} fill="url(#motorGrad)" />
        {/* Cooling fins lines */}
        {Array.from({ length: 7 }).map((_, i) => (
          <ellipse key={i} cx={95} cy={50} rx={48 - i * 3} ry={50 - i * 3} fill="none" stroke="#0a0a0a" strokeWidth="0.5" opacity={0.6} />
        ))}
        {/* Fan (rotating) - back of motor */}
        <g transform={`translate(95, 50)`}>
          <circle r={40} fill="#050505" />
          <circle r={40} fill="url(#fanShadow)" />
          {/* Fan blades - SVG group that rotates via CSS class */}
          <g className={pump.on && !pump.fault ? "fan-spin" : ""}>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 360) / 8;
              return (
                <path
                  key={i}
                  d="M 0 0 Q 6 -18 0 -36 Q -6 -18 0 0 Z"
                  fill="#1f1f1f"
                  stroke="#0a0a0a"
                  strokeWidth="0.5"
                  transform={`rotate(${angle})`}
                />
              );
            })}
            {/* Center hub */}
            <circle r={8} fill="#2a2a2a" stroke="#000" />
            <circle r={3} fill="#444" />
          </g>
        </g>

        {/* Pump volute (left side) */}
        <ellipse cx={28} cy={50} rx={26} ry={32} fill="#222" stroke="#0a0a0a" />
        <ellipse cx={28} cy={50} rx={20} ry={26} fill="#1a1a1a" />
        {/* Suction flange (top) */}
        <rect x={20} y={10} width={18} height={14} fill="#2a2a2a" stroke="#000" />
        <rect x={18} y={6} width={22} height={6} fill="#3a3a3a" stroke="#000" />
        {/* Discharge flange (bottom) */}
        <rect x={20} y={82} width={18} height={14} fill="#2a2a2a" stroke="#000" />
        <rect x={18} y={94} width={22} height={6} fill="#3a3a3a" stroke="#000" />

        {/* Base mounting feet */}
        <rect x={0} y={104} width={150} height={10} fill="#1a1a1a" stroke="#000" />
        <rect x={5} y={114} width={20} height={6} fill="#0a0a0a" />
        <rect x={125} y={114} width={20} height={6} fill="#0a0a0a" />

        {/* Status indicator on pump body */}
        <circle cx={140} cy={20} r={5} fill={accent} stroke="#000">
          {pump.on && !pump.fault && (
            <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
          )}
        </circle>
        {/* Pump label */}
        <rect x={45} y={120} width={60} height={14} fill="#fff" stroke="#2563a0" />
        <text x={75} y={130} textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#0a3a5a">{id}</text>
      </g>

      {/* Vertical connector from pump to bottom pipe */}
      <rect x={90} y={262} width={6} height={30} fill="#2563a0" />
      <rect x={0} y={292} width={200} height={6} fill="#2563a0" />

      {/* ------ VS bottom values ------ */}
      <ValueBox x={0} y={310} label="VS" value={`${vsTop[0].toFixed(0)} Pa`} />
      <ValueBox x={100} y={310} label="VS" value={`${vsTop[1].toFixed(0)} Pa`} />
      <ValueBox x={0} y={342} label="VS" value={`${vsBot[0].toFixed(0)} Pa`} />
      <ValueBox x={100} y={342} label="VS" value={`${vsBot[1].toFixed(0)} Pa`} />
    </g>
  );
};

const ValueBox = ({ x, y, label, value, green }) => (
  <g transform={`translate(${x}, ${y})`}>
    <text x={0} y={14} fontFamily="Arial, sans-serif" fontSize="13" fontWeight="bold" fill="#1a1a1a">{label}</text>
    <rect x={28} y={2} width={68} height={20} fill={green ? "#a8e89a" : "#ffffff"} stroke="#2563a0" strokeWidth="1.2" />
    <text x={62} y={16} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="11" fill="#0a1118">{`${value}`}</text>
  </g>
);

/* One loop = 1 cooling tower row */
const Loop = ({ y, label, pumps, pumpIds, towerTemp, towerLevel, mainBar, mainFlow, mainTemp, returnTemp, simRefs, onPumpClick }) => {
  return (
    <g transform={`translate(40, ${y})`}>
      {/* 4 pumps */}
      {pumpIds.map((id, i) => (
        <Pump
          key={id}
          id={id}
          idx={i}
          pump={pumps[id]}
          onClick={() => onPumpClick(id)}
          fbsTop={simRefs[id].fbsTop}
          fbsBot={simRefs[id].fbsBot}
          vsTop={simRefs[id].vsTop}
          vsBot={simRefs[id].vsBot}
          egKw={pumps[id].kw}
        />
      ))}

      {/* Main feed pipe extends to tower section */}
      <rect x={pumpIds.length * 220} y={70} width={120} height={6} fill="#2563a0" />
      {/* Arrow */}
      <polygon points={`${pumpIds.length * 220 + 120},66 ${pumpIds.length * 220 + 140},73 ${pumpIds.length * 220 + 120},80`} fill="#2563a0" />

      {/* BS DM SS row at right side */}
      <g transform={`translate(${pumpIds.length * 220 + 150}, 50)`}>
        <text x={20} y={0} fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#1a1a1a">BS</text>
        <rect x={0} y={6} width={80} height={28} fill="#a8e89a" stroke="#2563a0" strokeWidth="1.5" />
        <text x={40} y={25} textAnchor="middle" fontFamily="Arial" fontSize="13" fontWeight="bold" fill="#0a1118">{`${mainBar.toFixed(2)} Bar`}</text>

        <text x={120} y={0} fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#1a1a1a">DM</text>
        <rect x={100} y={6} width={80} height={28} fill="#ffffff" stroke="#2563a0" strokeWidth="1.5" />
        <text x={140} y={25} textAnchor="middle" fontFamily="Arial" fontSize="12" fill="#0a1118">{`${mainFlow.toFixed(1)} m³/h`}</text>

        <text x={220} y={0} fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#1a1a1a">SS</text>
        <rect x={200} y={6} width={80} height={28} fill="#ffffff" stroke="#2563a0" strokeWidth="1.5" />
        <text x={240} y={25} textAnchor="middle" fontFamily="Arial" fontSize="13" fontWeight="bold" fill="#0a1118">{`${mainTemp.toFixed(1)} °C`}</text>

        {/* Connecting pipes between BS/DM/SS boxes */}
        <rect x={80} y={18} width={20} height={6} fill="#2563a0" />
        <rect x={180} y={18} width={20} height={6} fill="#2563a0" />
        <rect x={280} y={18} width={40} height={6} fill="#2563a0" />
        <polygon points="320,14 332,21 320,28" fill="#2563a0" />
      </g>

      {/* KULE label (right) */}
      <g transform={`translate(${pumpIds.length * 220 + 500}, 50)`}>
        <text x={0} y={50} fontFamily="Arial, sans-serif" fontSize="46" fontWeight="900" fill="#0a1118">{label}</text>
      </g>

      {/* Return line below */}
      <g transform={`translate(${pumpIds.length * 220 + 150}, 200)`}>
        <polygon points="0,3 12,-4 12,10" fill="#2563a0" />
        <rect x={12} y={0} width={180} height={6} fill="#2563a0" />
        <text x={210} y={-2} fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#1a1a1a">SS</text>
        <rect x={200} y={-2} width={80} height={22} fill="#ffffff" stroke="#2563a0" strokeWidth="1.5" />
        <text x={240} y={14} textAnchor="middle" fontFamily="Arial" fontSize="13" fill="#0a1118">{returnTemp.toFixed(1)} °C</text>
        <rect x={280} y={0} width={40} height={6} fill="#2563a0" />
      </g>

      {/* Mini tower indicator */}
      <g transform={`translate(${pumpIds.length * 220 + 470}, 130)`}>
        <rect x={-2} y={-2} width={84} height={84} fill="#0a1118" rx={4} />
        <rect x={4} y={4} width={72} height={72} fill="#08131e" stroke="#2563a0" rx={3} />
        <text x={40} y={18} textAnchor="middle" fontFamily="Arial" fontSize="9" fill="#5fb3c9">SEVİYE</text>
        {/* fill */}
        <rect x={10} y={68 - (towerLevel / 100) * 50} width={60} height={(towerLevel / 100) * 50} fill="#1fc8d6">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x={10} y={20} width={60} height={50} fill="none" stroke="#2563a0" strokeWidth="0.6" />
        <text x={40} y={62} textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#38e4ff">{towerLevel.toFixed(0)}%</text>
        <text x={40} y={76} textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#ffb13b">{towerTemp.toFixed(1)}°C</text>
      </g>
    </g>
  );
};

export default function SchematicView({ pumps, towers, simRefs, onPumpClick, loopMeta }) {
  return (
    <svg viewBox="0 0 1850 1100" preserveAspectRatio="xMidYMid meet" className="w-full h-full" data-testid="schematic-svg">
      <defs>
        <linearGradient id="motorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="50%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
        <radialGradient id="fanShadow" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#050505" />
        </radialGradient>
      </defs>

      {/* Top loop - KULE-1 */}
      <Loop
        y={20}
        label="KULE-1"
        pumps={pumps}
        pumpIds={loopMeta.loop1.ids}
        towerTemp={towers.KULE_1.temp}
        towerLevel={towers.KULE_1.level}
        mainBar={loopMeta.loop1.bar}
        mainFlow={loopMeta.loop1.flow}
        mainTemp={loopMeta.loop1.temp}
        returnTemp={loopMeta.loop1.returnTemp}
        simRefs={simRefs}
        onPumpClick={onPumpClick}
      />

      {/* Bottom loop - KULE-2 */}
      <Loop
        y={560}
        label="KULE-2"
        pumps={pumps}
        pumpIds={loopMeta.loop2.ids}
        towerTemp={towers.KULE_2.temp}
        towerLevel={towers.KULE_2.level}
        mainBar={loopMeta.loop2.bar}
        mainFlow={loopMeta.loop2.flow}
        mainTemp={loopMeta.loop2.temp}
        returnTemp={loopMeta.loop2.returnTemp}
        simRefs={simRefs}
        onPumpClick={onPumpClick}
      />
    </svg>
  );
}
