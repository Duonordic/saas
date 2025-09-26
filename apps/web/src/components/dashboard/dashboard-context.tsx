"use client";

import { createContext, useContext, ReactNode } from "react";
import { Tenant } from "@/lib/tenant";

interface DashboardContextType {
  tenant: Tenant;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export function DashboardProvider({
  tenant,
  children,
}: {
  tenant: Tenant;
  children: ReactNode;
}) {
  return (
    <DashboardContext.Provider value={{ tenant }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
