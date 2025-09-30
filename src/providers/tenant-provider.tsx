// lib/context/tenant-context.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { Tenant } from "@/generated/prisma";

interface TenantContextValue {
  tenant: Tenant | null;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
    darkMode: boolean;
  };
  features: Record<string, boolean>;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export function TenantProvider({
  tenant,
  children,
}: {
  tenant: Tenant | null;
  children: ReactNode;
}) {
  const config = (tenant?.config as any) || {};

  const value: TenantContextValue = {
    tenant,
    theme: config.theme || {
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      fontFamily: "Inter",
      borderRadius: "8px",
      darkMode: false,
    },
    features: config.features || {},
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}

export function useTenantTheme() {
  const { theme } = useTenant();
  return theme;
}

export function useTenantFeature(feature: string): boolean {
  const { features } = useTenant();
  return features[feature] === true;
}
