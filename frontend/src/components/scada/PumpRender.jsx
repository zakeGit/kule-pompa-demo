import React from "react";
import Pump3D from "@/components/scada/Pump3D";
import VerticalPump3D from "@/components/scada/VerticalPump3D";
import { PUMP_CATALOG } from "@/hooks/useSimulation";

/* Decides which pump visual to use based on the catalog's "vertical" flag.
   Vertical pumps (Grundfos CR style): Kazan, İSG, Hidrofor
   Horizontal pumps: Degazör, Filtreleme */

export const VERTICAL_GROUPS = new Set(["Kazan", "İSG / Isıtma", "Hidrofor"]);

export default function PumpRender({ id, pump, size = "md" }) {
  const def = PUMP_CATALOG[id];
  const isVertical = VERTICAL_GROUPS.has(def.group);

  if (isVertical) {
    const w = size === "lg" ? 170 : 150;
    const h = size === "lg" ? 260 : 230;
    return <VerticalPump3D on={pump.on} fault={pump.fault} color={def.color} width={w} height={h} />;
  }
  const w = size === "lg" ? 230 : 210;
  const h = size === "lg" ? 175 : 160;
  return <Pump3D on={pump.on} fault={pump.fault} color={def.color} width={w} height={h} />;
}

export const isVerticalPump = (id) => VERTICAL_GROUPS.has(PUMP_CATALOG[id].group);
