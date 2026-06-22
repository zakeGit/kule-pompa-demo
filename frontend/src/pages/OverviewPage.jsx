import React from "react";
import { useOutletContext } from "react-router-dom";
import { useSim } from "@/hooks/SimContext";
import { OVERVIEW_LOOPS } from "@/hooks/useSimulation";
import { PumpCard, OutputCluster, PipeH, PipeV, PipeArrow, ValueLabel } from "@/components/scada/SchematicBlocks";

/* -------- Slide 1: Genel Bakış (2 cooling loops × 4 pumps) -------- */
export default function OverviewPage() {
  const sim = useSim();
  const { selectedId, setSelectedId } = useOutletContext();

  const Loop = ({ loop, towerKey, label, meta }) => {
    const tower = sim.towers[towerKey];
    return (
      <div className="flex items-start gap-6 py-6 border-b border-dashed border-slate-200 last:border-0">
        {/* Pump row */}
        <div className="flex gap-6">
          {loop.ids.map((id) => (
            <PumpCard key={id} id={id} pump={sim.pumps[id]} onSelect={setSelectedId} selected={selectedId === id} />
          ))}
        </div>
        {/* Output cluster + tower */}
        <div className="flex flex-col gap-3 pt-12">
          <OutputCluster
            mainBar={meta.bar}
            mainFlow={meta.flow}
            mainTemp={meta.temp}
            kuleLabel={label}
            returnTemp={meta.returnTemp}
          />
          {/* Tower mini panel */}
          <div className="ml-6 w-32 bg-slate-900 rounded p-2 text-white">
            <div className="text-[10px] uppercase tracking-widest text-cyan-300 mb-1">Kule Seviyesi</div>
            <div className="h-20 bg-slate-800 rounded relative overflow-hidden border border-slate-700">
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                style={{
                  height: `${tower.level}%`,
                  background: "linear-gradient(0deg, #0e8ea0 0%, #38e4ff 100%)",
                  boxShadow: "inset 0 -2px 6px rgba(56, 228, 255, 0.6)",
                }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] font-mono">
              <span className="text-cyan-300">{tower.level.toFixed(0)}%</span>
              <span className="text-amber-300">{tower.temp.toFixed(1)}°C</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-w-max">
      <PageTitle title="Genel Bakış" subtitle="Slide 1 · İki soğutma kulesi · 8 pompa" />
      <Loop loop={OVERVIEW_LOOPS.loop1} towerKey="KULE_1" label="KULE-1" meta={sim.loopMeta.loop1} />
      <Loop loop={OVERVIEW_LOOPS.loop2} towerKey="KULE_2" label="KULE-2" meta={sim.loopMeta.loop2} />
    </div>
  );
}

export const PageTitle = ({ title, subtitle }) => (
  <div className="mb-4">
    <h1 className="text-2xl font-black tracking-wider text-slate-900">{title}</h1>
    {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
  </div>
);
