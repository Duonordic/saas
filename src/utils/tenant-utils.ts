// lib/utils/tenant-utils.ts
import { headers } from "next/headers";
import { Tenant } from "@/generated/prisma";
import { tenantService } from "@/lib/services/tenant-service";

const DEV_TENANT_SLUG = "acme";

/**
 * Get current tenant from request headers (server-side only)
 */
export async function getCurrentTenant(): Promise<Partial<Tenant> | null> {
  const headersList = await headers();
  const tenantIdFromHeader = headersList.get("x-tenant-id");

  if (tenantIdFromHeader) {
    const tenantSlug = headersList.get("x-tenant-slug");
    const tenantName = headersList.get("x-tenant-name");
    const tenantConfig = headersList.get("x-tenant-config");

    return {
      id: tenantIdFromHeader,
      slug: tenantSlug || "",
      name: tenantName || "",
      config: tenantConfig ? JSON.parse(tenantConfig) : {},
    } as Tenant;
  }

  if (process.env.NODE_ENV === "development") {
    const devTenant = await tenantService.getTenantBySlug(DEV_TENANT_SLUG);

    if (devTenant) {
      console.log(
        `[DEV MODE] Tenant resolved via slug fallback: ${devTenant.id}`
      );
      // This is the full Tenant object from the database, which is reliable
      return devTenant;
    }
    console.warn(
      `[DEV MODE] Could not find fallback tenant '${DEV_TENANT_SLUG}'. Run 'npm run db:seed'.`
    );
    // We still allow it to return null if the dev tenant hasn't been seeded
    return null;
  }
  // Production, no header
  return null;
}

/**
 * Get current tenant ID from request headers
 */
export async function getCurrentTenantId(): Promise<string | null> {
  const tenant = await getCurrentTenant();
  return tenant?.id || null;
}

/**
 * Ensure a tenant ID is available, throw if not
 */
export async function requireTenantId(): Promise<string> {
  const tenantId = await getCurrentTenantId();
  if (!tenantId) {
    throw new Error("Tenant context is required but not available");
  }
  return tenantId;
}

/**
 * Wrapper for tenant-scoped database queries
 * Automatically adds tenant_id filtering
 */
export async function withTenant<T>(
  callback: (tenantId: string) => Promise<T>
): Promise<T> {
  const tenantId = await requireTenantId();
  return callback(tenantId);
}

/**
 * Check if current tenant has a specific feature enabled
 */
export async function hasTenantFeature(feature: string): Promise<boolean> {
  const tenant = await getCurrentTenant();
  if (!tenant) return false;

  const features = tenant.config?.features || {};
  return features[feature] === true;
}

/**
 * Get tenant theme configuration
 */
export async function getTenantTheme() {
  const tenant = await getCurrentTenant();
  if (!tenant) {
    return {
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      fontFamily: "Inter",
      borderRadius: "8px",
      darkMode: false,
    };
  }

  return (
    tenant.config?.theme || {
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      fontFamily: "Inter",
      borderRadius: "8px",
      darkMode: false,
    }
  );
}
