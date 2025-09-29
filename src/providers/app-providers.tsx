import React from "react";
import { ThemeProvider } from "./theme-provider";
import { TenantProvider } from "./tenant-provider";

interface AppProviderProps {
  children: React.ReactNode;
  tenant: any;
}

export function AppProviders({ tenant, children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <TenantProvider tenant={tenant}>{children}</TenantProvider>
    </ThemeProvider>
  );
}
