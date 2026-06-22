import { useEffect, useRef, useState, useCallback } from "react";

// Pump catalog - each pump has realistic operating ranges
export const PUMP_CATALOG = {
  // Kazan Pompaları (Boiler) - 3 pumps - high pressure & flow
  KAZAN_1: { id: "KAZAN_1", group: "Kazan Pompaları", label: "P-101", bar: [4.5, 5.8], flow: [22, 32], temp: [82, 92], kw: [5.5, 7.2], hasFlow: true, hasTemp: false },
  KAZAN_2: { id: "KAZAN_2", group: "Kazan Pompaları", label: "P-102", bar: [4.5, 5.8], flow: [22, 32], temp: [82, 92], kw: [5.5, 7.2], hasFlow: true, hasTemp: false },
  KAZAN_3: { id: "KAZAN_3", group: "Kazan Pompaları", label: "P-103", bar: [4.5, 5.8], flow: [22, 32], temp: [82, 92], kw: [5.5, 7.2], hasFlow: true, hasTemp: false },
  // Degazör - 2 pumps
  DEGZ_1:  { id: "DEGZ_1",  group: "Degazör Pompaları", label: "P-201", bar: [2.0, 2.8], flow: [10, 14], temp: [75, 82], kw: [2.2, 3.0], hasFlow: true, hasTemp: false },
  DEGZ_2:  { id: "DEGZ_2",  group: "Degazör Pompaları", label: "P-202", bar: [2.0, 2.8], flow: [10, 14], temp: [75, 82], kw: [2.2, 3.0], hasFlow: true, hasTemp: false },
  // İSG Revir / Isıtma
  ISG_1:   { id: "ISG_1",   group: "İSG Revir / Isıtma", label: "P-301", bar: [3.0, 3.8], flow: [6, 9], temp: [62, 70], kw: [1.5, 2.2], hasFlow: false, hasTemp: false },
  // Hidrofor (Domestic water booster)
  HIDR_1:  { id: "HIDR_1",  group: "Kullanım Suyu Hidrofor", label: "P-401", bar: [5.0, 6.5], flow: [3, 6], temp: [15, 22], kw: [1.1, 1.5], hasFlow: false, hasTemp: false },
  // Filtreleme
  FILT_1:  { id: "FILT_1",  group: "Filtreleme Pompaları", label: "P-501", bar: [2.2, 3.0], flow: [30, 42], temp: [22, 28], kw: [1.8, 2.2], hasFlow: true, hasTemp: false },
  FILT_2:  { id: "FILT_2",  group: "Filtreleme Pompaları", label: "P-502", bar: [2.2, 3.0], flow: [30, 42], temp: [22, 28], kw: [1.8, 2.2], hasFlow: true, hasTemp: false },
};

export const TOWERS = {
  KULE_1: { id: "KULE_1", label: "KULE-1", capacity: 100 },
  KULE_2: { id: "KULE_2", label: "KULE-2", capacity: 100 },
};

const noise = (range, factor = 0.04) => {
  const span = range[1] - range[0];
  return (Math.random() - 0.5) * span * factor;
};

const lerp = (a, b, t) => a + (b - a) * t;

const initialPumpState = (def) => ({
  on: false,
  setpointBar: (def.bar[0] + def.bar[1]) / 2,
  bar: 0,
  flow: 0,
  temp: 18 + Math.random() * 2, // ambient
  kw: 0,
  fault: false,
  runtimeMin: 0,
});

export function useSimulation() {
  const [pumps, setPumps] = useState(() => {
    const init = {};
    Object.keys(PUMP_CATALOG).forEach((k) => { init[k] = initialPumpState(PUMP_CATALOG[k]); });
    return init;
  });

  const [towers, setTowers] = useState({
    KULE_1: { level: 72, temp: 28.5, flow: 0 },
    KULE_2: { level: 65, temp: 29.1, flow: 0 },
  });

  const [alarms, setAlarms] = useState([]);
  const [history, setHistory] = useState([]); // last 60 samples for trend
  const tickRef = useRef(0);

  const togglePump = useCallback((id) => {
    setPumps((prev) => {
      const next = { ...prev };
      next[id] = { ...next[id], on: !next[id].on };
      return next;
    });
  }, []);

  const setSetpoint = useCallback((id, val) => {
    setPumps((prev) => ({ ...prev, [id]: { ...prev[id], setpointBar: val } }));
  }, []);

  const acknowledgeAlarms = useCallback(() => setAlarms([]), []);

  const triggerFault = useCallback((id) => {
    setPumps((prev) => ({ ...prev, [id]: { ...prev[id], fault: !prev[id].fault } }));
  }, []);

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
            // fault: drop everything to zero with red status
            p.bar = lerp(p.bar, 0, 0.2);
            p.flow = lerp(p.flow, 0, 0.2);
            p.kw = lerp(p.kw, 0, 0.2);
            p.temp = lerp(p.temp, 18, 0.02);
          } else if (p.on) {
            const targetBar = p.setpointBar + noise(def.bar, 0.05);
            const targetFlow = def.flow[0] + Math.random() * (def.flow[1] - def.flow[0]);
            const targetTemp = def.temp[0] + Math.random() * (def.temp[1] - def.temp[0]);
            const targetKw = def.kw[0] + Math.random() * (def.kw[1] - def.kw[0]);
            p.bar = lerp(p.bar, targetBar, 0.18);
            p.flow = lerp(p.flow, targetFlow, 0.12);
            p.temp = lerp(p.temp, targetTemp, 0.05);
            p.kw = lerp(p.kw, targetKw, 0.18);
            p.runtimeMin += 1 / 60;
          } else {
            p.bar = lerp(p.bar, 0, 0.15);
            p.flow = lerp(p.flow, 0, 0.2);
            p.kw = lerp(p.kw, 0, 0.2);
            p.temp = lerp(p.temp, 18 + Math.random() * 2, 0.02);
          }
          next[id] = p;
        });
        return next;
      });

      setTowers((prev) => {
        const totalIn = (prev.flowIn || 0);
        const k1 = { ...prev.KULE_1 };
        const k2 = { ...prev.KULE_2 };
        // simple level oscillation based on active pumps
        k1.flow = 0; k2.flow = 0;
        const activeBoiler = ["KAZAN_1","KAZAN_2","KAZAN_3"].filter(id => pumps[id]?.on && !pumps[id]?.fault).length;
        const activeFilt = ["FILT_1","FILT_2"].filter(id => pumps[id]?.on && !pumps[id]?.fault).length;
        k1.level = Math.max(20, Math.min(95, k1.level + (activeBoiler ? -0.05 : 0.04) + (activeFilt ? 0.03 : 0)));
        k2.level = Math.max(20, Math.min(95, k2.level + (activeFilt ? -0.04 : 0.05)));
        k1.temp = lerp(k1.temp, activeBoiler ? 32 : 27, 0.05) + noise([0,1], 0.5);
        k2.temp = lerp(k2.temp, activeFilt ? 30 : 28, 0.05) + noise([0,1], 0.5);
        return { ...prev, KULE_1: k1, KULE_2: k2 };
      });

      // alarms - run check every 4 ticks
      if (t % 4 === 0) {
        setPumps((p) => {
          const newAlarms = [];
          Object.entries(p).forEach(([id, st]) => {
            const def = PUMP_CATALOG[id];
            if (st.fault) {
              newAlarms.push({ id: `${id}-fault`, level: "CRITICAL", source: def.label, msg: `${def.group} • ${def.label} ARIZA`, ts: Date.now() });
            } else if (st.on && st.bar > def.bar[1] * 1.15) {
              newAlarms.push({ id: `${id}-hpa`, level: "WARN", source: def.label, msg: `${def.label} YÜKSEK BASINÇ ${st.bar.toFixed(2)} Bar`, ts: Date.now() });
            }
          });
          setAlarms((curr) => {
            const merged = [...newAlarms, ...curr].slice(0, 8);
            return merged;
          });
          return p;
        });
      }

      // history trending (total kW)
      if (t % 2 === 0) {
        setPumps((p) => {
          const totalKw = Object.values(p).reduce((s, x) => s + x.kw, 0);
          const totalFlow = Object.values(p).reduce((s, x) => s + x.flow, 0);
          setHistory((h) => {
            const next = [...h, { t: Date.now(), kw: totalKw, flow: totalFlow }];
            return next.slice(-60);
          });
          return p;
        });
      }
    }, 500);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // derived totals
  const totals = {
    activeCount: Object.values(pumps).filter((p) => p.on && !p.fault).length,
    totalCount: Object.keys(pumps).length,
    totalKw: Object.values(pumps).reduce((s, x) => s + x.kw, 0),
    totalFlow: Object.values(pumps).reduce((s, x) => s + x.flow, 0),
    avgBar: (() => {
      const onPumps = Object.values(pumps).filter((p) => p.on && !p.fault);
      if (!onPumps.length) return 0;
      return onPumps.reduce((s, x) => s + x.bar, 0) / onPumps.length;
    })(),
    faultCount: Object.values(pumps).filter((p) => p.fault).length,
  };

  return { pumps, towers, alarms, history, totals, togglePump, setSetpoint, acknowledgeAlarms, triggerFault };
}
