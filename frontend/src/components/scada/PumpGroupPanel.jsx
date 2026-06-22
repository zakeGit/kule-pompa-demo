import React from "react";
import { PUMP_CATALOG } from "@/hooks/useSimulation";

const GROUPS = [
  { name: "Kazan Pompaları", color: "#cf2027", ids: ["KAZAN_1", "KAZAN_2", "KAZAN_3"] },
  { name: "Degazör Pompaları", color: "#e85a1a", ids: ["DEGZ_1", "DEGZ_2"] },
  { name: "İSG Revir / Isıtma", color: "#7a3dcf", ids: ["ISG_1"] },
  { name: "Kullanım Suyu Hidrofor", color: "#1faf6b", ids: ["HIDR_1"] },
  { name: "Filtreleme Pompaları", color: "#1f6bcf", ids: ["FILT_1", "FILT_2"] },
];

export default function PumpGroupPanel({ pumps, onToggle, onFault, onSetpoint }) {
  return (
    <div className="scada-panel h-full flex flex-col" data-testid="pump-panel">
      <div className="scada-panel-header flex items-center justify-between">
        <span>Pompa Kontrol Paneli</span>
        <span className="text-cyan-500 text-[10px]">P-101 → P-502</span>
      </div>
      <div className="flex-1 overflow-y-auto scada-scroll p-3 space-y-3">
        {GROUPS.map((g) => (
          <div key={g.name} className="border border-cyan-900/40 rounded">
            <div className="flex items-center justify-between px-2 py-1 bg-[#0a1c2a] border-b border-cyan-900/40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm" style={{ background: g.color, boxShadow: `0 0 6px ${g.color}` }}></span>
                <span className="text-[11px] uppercase tracking-wider text-cyan-200 font-bold">{g.name}</span>
              </div>
              <span className="text-[9px] text-cyan-600">{g.ids.length} POMPA</span>
            </div>
            <div className="divide-y divide-cyan-950">
              {g.ids.map((id) => {
                const p = pumps[id];
                const def = PUMP_CATALOG[id];
                const status = p.fault ? "ARIZA" : p.on ? "ÇALIŞIYOR" : "HAZIR";
                const statusClass = p.fault ? "led-red alarm-blink" : p.on ? "led-green" : "led-dim";
                return (
                  <div key={id} className="px-2 py-2" data-testid={`pump-${id}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`led-light ${p.fault ? "on-red" : p.on ? "on-green" : "off"} ${p.on && !p.fault ? "status-pulse" : ""}`}></span>
                      <span className="text-xs font-bold text-cyan-100">{def.label}</span>
                      <span className={`text-[9px] led-digit ${statusClass}`}>{status}</span>
                      <span className="ml-auto text-[9px] text-cyan-600">{p.runtimeMin.toFixed(1)} dk</span>
                    </div>
                    {/* Live values row */}
                    <div className="grid grid-cols-4 gap-1 text-[9px]">
                      <ValueCell label="BAR" value={p.bar} unit="bar" color="led-cyan" warn={p.on && p.bar > def.bar[1] * 1.1} />
                      {def.hasFlow && <ValueCell label="DEBİ" value={p.flow} unit="m³/h" color="led-green" />}
                      <ValueCell label="GÜÇ" value={p.kw} unit="kW" color="led-amber" />
                      <ValueCell label="SIC." value={p.temp} unit="°C" color="led-amber" warn={p.temp > 90} />
                    </div>
                    {/* Setpoint slider */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[9px] text-cyan-500 uppercase">SP</span>
                      <input
                        type="range"
                        min={def.bar[0] * 0.7}
                        max={def.bar[1] * 1.3}
                        step={0.05}
                        value={p.setpointBar}
                        onChange={(e) => onSetpoint(id, parseFloat(e.target.value))}
                        className="flex-1 h-1 accent-cyan-400"
                        data-testid={`setpoint-${id}`}
                      />
                      <span className="text-[9px] led-digit led-cyan w-10 text-right">{p.setpointBar.toFixed(2)}b</span>
                    </div>
                    {/* Buttons */}
                    <div className="mt-1.5 flex gap-1">
                      <button
                        className={`btn-industrial flex-1 text-[10px] py-1 ${p.on ? "active" : ""}`}
                        onClick={() => onToggle(id)}
                        data-testid={`btn-toggle-${id}`}
                      >
                        {p.on ? "■ DURDUR" : "▶ BAŞLAT"}
                      </button>
                      <button
                        className={`btn-industrial danger text-[10px] py-1 ${p.fault ? "active" : ""}`}
                        onClick={() => onFault(id)}
                        data-testid={`btn-fault-${id}`}
                        title="Arıza simüle et / sıfırla"
                      >
                        {p.fault ? "RESET" : "ARIZA"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ValueCell = ({ label, value, unit, color, warn }) => (
  <div className={`bezel py-0.5 px-1 ${warn ? "border-red-500" : ""}`} style={warn ? { borderColor: "#ff3b4e" } : {}}>
    <div className="text-[8px] text-cyan-600 uppercase">{label}</div>
    <div className={`led-digit ${warn ? "led-red" : color} text-xs leading-tight text-right`}>
      {value.toFixed(value < 10 ? 2 : 1)}
    </div>
  </div>
);
