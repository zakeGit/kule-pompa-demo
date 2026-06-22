import React from "react";
import { useOutletContext } from "react-router-dom";
import { useSim } from "@/hooks/SimContext";
import { PUMP_CATALOG } from "@/hooks/useSimulation";
import Pump3D from "@/components/scada/Pump3D";
import { ValueLabel, PipeH, PipeV, PipeArrow } from "@/components/scada/SchematicBlocks";
import { PageTitle } from "@/pages/OverviewPage";

/* Generic "group" page (Slides 2,3,6) - pumps in a row, with FBS top, EG left, DM flow, BS pressure */
export default function GroupPage({
  pageTitle,
  pageSubtitle,
  pumpIds,
  showFlow = true,
  showFlowMeter = true,
}) {
  const sim = useSim();
  const { selectedId, setSelectedId } = useOutletContext();

  // aggregate
  const onCount = pumpIds.filter(i => sim.pumps[i].on && !sim.pumps[i].fault).length;
  const onPumps = pumpIds.filter(i => sim.pumps[i].on && !sim.pumps[i].fault);
  const avgBar = onPumps.length ? onPumps.reduce((s, i) => s + sim.pumps[i].bar, 0) / onPumps.length : 0;
  const totalFlow = pumpIds.reduce((s, i) => s + sim.pumps[i].flow, 0);

  return (
    <div className="p-8 min-w-max">
      <PageTitle title={pageTitle} subtitle={pageSubtitle} />

      <div className="flex items-start gap-10 mt-6">
        {/* Pump cards row */}
        <div className="flex items-start gap-10">
          {pumpIds.map((id, idx) => {
            const pump = sim.pumps[id];
            const def = PUMP_CATALOG[id];
            const selected = selectedId === id;
            const ringClr = pump.fault ? "ring-red-500" : pump.on ? "ring-green-400" : "ring-transparent";
            return (
              <div key={id} className="flex flex-col items-center">
                {/* numbered banner */}
                <div className="mb-2 text-3xl font-black text-slate-300">{idx + 1}</div>
                {/* FBS box above */}
                <ValueLabel label="FBS" value={`${pump.fbsTop[0].toFixed(2)} Bar`} />
                <PipeV height={14} />
                {/* EG box on left of pump area */}
                <div className="flex items-center gap-2">
                  <ValueLabel label="EG" value={`${pump.kw.toFixed(2)} kW`} />
                  <PipeH width={20} />
                  {/* 3D pump */}
                  <div
                    className={`cursor-pointer ring-2 ring-offset-2 ${selected ? ringClr : "ring-transparent"} transition`}
                    onClick={() => setSelectedId(id)}
                    data-testid={`pump-card-${id}`}
                  >
                    <Pump3D on={pump.on} fault={pump.fault} color={def.color} width={210} height={160} />
                  </div>
                </div>
                {/* Pump label */}
                <div className="mt-1 px-3 py-0.5 bg-white border border-[#2563a0] text-xs font-bold tracking-widest text-[#0a3a5a]">
                  {id}
                </div>
                {/* status & runtime */}
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600">
                  <span className={`w-2 h-2 rounded-full ${pump.fault ? "bg-red-500 animate-pulse" : pump.on ? "bg-green-500" : "bg-slate-400"}`} />
                  <span>{pump.fault ? "Arıza" : pump.on ? "Çalışıyor" : "Hazır"}</span>
                  <span className="font-mono text-slate-400">· {pump.runtimeMin.toFixed(1)} dk</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right side: main pipe outputs (BS + DM optional) */}
        <div className="flex flex-col gap-3 pt-24">
          <div className="flex items-center gap-2">
            <PipeArrow />
            <ValueLabel label="BS" value={`${avgBar.toFixed(2)} Bar`} green />
            {showFlowMeter && (
              <>
                <PipeH width={20} />
                <ValueLabel label="DM" value={`${totalFlow.toFixed(1)} m³/h`} />
              </>
            )}
            <PipeH width={40} />
            <PipeArrow />
          </div>
          {/* Summary stat */}
          <div className="mt-6 bg-slate-100 border border-slate-300 rounded p-4 w-72">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Grup Özeti</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-slate-500 text-[10px] uppercase">Çalışan</div>
                <div className="font-mono font-bold text-green-700 text-base">{onCount} / {pumpIds.length}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px] uppercase">Ort. Basınç</div>
                <div className="font-mono font-bold text-sky-700 text-base">{avgBar.toFixed(2)} bar</div>
              </div>
              {showFlowMeter && (
                <div>
                  <div className="text-slate-500 text-[10px] uppercase">Toplam Debi</div>
                  <div className="font-mono font-bold text-amber-700 text-base">{totalFlow.toFixed(1)} m³/h</div>
                </div>
              )}
              <div>
                <div className="text-slate-500 text-[10px] uppercase">Toplam Güç</div>
                <div className="font-mono font-bold text-slate-700 text-base">
                  {pumpIds.reduce((s, i) => s + sim.pumps[i].kw, 0).toFixed(2)} kW
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
