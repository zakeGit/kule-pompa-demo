# Grundfos Pompa İstasyonu SCADA Demo

Canlı 3D simülasyonlu, çok sayfalı SCADA demo arayüzü. PPTX referansındaki Grundfos pompa istasyonunu birebir yansıtır:

- **Genel Bakış** — 2 soğutma kulesi (KULE-1 / KULE-2), 8 pompa, kule seviye göstergeleri
- **Kazan Pompaları** — 3 adet dikey CR tipi pompa
- **Degazör Pompaları** — 2 adet yatay pompa
- **İSG Revir / Isıtma** — 1 adet dikey pompa
- **Hidrofor** — 1 adet dikey pompa
- **Filtreleme Pompaları** — 2 adet yatay pompa

Tüm pompalarda canlı FBS / EG / VS / BS / DM / SS değerleri, dönen yeşil pervane animasyonu ve start/stop/arıza kontrolü.

## Yerel Geliştirme

```bash
cd frontend
yarn install --ignore-engines
yarn start
```

Tarayıcı `http://localhost:3000` adresinde açılır.

## GitHub Pages'e Deploy

Bu repo, **GitHub Actions** ile her `main`/`master` push'una otomatik build + deploy yapar.

İlk kurulum:
1. GitHub repo → **Settings → Pages → Source = "GitHub Actions"** seçin.
2. `main` branch'e push atın → Actions sekmesinde **Deploy to GitHub Pages** workflow'u çalışır.
3. Yayın URL'si: `https://<kullanıcı>.github.io/kule-pompa-demo/`

> **Not:** Proje frontend-only çalışır (FastAPI/Mongo şu anda boş gönderilmiştir, kullanılmıyor). Tüm simülasyon tarayıcıda yürür.

## Stack

- React 19 + react-router (HashRouter — GitHub Pages için)
- CRA + craco + Tailwind + shadcn
- Saf SVG ile çizilmiş 3D pompalar (yatay & dikey CR tipi)
- Sonner toast bildirimleri
