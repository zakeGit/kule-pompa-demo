import React, { createContext, useContext } from "react";
import { useSimulation } from "@/hooks/useSimulation";

const SimContext = createContext(null);

export function SimProvider({ children }) {
  const sim = useSimulation();
  return <SimContext.Provider value={sim}>{children}</SimContext.Provider>;
}

export function useSim() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error("useSim must be used within SimProvider");
  return ctx;
}
