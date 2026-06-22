import React, { useEffect, useState } from "react";

export default function TopBar({ totals }) {
  const [clock, setClock] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = clock.toLocaleTimeString("tr-TR", { hour12: false });
  const date = clock.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="scada-panel flex items-center px-4 py-2 border-b" data-testid="scada-topbar">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-[#cf2027] to-[#7a0f15] flex items-center justify-center font-bold text-white text-xs shadow-inner shadow-black/60">G</div>
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-cyan-300 font-bold">Grundfos · SCADA</div>
          <div className="text-[10px] text-cyan-600 tracking-wider">POMPA İSTASYONU · CANLI İZLEME</div>
        </div>
      </div>

      <div className="ml-8 flex items-center gap-2 text-[10px] uppercase tracking-widest">
        <span className="led-light on-green status-pulse"></span>
        <span className="text-green-400">SİSTEM AKTİF</span>
        <span className="text-cyan-700 mx-2">|</span>
        <span className="text-cyan-400">İLETİŞİM: <span className="led-digit led-green">ONLINE</span></span>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Stat label="ÇALIŞAN" value={`${totals.activeCount}/${totals.totalCount}`} color="led-green" testid="stat-active" />
        <Stat label="TOPLAM GÜÇ" value={`${totals.totalKw.toFixed(1)} kW`} color="led-amber" testid="stat-power" />
        <Stat label="TOPLAM DEBİ" value={`${totals.totalFlow.toFixed(1)} m³/h`} color="led-cyan" testid="stat-flow" />
        <Stat label="ORT. BASINÇ" value={`${totals.avgBar.toFixed(2)} bar`} color="led-cyan" testid="stat-pressure" />
        <Stat label="ARIZA" value={`${totals.faultCount}`} color={totals.faultCount ? "led-red" : "led-dim"} testid="stat-fault" />
        <div className="bezel text-right">
          <div className="text-[9px] uppercase tracking-widest text-cyan-400">SAAT</div>
          <div className="led-digit led-green text-lg leading-none">{time}</div>
          <div className="text-[9px] text-cyan-600">{date}</div>
        </div>
      </div>
    </div>
  );
}

const Stat = ({ label, value, color, testid }) => (
  <div className="bezel min-w-[110px]" data-testid={testid}>
    <div className="text-[9px] uppercase tracking-widest text-cyan-400">{label}</div>
    <div className={`led-digit ${color} text-lg leading-none`}>{value}</div>
  </div>
);
