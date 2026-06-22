import React from "react";
import GroupPage from "@/pages/GroupPage";

export const KazanPage = () => (
  <GroupPage
    pageTitle="Kazan Pompaları"
    pageSubtitle="Slide 2 · 3 pompa · Yüksek basınç, sıcak su devresi"
    pumpIds={["K-1", "K-2", "K-3"]}
  />
);

export const DegazorPage = () => (
  <GroupPage
    pageTitle="Kazan Degazör Pompaları"
    pageSubtitle="Slide 3 · 2 pompa · Degazasyon devresi"
    pumpIds={["D-1", "D-2"]}
  />
);

export const IsgPage = () => (
  <GroupPage
    pageTitle="İSG Revir / Isıtma Pompası"
    pageSubtitle="Slide 4 · Sıhhi ve ısıtma devresi"
    pumpIds={["I-1"]}
    showFlowMeter={false}
  />
);

export const HidroforPage = () => (
  <GroupPage
    pageTitle="Kullanım Suyu Hidrofor Pompası"
    pageSubtitle="Slide 5 · Bina kullanım suyu basınçlandırma"
    pumpIds={["H-1"]}
    showFlowMeter={false}
  />
);

export const FiltrePage = () => (
  <GroupPage
    pageTitle="Filtreleme Pompaları"
    pageSubtitle="Slide 6 · 2 pompa · Soğutma kulesi filtre devresi"
    pumpIds={["F-1", "F-2"]}
  />
);
