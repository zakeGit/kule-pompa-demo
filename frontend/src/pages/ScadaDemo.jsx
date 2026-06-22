import React, { useEffect, useState } from "react";
import Scene3D from "@/components/scada/Scene3D";
import TopBar from "@/components/scada/TopBar";
import PumpGroupPanel from "@/components/scada/PumpGroupPanel";
import RightPanel from "@/components/scada/RightPanel";
import { useSimulation, PUMP_CATALOG } from "@/hooks/useSimulation";
import { toast } from "sonner";

export default function ScadaDemo() {
  const sim = useSimulation();
  const [introOpen, setIntroOpen] = useState(true);

  // Toast on new alarms
  useEffect(() => {
    if (sim.alarms[0]) {
      const a = sim.alarms[0];
      const key = a.id + a.ts;
      if (key !== window.__lastToastKey) {
        window.__lastToastKey = key;
        if (a.level === "CRITICAL") {
          toast.error(a.msg, { description: "Kritik alarm", duration: 4000 });
        }
      }
    }
  }, [sim.alarms]);

  const startAll = () => {
    Object.keys(PUMP_CATALOG).forEach((id) => {
      if (!sim.pumps[id].on && !sim.pumps[id].fault) sim.togglePump(id);
    });
    toast.success("Tüm pompalar başlatıldı");
  };
  const stopAll = () => {
    Object.keys(PUMP_CATALOG).forEach((id) => {
      if (sim.pumps[id].on) sim.togglePump(id);
    });
    toast("Tüm pompalar durduruldu");
  };

  return (
    <div className="min-h-screen w-full bg-[#050a10] text-cyan-100 grid-bg flex flex-col" data-testid="scada-demo">
      <TopBar totals={sim.totals} />

      {/* Action bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-cyan-900/40 bg-[#08131e]" data-testid="action-bar">
        <span className="text-[10px] uppercase tracking-widest text-cyan-500 mr-2">Hızlı Komutlar:</span>
        <button onClick={startAll} className="btn-industrial active" data-testid="btn-start-all">▶ TÜMÜNÜ BAŞLAT</button>
        <button onClick={stopAll} className="btn-industrial" data-testid="btn-stop-all">■ TÜMÜNÜ DURDUR</button>
        <button
          onClick={() => {
            const ids = Object.keys(PUMP_CATALOG);
            sim.triggerFault(ids[Math.floor(Math.random() * ids.length)]);
          }}
          className="btn-industrial danger"
          data-testid="btn-random-fault"
        >
          ⚠ RASTGELE ARIZA
        </button>
        <div className="ml-auto flex items-center gap-3 text-[10px] uppercase tracking-widest">
          <Legend color="#cf2027" label="Kazan" />
          <Legend color="#e85a1a" label="Degazör" />
          <Legend color="#7a3dcf" label="İSG" />
          <Legend color="#1faf6b" label="Hidrofor" />
          <Legend color="#1f6bcf" label="Filtre" />
        </div>
      </div>

      {/* Main grid: left controls | center 3D | right panel */}
      <div className="flex-1 grid grid-cols-12 gap-3 p-3 min-h-0">
        {/* Left: pump groups */}
        <div className="col-span-3 min-h-0">
          <PumpGroupPanel
            pumps={sim.pumps}
            onToggle={sim.togglePump}
            onFault={sim.triggerFault}
            onSetpoint={sim.setSetpoint}
          />
        </div>

        {/* Center: 3D scene */}
        <div className="col-span-6 min-h-0 scada-panel relative overflow-hidden" data-testid="scene-3d">
          <div className="scada-panel-header flex items-center justify-between">
            <span>3D Tesis Görünümü · Canlı Simülasyon</span>
            <span className="text-[10px] text-cyan-500">Sürükle: döndür · Kaydır: yakınlaştır</span>
          </div>
          <div className="absolute inset-0 top-[28px] scada-scanlines">
            <Scene3D pumps={sim.pumps} towers={sim.towers} />
          </div>
          {/* Corner HUD */}
          <div className="absolute bottom-3 left-3 text-[9px] text-cyan-500 bg-[#020608]/80 border border-cyan-900 px-2 py-1 rounded font-mono">
            <div>CAM: ISO-PERSP</div>
            <div>FPS: <span className="led-digit led-green">60</span></div>
            <div>NODE: <span className="led-digit led-cyan">PLC-01</span></div>
          </div>
          <div className="absolute bottom-3 right-3 text-[9px] text-cyan-500 bg-[#020608]/80 border border-cyan-900 px-2 py-1 rounded font-mono text-right">
            <div>P&amp;ID: GRD-MEK-001</div>
            <div>REV: <span className="led-digit led-amber">2.4.1</span></div>
          </div>
        </div>

        {/* Right: gauges, tanks, alarms, trends */}
        <div className="col-span-3 min-h-0 overflow-y-auto scada-scroll">
          <RightPanel
            totals={sim.totals}
            towers={sim.towers}
            alarms={sim.alarms}
            history={sim.history}
            onAck={sim.acknowledgeAlarms}
          />
        </div>
      </div>

      {/* Status footer */}
      <div className="border-t border-cyan-900/40 bg-[#08131e] px-4 py-1.5 flex items-center gap-4 text-[10px] uppercase tracking-widest text-cyan-500" data-testid="footer">
        <span className="led-light on-green"></span>
        <span>PLC-S7-1500</span>
        <span className="text-cyan-800">|</span>
        <span>MODBUS TCP · <span className="led-digit led-green">192.168.1.10</span></span>
        <span className="text-cyan-800">|</span>
        <span>I/O: <span className="led-digit led-green">128/128</span></span>
        <span className="text-cyan-800">|</span>
        <span>WATCHDOG: <span className="led-digit led-green">OK</span></span>
        <span className="ml-auto text-cyan-600">© Grundfos Pompa İstasyonu Demo · v2.4.1</span>
      </div>

      {/* Intro modal */}
      {introOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6" data-testid="intro-modal">
          <div className="scada-panel max-w-2xl w-full p-6 relative">
            <div className="scada-panel-header -mx-6 -mt-6 mb-4 px-4">Hoş Geldiniz · Grundfos SCADA Demo</div>
            <h2 className="text-2xl font-bold text-cyan-100 tracking-wide">3D Pompa İstasyonu Canlı Simülasyon</h2>
            <p className="mt-3 text-sm text-cyan-300 leading-relaxed">
              Bu demo, gerçek bir Grundfos pompa istasyonunu üç boyutlu olarak görselleştirir. <span className="text-cyan-100 font-bold">9 pompa</span>, <span className="text-cyan-100 font-bold">2 soğutma kulesi</span> ve canlı hareket eden borular, mantıklı endüstriyel değerler ile çalışır.
            </p>
            <ul className="mt-4 space-y-1.5 text-[11px] text-cyan-400">
              <li>• Sol panelden tek tek pompaları <span className="text-green-400 font-bold">BAŞLATIN</span> / <span className="text-red-400 font-bold">DURDURUN</span>.</li>
              <li>• Setpoint sürgüleri ile basınç hedeflerini değiştirin.</li>
              <li>• Sağ panelde toplam güç, debi, kule seviyeleri ve trend grafiklerini görün.</li>
              <li>• 3D sahnede fareyle sürükleyerek tesisi döndürebilirsiniz.</li>
              <li>• "ARIZA" butonu ile herhangi bir pompada hata simüle edebilirsiniz — alarm tetiklenir.</li>
            </ul>
            <div className="mt-6 flex justify-end gap-2">
              <button className="btn-industrial active" onClick={() => { setIntroOpen(false); setTimeout(startAll, 400); }} data-testid="btn-intro-start">
                ▶ DEMO BAŞLAT (TÜMÜNÜ ÇALIŞTIR)
              </button>
              <button className="btn-industrial" onClick={() => setIntroOpen(false)} data-testid="btn-intro-skip">
                Manuel İncele
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color, boxShadow: `0 0 6px ${color}` }}></span>
    <span className="text-cyan-400">{label}</span>
  </div>
);
