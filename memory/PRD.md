# Grundfos SCADA Demo - PRD

## Original Problem Statement
"merhaba bir web sayfası yapcağız bu ektaki sayfada gördüklerini bir demo sayfa va canblı simalsyonu değler olrak mmümkünse 3d animasla güzebi demo web sayfası ypamnı isityorum"
(Attached: Grundfos Skada.pptx — 6-slide real pump-station SCADA diagram.)

## User Iterations
- v1: 3D rotateable scene → user said too busy
- v2: 2D schematic with rotating fans → user wanted 3D perspective pumps and per-slide pages
- v3 (current): 3D-style SVG pumps + multi-page navigation matching each PPTX slide

## Architecture
- React 19 + react-router 7 with multi-page navigation
- Pure SVG pumps (no WebGL) - rendering 9+ pumps simultaneously without context limits
- Animated SVG fans via CSS keyframes
- Shared simulation state via React Context (SimContext)
- Tailwind + sonner toasts, light industrial schematic theme

## Pages (matching PPTX slides)
1. `/` Genel Bakış — 2 cooling-tower loops (KULE-1, KULE-2) with 4 pumps each
2. `/kazan` Kazan Pompaları (3)
3. `/degazor` Degazör Pompaları (2)
4. `/isg` İSG Revir / Isıtma (1)
5. `/hidrofor` Hidrofor (1)
6. `/filtreleme` Filtreleme Pompaları (2)

## Pump Catalog (9 pumps total)
- K-1, K-2, K-3 (red, Kazan)
- D-1, D-2 (orange, Degazör)
- I-1 (purple, İSG)
- H-1 (green, Hidrofor)
- F-1, F-2 (blue, Filtreleme)
Realistic value ranges per group (Kazan 4.2–5.5 bar, Hidrofor 5.0–6.4 bar etc.)

## Features
- Click any pump → side panel with Basınç/Debi/Güç/Sıcaklık, setpoint slider, Başlat/Durdur, Arıza
- Quick actions: Tümünü Başlat / Durdur / Rastgele Arıza
- Top KPI bar: çalışan/toplam, güç, basınç, arıza
- Alarm panel with critical/warn levels + toast notifications
- Tower level indicators on overview
- Per-group summary panel on individual slides
- Status LEDs blink when running, red blink when fault

## Tech Notes
- Pinned `webpack-dev-server` to 4.15.2 (visual-edits plugin uses v4 API)
- Removed StrictMode (React 19 double-mount caused R3F event subscription failures)
- Replaced @react-three/fiber pumps with SVG (multi-canvas WebGL hit browser context limit)

## Deferred / Backlog
- P1: FastAPI + MongoDB + WebSocket streaming + historical persistence
- P1: Pump runtime aggregate per day/week
- P2: SVG P&ID export, role-based auth
- P2: Mobile-responsive layout
- P2: Real PLC tag mapping editor
