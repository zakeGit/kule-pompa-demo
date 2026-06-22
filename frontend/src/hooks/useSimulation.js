import { useEffect, useRef, useState, useCallback } from "react";

/* Full catalog - 9 pumps across all groups */
export const PUMP_CATALOG = {
  "K-1": { id: "K-1", group: "Kazan", color: "#cf2027", bar: [4.2, 5.5], flow: [22, 30], temp: [82, 92], kw: [5.5, 7.2], vacPa: [50, 120] },
  "K-2": { id: "K-2", group: "Kazan", color: "#cf2027", bar: [4.2, 5.5], flow: [22, 30], temp: [82, 92], kw: [5.5, 7.2], vacPa: [50, 120] },
  "K-3": { id: "K-3", group: "Kazan", color: "#cf2027", bar: [4.2, 5.5], flow: [22, 30], temp: [82, 92], kw: [5.5, 7.2], vacPa: [50, 120] },
  "D-1": { id: "D-1", group: "Degazör", color: "#e85a1a", bar: [2.4, 3.2], flow: [10, 14], temp: [70, 80], kw: [2.2, 3.0], vacPa: [30, 80] },
  "D-2": { id: "D-2", group: "Degazör", color: "#e85a1a", bar: [2.4, 3.2], flow: [10, 14], temp: [70, 80], kw: [2.2, 3.0], vacPa: [30, 80] },
  "I-1": { id: "I-1", group: "İSG / Isıtma", color: "#7a3dcf", bar: [3.0, 3.8], flow: [6, 9], temp: [60, 68], kw: [1.5, 2.2], vacPa: [40, 100] },
  "H-1": { id: "H-1", group: "Hidrofor", color: "#1faf6b", bar: [5.0, 6.4], flow: [3, 6], temp: [16, 22], kw: [1.1, 1.5], vacPa: [40, 100] },
  "F-1": { id: "F-1", group: "Filtreleme", color: "#1f6bcf", bar: [2.4, 3.2], flow: [28, 40], temp: [22, 28], kw: [1.8, 2.4], vacPa: [40, 100] },
  "F-2": { id: "F-2", group: "Filtreleme", color: "#1f6bcf", bar: [2.4, 3.2], flow: [28, 40], temp: [22, 28], kw: [1.8, 2.4], vacPa: [40, 100] },
};

/* Overview slide groups pumps into two loops (matching slide1's 4+4 layout) */
export const OVERVIEW_LOOPS = {
  loop1: { label: "KULE-1", ids: ["K-1", "K-2", "K-3", "D-1"] },
  loop2: { label: "KULE-2", ids: ["D-2", "F-1", "F-2", "I-1"] },
};

const lerp = (a, b, t) => a + (b - a) * t;
const noise = (range, factor = 0.04) => (Math.random() - 0.5) * (range[1] - range[0]) * factor;

const initialPumpState = (def) => ({
  on: false,
  setpointBar: (def.bar[0] + def.bar[1]) / 2,
  bar: 0, flow: 0, temp: 18 + Math.random() * 2, kw: 0,
  fault: false, runtimeMin: 0,
  fbsTop: [0, 0], fbsBot: [0, 0], vsTop: [0, 0], vsBot: [0, 0],
});

export function useSimulation() {
  const [pumps, setPumps] = useState(() => {
    const init = {};
    Object.keys(PUMP_CATALOG).forEach((k) => { init[k] = initialPumpState(PUMP_CATALOG[k]); });
    return init;
  });
  const [towers, setTowers] = useState({
    KULE_1: { level: 72, temp: 28.5 },
    KULE_2: { level: 65, temp: 29.1 },
  });
  const [alarms, setAlarms] = useState([]);
  const tickRef = useRef(0);

  const togglePump = useCallback((id) => {
    setPumps((prev) => ({ ...prev, [id]: { ...prev[id], on: !prev[id].on } }));
  }, []);
  const setSetpoint = useCallback((id, val) => {
    setPumps((prev) => ({ ...prev, [id]: { ...prev[id], setpointBar: val } }));
  }, []);
  const triggerFault = useCallback((id) => {
    setPumps((prev) => ({ ...prev, [id]: { ...prev[id], fault: !prev[id].fault } }));
  }, []);
  const acknowledgeAlarms = useCallback(() => setAlarms([]), []);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;

      setPumps((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((id) => {
          const def = PUMP_CATALOG[id];
          const p = { ...next[id] };
          if (p.fault) {
            p.bar = lerp(p.bar, 0, 0.2); p.flow = lerp(p.flow, 0, 0.2);
            p.kw = lerp(p.kw, 0, 0.2); p.temp = lerp(p.temp, 18, 0.02);
          } else if (p.on) {
            const tb = p.setpointBar + noise(def.bar, 0.06);
            const tf = def.flow[0] + Math.random() * (def.flow[1] - def.flow[0]);
            const tt = def.temp[0] + Math.random() * (def.temp[1] - def.temp[0]);
            const tk = def.kw[0] + Math.random() * (def.kw[1] - def.kw[0]);
            p.bar = lerp(p.bar, tb, 0.18); p.flow = lerp(p.flow, tf, 0.12);
            p.temp = lerp(p.temp, tt, 0.05); p.kw = lerp(p.kw, tk, 0.18);
            p.runtimeMin += 1 / 60;
          } else {
            p.bar = lerp(p.bar, 0, 0.15); p.flow = lerp(p.flow, 0, 0.2);
            p.kw = lerp(p.kw, 0, 0.2); p.temp = lerp(p.temp, 18 + Math.random() * 2, 0.02);
          }
          const fluct = (a) => a + (Math.random() - 0.5) * 0.15;
          p.fbsTop = [fluct(p.bar), fluct(p.bar)];
          p.fbsBot = [fluct(p.bar), fluct(p.bar)];
          const vac = p.on && !p.fault ? def.vacPa[0] + Math.random() * (def.vacPa[1] - def.vacPa[0]) : 0;
          p.vsTop = [vac + (Math.random() - 0.5) * 10, vac + (Math.random() - 0.5) * 10];
          p.vsBot = [vac + (Math.random() - 0.5) * 10, vac + (Math.random() - 0.5) * 10];
          next[id] = p;
        });
        return next;
      });

      setTowers((prev) => {
        const k1 = { ...prev.KULE_1 }, k2 = { ...prev.KULE_2 };
        const a1 = OVERVIEW_LOOPS.loop1.ids.filter(id => pumps[id]?.on && !pumps[id]?.fault).length;
        const a2 = OVERVIEW_LOOPS.loop2.ids.filter(id => pumps[id]?.on && !pumps[id]?.fault).length;
        k1.level = Math.max(25, Math.min(95, k1.level + (a1 ? -0.04 : 0.05)));
        k2.level = Math.max(25, Math.min(95, k2.level + (a2 ? -0.04 : 0.05)));
        k1.temp = lerp(k1.temp, a1 ? 31 : 27, 0.04) + (Math.random() - 0.5) * 0.3;
        k2.temp = lerp(k2.temp, a2 ? 30 : 28, 0.04) + (Math.random() - 0.5) * 0.3;
        return { KULE_1: k1, KULE_2: k2 };
      });

      if (t % 4 === 0) {
        setPumps((p) => {
          const newAlarms = [];
          Object.entries(p).forEach(([id, st]) => {
            const def = PUMP_CATALOG[id];
            if (st.fault) {
              newAlarms.push({ id: `${id}-f-${Date.now()}`, level: "CRITICAL", msg: `${def.group} • ${id} ARIZA`, ts: Date.now() });
            } else if (st.on && st.bar > def.bar[1] * 1.15) {
              newAlarms.push({ id: `${id}-h-${Date.now()}`, level: "WARN", msg: `${id} YÜKSEK BASINÇ ${st.bar.toFixed(2)} Bar`, ts: Date.now() });
            }
          });
          if (newAlarms.length) setAlarms((curr) => [...newAlarms, ...curr].slice(0, 12));
          return p;
        });
      }
    }, 500);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  const sumLoop = (ids) => {
    const on = ids.filter(i => pumps[i].on && !pumps[i].fault);
    return {
      ids,
      bar: on.length ? on.reduce((s, i) => s + pumps[i].bar, 0) / on.length : 0,
      flow: ids.reduce((s, i) => s + pumps[i].flow, 0),
      temp: on.length ? on.reduce((s, i) => s + pumps[i].temp, 0) / on.length : 27,
      returnTemp: on.length ? Math.max(...on.map(i => pumps[i].temp)) - 5 : 27,
    };
  };

  const loopMeta = {
    loop1: sumLoop(OVERVIEW_LOOPS.loop1.ids),
    loop2: sumLoop(OVERVIEW_LOOPS.loop2.ids),
  };

  const totals = {
    activeCount: Object.values(pumps).filter((p) => p.on && !p.fault).length,
    totalCount: Object.keys(pumps).length,
    totalKw: Object.values(pumps).reduce((s, x) => s + x.kw, 0),
    totalFlow: Object.values(pumps).reduce((s, x) => s + x.flow, 0),
    avgBar: (() => {
      const on = Object.values(pumps).filter((p) => p.on && !p.fault);
      return on.length ? on.reduce((s, x) => s + x.bar, 0) / on.length : 0;
    })(),
    faultCount: Object.values(pumps).filter((p) => p.fault).length,
  };

  return { pumps, towers, alarms, totals, loopMeta, togglePump, setSetpoint, acknowledgeAlarms, triggerFault };
}
