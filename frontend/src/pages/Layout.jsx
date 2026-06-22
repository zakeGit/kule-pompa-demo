import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "@/components/scada/NavBar";
import { useSim, SimProvider } from "@/hooks/SimContext";
import { PUMP_CATALOG } from "@/hooks/useSimulation";
import { toast } from "sonner";

function InnerLayout() {
  const sim = useSim();
  const [selectedId, setSelectedId] = useState(null);
  const lastAlarmKey = React.useRef("");

  React.useEffect(() => {
    if (sim.alarms[0] && sim.alarms[0].id !== lastAlarmKey.current) {
      lastAlarmKey.current = sim.alarms[0].id;
      if (sim.alarms[0].level === "CRITICAL") {
        toast.error(sim.alarms[0].msg, { duration: 3000 });
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
    Object.keys(PUMP_CATALOG).forEach((id) => { if (sim.pumps[id].on) sim.togglePump(id); });
    toast("Tüm pompalar durduruldu");
  };
  const randomFault = () => {
    const ids = Object.keys(PUMP_CATALOG);
    sim.triggerFault(ids[Math.floor(Math.random() * ids.length)]);
  };

  const selected = selectedId ? sim.pumps[selectedId] : null;
  const selectedDef = selectedId ? PUMP_CATALOG[selectedId] : null;

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800 flex flex-col">
      <NavBar totals={sim.totals} />

      {/* Action bar */}
      <div className="bg-slate-100 border-b border-slate-300 px-5 py-2 flex items-center gap-2" data-testid="action-bar">
        <button onClick={startAll} className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-green-600 hover:bg-green-700 text-white rounded shadow-sm" data-testid="btn-start-all">▶ Tümünü Başlat</button>
        <button onClick={stopAll} className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-slate-600 hover:bg-slate-700 text-white rounded shadow-sm" data-testid="btn-stop-all">■ Tümünü Durdur</button>
        <button onClick={randomFault} className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-amber-600 hover:bg-amber-700 text-white rounded shadow-sm" data-testid="btn-random-fault">⚠ Rastgele Arıza</button>
        <span className="ml-auto text-[11px] text-slate-500">
          Pompa seçmek için üzerine tıklayın. <span className="font-semibold">Çalışırken fanlar döner.</span>
        </span>
      </div>

      <main className="flex-1 flex items-stretch overflow-hidden">
        <section className="flex-1 bg-white overflow-auto" data-testid="schematic-container">
          <Outlet context={{ selectedId, setSelectedId }} />
        </section>

        <aside className="w-72 bg-slate-50 border-l border-slate-300 flex flex-col" data-testid="side-panel">
          <div className="px-4 py-2 bg-slate-200 border-b border-slate-300 font-bold text-xs uppercase tracking-widest text-slate-700">
            Pompa Kontrol
          </div>
          {selected ? (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-lg text-slate-800">{selectedId}</div>
                  <div className="text-xs text-slate-500">{selectedDef.group}</div>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${selected.fault ? "bg-red-100 text-red-700" : selected.on ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
                  {selected.fault ? "Arıza" : selected.on ? "Çalışıyor" : "Hazır"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Kpi label="Basınç" value={`${selected.bar.toFixed(2)} bar`} />
                <Kpi label="Debi" value={`${selected.flow.toFixed(1)} m³/h`} />
                <Kpi label="Güç" value={`${selected.kw.toFixed(2)} kW`} />
                <Kpi label="Sıcaklık" value={`${selected.temp.toFixed(1)} °C`} />
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Setpoint Basınç</span>
                  <span className="font-bold text-slate-800">{selected.setpointBar.toFixed(2)} bar</span>
                </div>
                <input
                  type="range"
                  min={selectedDef.bar[0] * 0.7}
                  max={selectedDef.bar[1] * 1.3}
                  step={0.05}
                  value={selected.setpointBar}
                  onChange={(e) => sim.setSetpoint(selectedId, parseFloat(e.target.value))}
                  className="w-full"
                  data-testid={`setpoint-${selectedId}`}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => sim.togglePump(selectedId)} className={`flex-1 py-2 text-xs font-bold uppercase rounded ${selected.on ? "bg-slate-700 hover:bg-slate-800 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`} data-testid={`btn-toggle-${selectedId}`}>
                  {selected.on ? "■ Durdur" : "▶ Başlat"}
                </button>
                <button onClick={() => sim.triggerFault(selectedId)} className={`px-3 py-2 text-xs font-bold uppercase rounded ${selected.fault ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`} data-testid={`btn-fault-${selectedId}`}>
                  {selected.fault ? "Reset" : "Arıza"}
                </button>
              </div>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                Çalışma süresi: <span className="font-mono">{selected.runtimeMin.toFixed(1)} dk</span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-sm text-slate-500 text-center">
              Şemadan bir <span className="font-bold text-slate-700">pompayı seçin</span> ve buradan kontrol edin.
            </div>
          )}

          <div className="px-4 py-2 bg-slate-200 border-y border-slate-300 font-bold text-xs uppercase tracking-widest text-slate-700 mt-auto">
            Alarmlar
            <button onClick={sim.acknowledgeAlarms} className="float-right text-[10px] font-normal underline" data-testid="btn-ack-alarms">Sustur</button>
          </div>
          <div className="overflow-y-auto max-h-56">
            {sim.alarms.length === 0 ? (
              <div className="px-4 py-3 text-xs text-slate-400 text-center">Aktif alarm yok</div>
            ) : sim.alarms.map((a) => (
              <div key={a.id} className="px-3 py-2 border-b border-slate-200 text-xs" data-testid="alarm-item">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${a.level === "CRITICAL" ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} />
                  <span className={`font-bold ${a.level === "CRITICAL" ? "text-red-700" : "text-amber-700"}`}>{a.level}</span>
                  <span className="ml-auto text-[10px] text-slate-400">{new Date(a.ts).toLocaleTimeString("tr-TR", { hour12: false })}</span>
                </div>
                <div className="mt-0.5 text-slate-700">{a.msg}</div>
              </div>
            ))}
          </div>
        </aside>
      </main>

      <footer className="bg-white border-t border-slate-300 px-5 py-1.5 text-[10px] uppercase tracking-widest text-slate-500 flex gap-4">
        <span className="text-green-600">● PLC ONLINE</span>
        <span>MODBUS TCP · 192.168.1.10</span>
        <span>WATCHDOG OK</span>
        <span className="ml-auto">© Grundfos Pompa İstasyonu Demo v3.0</span>
      </footer>
    </div>
  );
}

export default function Layout() {
  return (
    <SimProvider>
      <InnerLayout />
    </SimProvider>
  );
}

const Kpi = ({ label, value }) => (
  <div className="bg-white border border-slate-300 rounded p-2">
    <div className="text-[10px] uppercase text-slate-500 tracking-wider">{label}</div>
    <div className="font-mono font-bold text-sm text-slate-800">{value}</div>
  </div>
);
