import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Genel Bakış", num: "01" },
  { to: "/kazan", label: "Kazan Pompaları", num: "02" },
  { to: "/degazor", label: "Degazör Pompaları", num: "03" },
  { to: "/isg", label: "İSG Revir / Isıtma", num: "04" },
  { to: "/hidrofor", label: "Hidrofor", num: "05" },
  { to: "/filtreleme", label: "Filtreleme", num: "06" },
];

export default function NavBar({ totals }) {
  return (
    <header className="bg-white border-b border-slate-300 shadow-sm" data-testid="nav-bar">
      <div className="px-5 py-2.5 flex items-center gap-4">
        <div className="w-9 h-9 rounded bg-gradient-to-br from-[#cf2027] to-[#7a0f15] flex items-center justify-center font-bold text-white text-base shadow-inner">G</div>
        <div>
          <div className="text-base font-bold tracking-wider text-slate-800">Grundfos · Pompa İstasyonu SCADA</div>
          <div className="text-[11px] text-slate-500">Canlı şematik · 3D pompa simülasyonu</div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {totals && (
            <>
              <Stat label="Çalışan" value={`${totals.activeCount}/${totals.totalCount}`} color="text-green-600" />
              <Stat label="Toplam Güç" value={`${totals.totalKw.toFixed(1)} kW`} color="text-amber-600" />
              <Stat label="Ort. Basınç" value={`${totals.avgBar.toFixed(2)} bar`} color="text-sky-600" />
              <Stat label="Arıza" value={totals.faultCount} color={totals.faultCount ? "text-red-600" : "text-slate-400"} />
            </>
          )}
        </div>
      </div>
      <nav className="flex border-t border-slate-200 bg-slate-50">
        {NAV_ITEMS.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === "/"}
            data-testid={`nav-${n.to.replace("/", "") || "home"}`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-3 border-r border-slate-200 text-xs uppercase tracking-wider transition ${
                isActive
                  ? "bg-white text-slate-900 border-b-2 border-b-[#cf2027] font-bold"
                  : "text-slate-500 hover:bg-white hover:text-slate-700"
              }`
            }
          >
            <span className="font-mono text-[10px] opacity-60">{n.num}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

const Stat = ({ label, value, color }) => (
  <div className="text-right">
    <div className="text-[9px] uppercase tracking-widest text-slate-500">{label}</div>
    <div className={`font-mono font-bold text-sm leading-none ${color}`}>{value}</div>
  </div>
);
