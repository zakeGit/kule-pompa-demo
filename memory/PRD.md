# Grundfos SCADA Demo - PRD

## Original Problem Statement
"merhaba bir web sayfası yapcağız bu ektaki sayfada gördüklerini bir demo sayfa va canblı simalsyonu değler olrak mmümkünse 3d animasla güzebi demo web sayfası ypamnı isityorum"
(Attached: Grundfos Skada.pptx — a real pump-station SCADA diagram.)

## User Choices (gathered via ask_human)
1. Tamamen 3D tesis görünümü (3D tanks, pumps, pipes)
2. Kullanıcı kontrolü + mantıklı endüstriyel değerler
3. Klasik endüstriyel SCADA (koyu mavi/yeşil panel, dijital göstergeler)
4. Türkçe arayüz
5. Frontend-only (FastAPI/Mongo deferred)

## Architecture
- React 19 + react-router 7
- Three.js via @react-three/fiber + @react-three/drei
- Tailwind + shadcn + sonner toasts
- All simulation lives client-side in `hooks/useSimulation.js`

## Personas
- Plant operator (live monitoring, start/stop pumps)
- Demo viewer / sales prospect (visual showcase of a Grundfos station)

## Implemented (22 Feb 2026)
- 3D facility scene: floor grid, 2 cooling towers (KULE-1/2 with animated liquid level), 9 pumps (Kazan ×3, Degazör ×2, İSG ×1, Hidrofor ×1, Filtre ×2)
- Spinning impellers when pumps are ON, color-coded by group, status LEDs
- Animated pipe fluid flow when section is active
- Orbit camera (drag/zoom)
- Left panel: per-pump live BAR / DEBİ / GÜÇ / SIC., runtime counter, setpoint slider, START/STOP/FAULT
- Top bar: aggregate KPIs (active count, total kW, total flow, avg bar, faults), clock
- Right panel: tower level bars + temp, 3 analog dial gauges, live trend bar chart (kW), alarm list with ACK
- Industrial CRT styling: scanlines, LED 7-seg digits, bezels, indicator lights
- Realistic value ranges per pump type (boilers 4.5–5.8 bar, hidrofor 5–6.5 bar, etc.) with damping/lerp
- Intro modal welcome screen + "Demo başlat" auto-runs everything
- Random fault button → blinking red alarm + toast notification

## Tech Notes
- Resolved webpack-dev-server v5 vs visual-edits incompat by pinning resolution to 4.15.2
- Used drei `<Html>` for in-scene labels (avoided drei `<Text>` due to three.js depth-material setter conflict)

## Deferred / Backlog
- P1: FastAPI + Mongo backend with WebSocket streaming + historical persistence
- P1: Multi-page layout (separate KULE detay, Trend ekranı, Alarm geçmişi)
- P2: PLC tag mapping editor, role-based auth, CSV/PDF export of logs
- P2: SVG P&ID schematic view alongside 3D
- P2: Mobile-responsive layout
