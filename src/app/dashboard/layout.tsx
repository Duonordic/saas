// app/dashboard/layout.tsx

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Tenant } from "@/generated/prisma";
import { tenantService } from "@/lib/services/tenant-service";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DEV_FALLBACK_SLUG = "acme";

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const requestHeaders = await headers();
  let tenantId = requestHeaders.get("x-tenant-id");
  let tenant: Tenant | null = null;

  if (tenantId) {
    tenant = await tenantService.getTenant(tenantId);
  }

  // If no tenant was resolved AND we are in the development environment
  if (!tenant && process.env.NODE_ENV === "development") {
    console.warn(
      `[DEV MODE] Tenant ID missing or tenant not found. Falling back to seeded tenant: ${DEV_FALLBACK_SLUG}`
    );

    // Fetch a seeded tenant by slug
    tenant = await tenantService.getTenantBySlug(DEV_FALLBACK_SLUG);
    console.log("Got seeded tenant: ", tenant);

    if (tenant) {
      tenantId = tenant.id;
    }
  }

  if (!tenant) {
    // If the tenant is still not found after all attempts,
    // or if we are in production and the header was missing/invalid.
    return notFound();
  }

  // If we reach here, 'tenant' is a valid Tenant object
  return <DashboardShell tenant={tenant}>{children}</DashboardShell>;
}
