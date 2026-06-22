import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Html } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------- Building blocks ------------------------- */

const Floor = () => (
  <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[60, 40]} />
      <meshStandardMaterial color="#0c1722" metalness={0.2} roughness={0.9} />
    </mesh>
    <Grid
      args={[60, 40]}
      cellSize={1}
      cellThickness={0.5}
      cellColor="#1f3a52"
      sectionSize={5}
      sectionThickness={1}
      sectionColor="#2a5577"
      fadeDistance={45}
      fadeStrength={1.2}
      infiniteGrid={false}
      position={[0, 0, 0]}
    />
  </>
);

/* ------------------- Tank (KULE) ------------------- */
const Tank = ({ position, label, level = 60, temp = 28, onClick }) => {
  const liquidRef = useRef();
  const fillHeight = useMemo(() => (level / 100) * 4.4, [level]);

  useFrame((state) => {
    if (liquidRef.current) {
      liquidRef.current.material.opacity = 0.75 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Base ring */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.4, 2.4, 0.2, 32]} />
        <meshStandardMaterial color="#1a2a38" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Tank body - transparent */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[2.2, 2.2, 4.6, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#5fb3c9"
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.18}
          transmission={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Tank frame rings */}
      {[0.3, 2.3, 4.6].map((y, i) => (
        <mesh key={i} position={[0, y + 0.2, 0]}>
          <torusGeometry args={[2.2, 0.06, 8, 32]} />
          <meshStandardMaterial color="#3a7099" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {/* Water/liquid */}
      <mesh ref={liquidRef} position={[0, 0.3 + fillHeight / 2, 0]}>
        <cylinderGeometry args={[2.15, 2.15, fillHeight, 32]} />
        <meshPhysicalMaterial color="#1fc8d6" metalness={0.2} roughness={0.2} transparent opacity={0.78} emissive="#0a4452" emissiveIntensity={0.4} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 5.05, 0]} castShadow>
        <cylinderGeometry args={[2.25, 2.25, 0.3, 32]} />
        <meshStandardMaterial color="#1a2a38" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Vertical struts */}
      {[0, 90, 180, 270].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return (
          <mesh key={deg} position={[Math.cos(a) * 2.25, 2.5, Math.sin(a) * 2.25]}>
            <boxGeometry args={[0.08, 4.8, 0.08]} />
            <meshStandardMaterial color="#3a7099" metalness={0.6} roughness={0.4} />
          </mesh>
        );
      })}
      {/* Label panel */}
      <Html position={[0, 5.7, 0]} center transform distanceFactor={10} occlude={false}>
        <div className="px-2 py-1 text-cyan-300 text-xs font-mono border border-cyan-700/60 bg-[#08131e]/90 rounded shadow-lg backdrop-blur whitespace-nowrap">
          <div className="font-bold tracking-widest">{label}</div>
          <div className="text-[10px] text-cyan-200">
            <span className="led-digit led-cyan">{level.toFixed(0)}</span>% • <span className="led-digit led-amber">{temp.toFixed(1)}</span>°C
          </div>
        </div>
      </Html>
    </group>
  );
};

/* ------------------- Pump (3D) ------------------- */
const Pump = ({ position, rotation = [0, 0, 0], on, fault, label, bar, kw, color = "#cf2027" }) => {
  const impellerRef = useRef();
  const glowRef = useRef();
  useFrame((state, dt) => {
    if (impellerRef.current && on && !fault) impellerRef.current.rotation.x += dt * 14;
    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = on && !fault
        ? 0.6 + Math.sin(state.clock.elapsedTime * 4) * 0.2
        : 0;
    }
  });

  const statusColor = fault ? "#ff3b4e" : on ? "#36ff7a" : "#1f3a52";

  return (
    <group position={position} rotation={rotation}>
      {/* Base plate */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.16, 0.9]} />
        <meshStandardMaterial color="#101820" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Motor (cylinder horizontal) - Grundfos red */}
      <mesh position={[-0.4, 0.45, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.8, 24]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Motor cooling fins */}
      {[-0.7, -0.55, -0.4, -0.25, -0.1].map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.295, 0.295, 0.02, 24]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.7} />
        </mesh>
      ))}
      {/* Coupling */}
      <mesh position={[0.05, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.18, 16]} />
        <meshStandardMaterial color="#2a5577" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Pump volute (sphere-like casing) */}
      <mesh position={[0.42, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial color="#1a2a38" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Impeller (spinning disc inside, visible from side) */}
      <mesh ref={impellerRef} position={[0.42, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 8]} />
        <meshStandardMaterial color="#cfe3ff" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Suction inlet (vertical down) */}
      <mesh position={[0.42, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.5, 16]} />
        <meshStandardMaterial color="#3a7099" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Discharge outlet (vertical up) */}
      <mesh position={[0.42, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.4, 16]} />
        <meshStandardMaterial color="#3a7099" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Status LED */}
      <mesh ref={glowRef} position={[0.42, 0.78, 0.34]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={on && !fault ? 0.8 : 0} />
      </mesh>
      {/* Label */}
      <Html position={[0, 1.3, 0]} center transform distanceFactor={9} occlude={false}>
        <div className={`px-1.5 py-0.5 text-[10px] font-mono border rounded whitespace-nowrap backdrop-blur ${
          fault ? "border-red-500/80 bg-red-950/80 text-red-300" :
          on ? "border-green-500/60 bg-[#08131e]/90 text-green-300" :
          "border-cyan-800/60 bg-[#08131e]/90 text-cyan-400"
        }`}>
          <div className="font-bold tracking-wider">{label}</div>
          <div className="text-[9px]">
            <span className="led-digit">{bar.toFixed(2)}</span>b · <span className="led-digit">{kw.toFixed(1)}</span>kW
          </div>
        </div>
      </Html>
    </group>
  );
};

/* ------------------- Pipe with animated flow ------------------- */
const Pipe = ({ from, to, active, color = "#2a5577" }) => {
  const ref = useRef();
  const dir = new THREE.Vector3().subVectors(new THREE.Vector3(...to), new THREE.Vector3(...from));
  const len = dir.length();
  const mid = new THREE.Vector3(...from).add(dir.clone().multiplyScalar(0.5));
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

  const dashRef = useRef();
  useFrame((state, dt) => {
    if (dashRef.current && active) {
      dashRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 6) * 0.4;
    } else if (dashRef.current) {
      dashRef.current.material.opacity = 0;
    }
  });

  return (
    <group position={mid.toArray()} quaternion={quat.toArray()}>
      <mesh ref={ref}>
        <cylinderGeometry args={[0.09, 0.09, len, 12]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Inner glowing fluid */}
      <mesh ref={dashRef}>
        <cylinderGeometry args={[0.07, 0.07, len * 0.98, 12]} />
        <meshStandardMaterial color="#1fc8d6" emissive="#1fc8d6" emissiveIntensity={1} transparent opacity={0} />
      </mesh>
    </group>
  );
};

/* ------------------- Sign / Title ------------------- */
const Title3D = () => (
  <Html position={[0, 6.5, -12]} center transform distanceFactor={8} occlude={false}>
    <div className="text-center select-none pointer-events-none">
      <div className="text-cyan-300 font-bold text-2xl tracking-[0.3em] whitespace-nowrap" style={{ textShadow: "0 0 12px #38e4ff, 0 0 4px #0a1118" }}>
        GRUNDFOS POMPA İSTASYONU
      </div>
      <div className="text-cyan-500 text-xs tracking-[0.4em] mt-1 whitespace-nowrap">
        • SCADA CANLI SİMÜLASYON •
      </div>
    </div>
  </Html>
);

/* ------------------- Scene ------------------- */
export default function Scene3D({ pumps, towers }) {
  const layout = useMemo(() => ({
    // Two cooling towers on the back
    KULE_1: [-8, 0, -6],
    KULE_2: [8, 0, -6],
    // Boiler pumps in front row left
    KAZAN_1: [-9, 0, 2],
    KAZAN_2: [-7, 0, 2],
    KAZAN_3: [-5, 0, 2],
    // Degazör center
    DEGZ_1: [-1.5, 0, 2],
    DEGZ_2: [0.5, 0, 2],
    // ISG
    ISG_1: [3.5, 0, 2],
    // Hidrofor
    HIDR_1: [5.5, 0, 2],
    // Filtreleme
    FILT_1: [8, 0, 2],
    FILT_2: [10, 0, 2],
  }), []);

  return (
    <Canvas shadows camera={{ position: [12, 12, 18], fov: 45 }} dpr={[1, 1.6]}>
      <color attach="background" args={["#050a10"]} />
      <fog attach="fog" args={["#050a10", 25, 55]} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[10, 20, 10]} intensity={0.9} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-10, 8, -8]} intensity={1.2} color="#1fc8d6" distance={20} />
      <pointLight position={[10, 8, -8]} intensity={1.2} color="#1fc8d6" distance={20} />
      <spotLight position={[0, 12, 0]} angle={0.6} penumbra={0.5} intensity={0.7} color="#8fd0ff" />

      <Suspense fallback={null}>
        <Floor />
        <Title3D />

        {/* Tanks */}
        <Tank position={layout.KULE_1} label="KULE-1" level={towers.KULE_1.level} temp={towers.KULE_1.temp} />
        <Tank position={layout.KULE_2} label="KULE-2" level={towers.KULE_2.level} temp={towers.KULE_2.temp} />

        {/* Pumps */}
        {Object.keys(pumps).map((id) => {
          const st = pumps[id];
          const color = id.startsWith("KAZAN") ? "#cf2027" : id.startsWith("DEGZ") ? "#e85a1a" : id.startsWith("FILT") ? "#1f6bcf" : id.startsWith("ISG") ? "#7a3dcf" : "#1faf6b";
          return (
            <Pump
              key={id}
              position={layout[id]}
              on={st.on}
              fault={st.fault}
              label={id.replace("_", "-")}
              bar={st.bar}
              kw={st.kw}
              color={color}
            />
          );
        })}

        {/* Pipes from tanks to pump rows */}
        <Pipe from={[-8, 0.3, -3.6]} to={[-7, 0.3, 2.4]} active={["KAZAN_1","KAZAN_2","KAZAN_3"].some(id => pumps[id].on)} />
        <Pipe from={[8, 0.3, -3.6]} to={[9, 0.3, 2.4]} active={["FILT_1","FILT_2"].some(id => pumps[id].on)} />
        <Pipe from={[-7, 1.5, 2.4]} to={[9, 1.5, 2.4]} active={Object.values(pumps).some(p => p.on)} color="#1f3a52" />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={8}
          maxDistance={40}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, 1, 0]}
        />
      </Suspense>
    </Canvas>
  );
}
