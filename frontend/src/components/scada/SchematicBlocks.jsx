import React from "react";
import PumpRender from "@/components/scada/PumpRender";
import { PUMP_CATALOG } from "@/hooks/useSimulation";

/* Reusable building blocks for any slide */

export const ValueLabel = ({ label, value, green }) => (
  <div className="flex items-center gap-1 select-none whitespace-nowrap">
    <span className="text-[11px] font-bold text-slate-800 tracking-wider">{label}</span>
    <span
      className={`px-2 py-0.5 border border-[#2563a0] text-[11px] font-semibold text-slate-900 min-w-[68px] text-center ${
        green ? "bg-[#a8e89a]" : "bg-white"
      }`}
    >
      {value}
    </span>
  </div>
);

export const PipeH = ({ width = 100, className = "" }) => (
  <div
    className={`h-[6px] bg-[#2563a0] ${className}`}
    style={{ width }}
  />
);
export const PipeV = ({ height = 40, className = "" }) => (
  <div className={`w-[6px] bg-[#2563a0] mx-auto ${className}`} style={{ height }} />
);
export const PipeArrow = ({ className = "" }) => (
  <div
    className={`w-0 h-0 ${className}`}
    style={{
      borderTop: "8px solid transparent",
      borderBottom: "8px solid transparent",
      borderLeft: "14px solid #2563a0",
    }}
  />
);

/* Single pump card with 3D pump above, value labels around */
export const PumpCard = ({ id, pump, onSelect, selected }) => {
  const def = PUMP_CATALOG[id];
  const bar = pump.bar;
  const ring = pump.fault ? "ring-red-500" : pump.on ? "ring-green-400" : "ring-slate-300";

  return (
    <div
      className={`flex flex-col items-center select-none cursor-pointer hover:bg-slate-50 transition ${
        selected ? "ring-2 ring-offset-2 " + ring : ""
      }`}
      onClick={() => onSelect && onSelect(id)}
      data-testid={`pump-card-${id}`}
    >
      {/* Single FBS - upper pressure */}
      <div className="mb-1">
        <ValueLabel label="FBS" value={`${pump.fbsTop[0].toFixed(2)} Bar`} />
      </div>

      {/* EG kW + horizontal feed pipe + vertical drop */}
      <div className="flex items-center w-[200px]">
        <ValueLabel label="EG" value={`${pump.kw.toFixed(2)} kW`} />
      </div>
      <PipeH width={200} className="my-1" />
      <PipeV height={20} />

      {/* 3D Pump (vertical or horizontal based on group) */}
      <div className="relative">
        <PumpRender id={id} pump={pump} />
        {/* Label */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white border border-[#2563a0] text-xs font-bold tracking-widest text-[#0a3a5a]">
          {id}
        </div>
      </div>

      <PipeV height={20} className="mt-2" />
      <PipeH width={200} />

      {/* Single VS - lower vacuum */}
      <div className="mt-1">
        <ValueLabel label="VS" value={`${pump.vsTop[0].toFixed(0)} Pa`} />
      </div>
    </div>
  );
};

/* Output cluster: BS (green Bar), DM (flow), SS (temp) → KULE label */
export const OutputCluster = ({ mainBar, mainFlow = null, mainTemp = null, kuleLabel, returnTemp = null }) => (
  <div className="flex flex-col gap-4 items-start">
    <div className="flex items-center gap-2">
      <PipeArrow />
      <ValueLabel label="BS" value={`${mainBar.toFixed(2)} Bar`} green />
      {mainFlow !== null && (
        <>
          <PipeH width={16} />
          <ValueLabel label="DM" value={`${mainFlow.toFixed(1)} m³/h`} />
        </>
      )}
      {mainTemp !== null && (
        <>
          <PipeH width={16} />
          <ValueLabel label="SS" value={`${mainTemp.toFixed(1)} °C`} />
        </>
      )}
      <PipeH width={30} />
      <PipeArrow />
      {kuleLabel && (
        <div className="ml-2 text-4xl font-black text-slate-800 tracking-wider">{kuleLabel}</div>
      )}
    </div>
    {returnTemp !== null && (
      <div className="flex items-center gap-2">
        <PipeArrow className="rotate-180" />
        <PipeH width={120} />
        <ValueLabel label="SS" value={`${returnTemp.toFixed(1)} °C`} />
        <PipeH width={40} />
      </div>
    )}
  </div>
);
