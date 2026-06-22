import React from "react";
import { Dial, DigitalReadout } from "@/components/scada/Gauge";

export default function RightPanel({ totals, towers, alarms, history, onAck }) {
  return (
    <div className="h-full flex flex-col gap-3" data-testid="right-panel">

      {/* Tanks / Kule */}
      <div className="scada-panel">
        <div className="scada-panel-header">Soğutma Kuleleri</div>
        <div className="p-3 grid grid-cols-2 gap-3">
          {[["KULE_1","KULE-1"], ["KULE_2","KULE-2"]].map(([id, label]) => {
            const t = towers[id];
            return (
              <div key={id} className="border border-cyan-900/50 rounded p-2 bg-[#08131e]" data-testid={`tower-${id}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-cyan-200 font-bold">{label}</span>
                  <span className="led-light on-green status-pulse"></span>
                </div>
                {/* Level bar */}
                <div className="h-24 bg-[#020608] border border-cyan-900 rounded relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                    style={{
                      height: `${t.level}%`,
                      background: "linear-gradient(0deg, #1fc8d6 0%, #38e4ff 100%)",
                      boxShadow: "inset 0 -2px 8px rgba(31, 200, 214, 0.6), 0 0 12px rgba(56, 228, 255, 0.4)",
                    }}
                  />
                  {/* Level scale ticks */}
                  {[0,25,50,75,100].map((v) => (
                    <div key={v} className="absolute left-0 right-0 border-t border-cyan-900/60 flex items-center" style={{ bottom: `${v}%` }}>
                      <span className="absolute -right-0.5 -top-2 text-[7px] text-cyan-600 bg-[#020608] px-0.5">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 grid grid-cols-2 gap-1">
                  <div className="bezel py-0.5">
                    <div className="text-[8px] text-cyan-600 uppercase">SEVİYE</div>
                    <div className="led-digit led-cyan text-xs text-right">{t.level.toFixed(1)}%</div>
                  </div>
                  <div className="bezel py-0.5">
                    <div className="text-[8px] text-cyan-600 uppercase">SICAKLIK</div>
                    <div className="led-digit led-amber text-xs text-right">{t.temp.toFixed(1)}°C</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System totals - dials */}
      <div className="scada-panel">
        <div className="scada-panel-header">Sistem Toplam Değerleri</div>
        <div className="p-3 grid grid-cols-3 gap-2 justify-items-center">
          <Dial value={totals.totalKw} max={40} unit="kW" label="Toplam Güç" color="#ffb13b" />
          <Dial value={totals.totalFlow} max={200} unit="m³/h" label="Toplam Debi" color="#38e4ff" />
          <Dial value={totals.avgBar} max={8} unit="Bar" label="Ort. Basınç" color="#36ff7a" danger={totals.avgBar > 6.5} />
        </div>
      </div>

      {/* Trend chart */}
      <div className="scada-panel flex-1 min-h-0">
        <div className="scada-panel-header flex items-center justify-between">
          <span>Trend · Toplam Güç (kW)</span>
          <span className="text-[9px] text-cyan-600">Son 30sn</span>
        </div>
        <div className="p-3 h-32">
          <TrendChart data={history} />
        </div>
      </div>

      {/* Alarms */}
      <div className="scada-panel">
        <div className="scada-panel-header flex items-center justify-between">
          <span>Alarm Listesi</span>
          <button onClick={onAck} className="btn-industrial text-[9px] py-0.5 px-2" data-testid="btn-ack-alarms">SUSTUR</button>
        </div>
        <div className="max-h-32 overflow-y-auto scada-scroll">
          {alarms.length === 0 ? (
            <div className="px-3 py-3 text-[10px] text-cyan-600 uppercase tracking-widest text-center">
              ◆ Aktif alarm yok ◆
            </div>
          ) : alarms.map((a) => (
            <div key={a.id + a.ts} className="px-2 py-1 border-b border-cyan-950 flex items-center gap-2" data-testid="alarm-item">
              <span className={`led-light ${a.level === "CRITICAL" ? "on-red alarm-blink" : "on-amber"}`}></span>
              <span className={`text-[9px] font-bold ${a.level === "CRITICAL" ? "text-red-400" : "text-amber-400"}`}>{a.level}</span>
              <span className="text-[10px] text-cyan-200">{a.msg}</span>
              <span className="ml-auto text-[9px] text-cyan-700">{new Date(a.ts).toLocaleTimeString("tr-TR", { hour12: false })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TrendChart = ({ data }) => {
  if (!data.length) return <div className="text-[10px] text-cyan-700 text-center pt-6">Veri bekleniyor...</div>;
  const max = Math.max(...data.map(d => d.kw), 1);
  const w = 100 / Math.max(data.length, 1);
  return (
    <div className="h-full flex items-end gap-px relative">
      {/* horizontal grid lines */}
      {[25,50,75].map(p => (
        <div key={p} className="absolute left-0 right-0 border-t border-cyan-900/40" style={{ bottom: `${p}%` }}>
          <span className="absolute -top-2 -right-1 text-[7px] text-cyan-700">{((max * p)/100).toFixed(1)}</span>
        </div>
      ))}
      {data.map((d, i) => (
        <div
          key={i}
          className="trend-bar flex-1 transition-all"
          style={{ height: `${Math.max(2, (d.kw / max) * 100)}%`, width: `${w}%` }}
        />
      ))}
    </div>
  );
};
